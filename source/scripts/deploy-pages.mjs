#!/usr/bin/env node
// Publish dist/ to the `gh-pages` branch, the branch GitHub Pages serves.
//
// Why a branch: Pages used to serve the root of `main`, which put the React
// source, the Workers and their tests on qector.store and left every old
// build's hashed files in the repository. The branch holds the built site and
// nothing else, and needs no GitHub Actions minutes.
//
// Usage, from source/:
//   npm run build && npm run deploy             commit to the local branch only
//   npm run build && npm run deploy -- --push   also push, which publishes
//
// Tabs that were open before a deploy keep working: the hashed files of the
// previous build are kept for one more generation (.deploy-manifest.json
// records which files belong to the current one).

import { execFileSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const BRANCH = 'gh-pages';
const MANIFEST = '.deploy-manifest.json';
const sourceDir = resolve(import.meta.dirname, '..');
const repo = resolve(sourceDir, '..');
const dist = join(sourceDir, 'dist');
const push = process.argv.includes('--push');

const git = (args, cwd = repo) => execFileSync('git', args, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
const tryGit = (args, cwd) => {
  try {
    return git(args, cwd);
  } catch {
    return null;
  }
};
const fail = (message) => {
  console.error(`deploy: ${message}`);
  process.exit(1);
};

// ── What is about to be published ───────────────────────────────────────────
for (const required of ['index.html', '404.html', 'CNAME', '.nojekyll', 'sitemap.xml', 'assets']) {
  if (!existsSync(join(dist, required))) fail(`dist/${required} is missing. Run \`npm run build\` first.`);
}
// A build without the prerender step has no page footer in its route shells.
if (!readFileSync(join(dist, 'pricing', 'index.html'), 'utf8').includes('<footer')) {
  fail('dist/ holds summary shells, not prerendered pages. Run the full `npm run build` (Playwright).');
}
const assets = readdirSync(join(dist, 'assets')).sort();
const commit = git(['rev-parse', '--short', 'HEAD']);
const dirty = git(['status', '--porcelain', '--', 'source', ':!source/dist']) !== '';
if (dirty) console.warn('deploy: source/ has uncommitted changes; the published build will not match a commit.');

// ── A scratch checkout of the deploy branch ─────────────────────────────────
const work = mkdtempSync(join(tmpdir(), 'qector-deploy-'));
const cleanup = () => {
  tryGit(['worktree', 'remove', '--force', work]);
  rmSync(work, { recursive: true, force: true });
};

try {
  tryGit(['fetch', '--quiet', 'origin', BRANCH]);
  const base = tryGit(['rev-parse', '--verify', '--quiet', `origin/${BRANCH}`]) || tryGit(['rev-parse', '--verify', '--quiet', BRANCH]);
  if (base) {
    git(['worktree', 'add', '--quiet', '--force', '-B', BRANCH, work, base]);
  } else {
    git(['worktree', 'add', '--quiet', '--detach', work]);
    git(['checkout', '--quiet', '--orphan', BRANCH], work);
  }

  // Hashed files of the build that is live right now: kept for one generation.
  // Publishing the same build twice keeps what was already being kept.
  let previous = [];
  try {
    const manifest = JSON.parse(readFileSync(join(work, MANIFEST), 'utf8'));
    const live = manifest.assets ?? [];
    const sameBuild = live.length === assets.length && live.every((name) => assets.includes(name));
    previous = sameBuild ? manifest.previous_assets ?? [] : live;
  } catch {
    // First deploy with this script: nothing to carry over.
  }
  const carried = join(work, '..', `${work.split('/').pop()}-carried`);
  mkdirSync(carried, { recursive: true });
  const kept = [];
  for (const name of previous) {
    const from = join(work, 'assets', name);
    if (!assets.includes(name) && /^[\w.-]+$/.test(name) && existsSync(from)) {
      cpSync(from, join(carried, name));
      kept.push(name);
    }
  }

  // Replace the tree with the new build.
  for (const entry of readdirSync(work)) {
    if (entry !== '.git') rmSync(join(work, entry), { recursive: true, force: true });
  }
  cpSync(dist, work, { recursive: true });
  for (const name of kept) cpSync(join(carried, name), join(work, 'assets', name));
  rmSync(carried, { recursive: true, force: true });
  writeFileSync(
    join(work, MANIFEST),
    `${JSON.stringify({ source_commit: `${commit}${dirty ? '+uncommitted' : ''}`, assets, previous_assets: kept.sort() }, null, 1)}\n`,
  );

  git(['add', '--all'], work);
  if (git(['status', '--porcelain'], work) === '') {
    console.log('deploy: the branch already holds this build; nothing to publish.');
  } else {
    git(['commit', '--quiet', '-m', `deploy: site at ${commit}${dirty ? ' (plus uncommitted changes)' : ''}`], work);
    console.log(`deploy: committed to ${BRANCH} (${assets.length} hashed files, ${kept.length} kept from the previous build).`);
    console.log(git(['show', '--stat', '--format=%h %s', 'HEAD'], work).split('\n').slice(-1)[0]);
  }

  if (push) {
    git(['push', 'origin', `${BRANCH}:${BRANCH}`], work);
    console.log(`deploy: pushed. GitHub Pages publishes ${BRANCH} within a minute or two.`);
  } else {
    console.log(`deploy: not pushed. Review with \`git log -1 --stat ${BRANCH}\`, then run \`npm run deploy -- --push\`.`);
  }
} finally {
  cleanup();
}

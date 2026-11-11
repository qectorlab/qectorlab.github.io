import { Link } from 'react-router-dom';
import { SEO, JsonLd } from '../lib/seo';
import NeuralReveal from '../components/NeuralReveal';
import MetricCard from '../components/MetricCard';
import AlgorithmCard from '../components/AlgorithmCard';
import SectionHeader from '../components/SectionHeader';
import EvidenceBlock from '../components/EvidenceBlock';
import { usePyPIVersion } from '../hooks/usePyPIVersion';
import {
  PYPI_CURRENT_RELEASE,
  PYPI_FIRST_STABLE_RELEASE,
  PYPI_VERSION,
  PYPI_WHEELS,
  PYTHON_RANGE_FR,
} from '../lib/releases';

// French twin of /decoder. Same facts, same order; keep the two in sync.

const STABLE = [
  { name: 'Union-Find', tag: 'Quasi linéaire', color: 'green', desc: 'Décodeur approché en temps quasi linéaire. L’option à haut débit pour les codes de type graphe : échange un peu de précision sur le taux d’erreur logique contre de la vitesse.' },
  { name: 'Fast Union-Find', tag: 'Chemin rapide', color: 'green', desc: 'Chemin Union-Find optimisé pour les pipelines de simulation hors ligne à faible latence.' },
  { name: 'Blossom MWPM', tag: 'Référence exacte', color: 'gold', desc: 'Couplage parfait de poids minimal exact pour les codes de type graphe. Le décodeur de référence des codes de surface.' },
  { name: 'Décodage par lots CPU et GPU', tag: 'Parallèle', color: 'gold', desc: 'Décodage par lots natif CUDA / OpenCL pour les charges prises en charge. Le débit dépend du matériel et de la taille des lots; CUDA accepte edge_weights et precision="f64" depuis la v1.0.0.' },
] as const;

const RESEARCH = [
  { name: 'BP-OSD', tag: 'Recherche qLDPC', desc: 'Propagation de croyance + décodage par statistiques ordonnées. La v1.0.0 ajoute les ordonnancements Relay-BP, CS-OSD(lambda, w) et l’amortissement des LLR.' },
  { name: 'Belief-Matching', tag: 'Bruit corrélé', desc: 'Prétraitement BP + MWPM exact repondéré. Voie de recherche pour le bruit corrélé.' },
  { name: 'Sparse Blossom', tag: 'Quasi optimal', desc: 'Variante blossom par croissance de régions pour les graphes de détecteurs. Chemin sans allocation depuis la v1.0.0.' },
  { name: 'Hybrid et AutoDecoder', tag: 'Routage adaptatif', desc: 'AutoDecoder et HybridDecoder choisissent entre Union-Find et Blossom selon les propriétés du code.' },
  { name: 'Décodeur à table', tag: 'Petits codes', desc: 'Table de corrections précalculée pour les petits codes ou des sous-espaces de syndromes.' },
  { name: 'Code couleur / Deux étapes / Grappes d’ambiguïté', tag: 'Recherche', desc: 'Familles ajoutées en v1.0.0 : ColourCodeDecoder (cluster_bposd optionnel), TwoStageDecoder, AmbiguityClusterDecoder.' },
];

const SPECS: [string, string][] = [
  ['Langages', `Noyau Rust (PyO3) / API Python ${PYTHON_RANGE_FR}`],
  ['Plateformes', 'Linux x86_64, macOS arm64, Windows amd64'],
  ['GPU', 'Chemins par lots CUDA / OpenCL (configurations prises en charge selon la documentation)'],
  ['Bibliothèque QEC', 'Stim (simulation de bruit sur circuits quantiques)'],
  ['Distribution', 'Roues binaires PyPI (manylinux, macOS, Windows)'],
  ['Licence', 'PolyForm Noncommercial 1.0.0 (communauté) / commerciale'],
  ['Validation', 'GitHub : github.com/GuillaumeLessard/qector-decoder'],
];

export default function DecoderFR() {
  const { version: pypiVersion } = usePyPIVersion();
  return (
    <>
      <SEO
        title="QECTOR Decoder v3 · Décodage QEC pour Python"
        description={`QECTOR Decoder v3 : 17 configurations de décodeurs dans une seule bibliothèque Python. Version stable ${PYPI_VERSION} (${PYPI_WHEELS} roues, Python ${PYTHON_RANGE_FR}), paliers de stabilité d’API, Relay-BP, CS-OSD, Sinter et qiskit, et le banc d’essai qector bench.`}
        lang="fr"
        alternates={[
          { lang: 'en', href: 'https://qector.store/decoder/' },
          { lang: 'fr', href: 'https://qector.store/fr/decoder/' },
        ]}
      />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'SoftwareApplication',
          name: 'QECTOR Decoder v3',
          inLanguage: 'fr',
          description: 'Décodeur polyalgorithmique de correction d’erreurs quantiques pour Python, avec MWPM exact et Belief-Matching.',
          applicationCategory: 'DeveloperApplication',
          operatingSystem: 'Linux, macOS, Windows',
          programmingLanguage: 'Python',
          url: 'https://qector.store/fr/decoder/',
          downloadUrl: 'https://pypi.org/project/qector-decoder-v3/',
          softwareVersion: pypiVersion,
          offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD', availability: 'https://schema.org/InStock' },
        }}
      />

      <section className="relative py-24 md:py-32 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-300/5 via-surface/30 to-void" />
        <div className="relative z-10 section-padding">
          <div className="eyebrow-pill mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-300 animate-pulse-dot" />
            v{pypiVersion} (code source disponible) · Workbench gratuit
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.1] mb-6">
            <NeuralReveal text="QECTOR Decoder v3" className="text-4xl md:text-6xl font-extrabold" />
          </h1>
          <p className="text-secondary text-lg md:text-xl max-w-3xl mx-auto leading-relaxed mb-8">
            Bibliothèque Python à noyau Rust offrant 17 configurations de décodeurs, du MWPM exact au décodage GPU par lots.
            La v{PYPI_VERSION} est la version stable actuelle : paliers de stabilité d’API, Relay-BP et CS-OSD, points d’entrée Sinter et qiskit,
            et l’outil en ligne de commande qector, avec une provenance de compilation pour chaque roue. Le banc d’essai reproductible
            qector bench est inclus pour mesurer sur votre propre matériel. Compatible Stim, roues binaires sur PyPI, artefacts publiés sur{' '}
            <a href="https://github.com/GuillaumeLessard/qector-decoder" target="_blank" rel="noopener noreferrer" className="text-cyan-300 hover:underline">GitHub</a>.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <a href="https://pypi.org/project/qector-decoder-v3/" target="_blank" rel="noopener noreferrer" className="btn-cyan">pip install qector-decoder-v3</a>
            <Link to="/fr/pricing" className="btn-outline">Voir les forfaits</Link>
          </div>
        </div>
      </section>

      <section className="section-padding pb-24">
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Configurations', value: '17', desc: 'Du MWPM exact au GPU par lots, selon des paliers de stabilité documentés' },
              { label: 'Roues binaires', value: String(PYPI_WHEELS), desc: `Python ${PYTHON_RANGE_FR} sur Windows amd64, Linux x86_64 et macOS arm64` },
              { label: 'API stable', value: `v${PYPI_VERSION}`, desc: 'Version stable avec paliers de stabilité d’API documentés' },
              { label: 'Tests CI', value: 'Automatisés', desc: 'Validation continue et comparaison avec Stim sur GitHub' },
            ].map((m) => (
              <MetricCard key={m.label} label={m.label} value={m.value} desc={m.desc} centered />
            ))}
          </div>

          <div>
            <SectionHeader
              align="left"
              maxWidth="max-w-none"
              heading="Algorithmes de décodage"
              description="Décodeurs stables avec artefacts de validation sur GitHub; les décodeurs expérimentaux sont au stade de la recherche. Depuis la v1.0.0, l’API publique est figée selon des paliers de stabilité documentés. Aucun chiffre de performance universel n’est publié : mesurez sur votre matériel avec qector bench."
              className="mb-6"
            />
            <h2 className="text-xs font-semibold text-cyan-300 uppercase tracking-widest mb-3">Décodeurs stables</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {STABLE.map((a) => (
                <AlgorithmCard key={a.name} title={a.name} badge={{ label: a.tag, color: a.color }} desc={a.desc} />
              ))}
            </div>
            <h2 className="text-xs font-semibold text-gold-400 uppercase tracking-widest mb-3">Décodeurs expérimentaux et de recherche</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {RESEARCH.map((a) => (
                <AlgorithmCard key={a.name} title={a.name} badge={{ label: a.tag, color: 'gold' }} desc={a.desc} muted />
              ))}
            </div>
          </div>

          <div className="card-surface">
            <h2 className="text-cyan-300 font-semibold text-sm uppercase tracking-wider mb-4">Caractéristiques techniques</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {SPECS.map(([k, v]) => (
                <div key={k} className="flex gap-3">
                  <span className="text-muted-foreground text-sm min-w-[140px] shrink-0">{k}</span>
                  <span className="text-secondary text-sm min-w-0 break-words">{v}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <EvidenceBlock
              title="État de la validation"
              statement={`La v${PYPI_FIRST_STABLE_RELEASE.version} (${PYPI_FIRST_STABLE_RELEASE.releaseDate}) a été la première version stable; la v${PYPI_CURRENT_RELEASE.version} (${PYPI_CURRENT_RELEASE.releaseDate}) est la version actuelle. Chaque décodage est vérifié contre son syndrome (H·c = s) et les manifestes d’artefacts sont scellés par SHA-256 sur GitHub. Aucun chiffre de performance universel n’est publié; qector bench est inclus pour mesurer sur votre matériel.`}
              href="https://github.com/GuillaumeLessard/qector-decoder"
              linkLabel="Artefacts et banc d’essai sur GitHub →"
            />
            <p className="text-sm mt-3 px-1">
              <Link to="/decoder" hrefLang="en" lang="en" className="text-cyan-300 hover:underline">Detailed English page</Link>
              <span className="text-muted-foreground"> · </span>
              <Link to="/getting-started" hrefLang="en" className="text-cyan-300 hover:underline">Tutoriel (en anglais)</Link>
            </p>
          </div>

          <div className="text-center py-8">
            <div className="inline-flex flex-wrap gap-4 justify-center">
              <a href="https://pypi.org/project/qector-decoder-v3/" target="_blank" rel="noopener noreferrer" className="btn-cyan">pip install qector-decoder-v3</a>
              <Link to="/fr/license" className="btn-gold">Licences commerciales</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

(() => {
  const qectorTools = [
    {
      name: "qector_get_install_command",
      description: "Return the official public QECTOR Decoder 3 PyPI install and verification commands.",
      inputSchema: { type: "object", properties: {}, additionalProperties: false },
      execute: async () => ({
        package: "qector-decoder-v3",
        install: "pip install qector-decoder-v3",
        verify: "python -c \"from qector_decoder_v3 import UnionFindDecoder, BlossomDecoder; print('QECTOR OK')\"",
        docs: "https://qector.store/installer.html"
      })
    },
    {
      name: "qector_open_resource",
      description: "Open a public QECTOR resource such as docs, pricing, contact, PyPI, GitHub, or DOI.",
      inputSchema: {
        type: "object",
        properties: {
          resource: {
            type: "string",
            enum: ["home", "install", "docs", "benchmarks", "pricing", "commercial", "contact", "pypi", "github", "doi"]
          }
        },
        required: ["resource"],
        additionalProperties: false
      },
      execute: async ({ resource }) => {
        const urls = {
          home: "https://qector.store/",
          install: "https://qector.store/installer.html",
          docs: "https://qector.store/docs.html",
          benchmarks: "https://qector.store/benchmarks.html",
          pricing: "https://qector.store/pricing.html",
          commercial: "https://qector.store/commercial.html",
          contact: "https://qector.store/contact.html",
          pypi: "https://pypi.org/project/qector-decoder-v3/",
          github: "https://github.com/GuillaumeLessard/qector-decoder",
          doi: "https://doi.org/10.5281/zenodo.20825980"
        };
        return { resource, url: urls[resource] || urls.home };
      }
    },
    {
      name: "qector_request_commercial_license",
      description: "Return the official human-reviewed QECTOR commercial licensing contact path.",
      inputSchema: {
        type: "object",
        properties: {
          organization: { type: "string" },
          intended_use: { type: "string" },
          tier: { type: "string", enum: ["commercial_evaluation", "startup", "professional_lab", "enterprise_oem", "not_sure"] }
        },
        additionalProperties: false
      },
      execute: async (input = {}) => ({
        contact: "https://qector.store/contact.html",
        email: "admin@qector.store",
        requires_written_permission: true,
        submitted_context: input
      })
    }
  ];

  async function registerWebMCP() {
    try {
      const modelContext = navigator.modelContext;
      if (!modelContext || typeof modelContext.provideContext !== "function") return;
      await modelContext.provideContext({
        name: "QECTOR Store",
        description: "Agent tools for QECTOR Decoder 3 public install, documentation, artifact review, and commercial licensing paths.",
        tools: qectorTools
      });
      document.documentElement.setAttribute("data-webmcp", "ready");
    } catch (_) {
      document.documentElement.setAttribute("data-webmcp", "unavailable");
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", registerWebMCP, { once: true });
  } else {
    registerWebMCP();
  }
})();

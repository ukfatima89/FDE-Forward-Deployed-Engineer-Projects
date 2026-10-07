/**
 * VERTEX FORWARD - Interactive Engine
 * Handles terminal emulation, ROI calculator, architecture switcher,
 * pod selector, case study filtering, and technical intake modal.
 */

document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide) {
    window.lucide.createIcons();
  }
  initNavbar();
  initTerminal();
  initRoiCalculator();
  initArchitectureExplorer();
  initCaseStudyFilter();
  initFaqAccordion();
  initIntakeModal();
  initSmoothScroll();
});

/* =========================================================================
   1. NAVBAR SCROLL EFFECT & MOBILE MENU
   ========================================================================= */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const closeMenuBtn = document.getElementById('close-mobile-menu');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      navbar.classList.add('bg-slate-950/85', 'backdrop-blur-md', 'border-slate-800/80', 'shadow-2xl');
      navbar.classList.remove('bg-transparent', 'border-transparent');
    } else {
      navbar.classList.remove('bg-slate-950/85', 'backdrop-blur-md', 'border-slate-800/80', 'shadow-2xl');
      navbar.classList.add('bg-transparent', 'border-transparent');
    }
  });

  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });
  }

  if (closeMenuBtn && mobileMenu) {
    closeMenuBtn.addEventListener('click', () => {
      mobileMenu.classList.add('hidden');
    });
  }

  // Close mobile menu on clicking any navigation link
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (mobileMenu) mobileMenu.classList.add('hidden');
    });
  });
}

/* =========================================================================
   2. INTERACTIVE TERMINAL EMULATION
   ========================================================================= */
const terminalSequences = {
  ai: [
    { text: "$ vertex deploy --pod bravo --target k8s-ai-cluster", type: "command" },
    { text: "✔ Authenticated with client AWS GovCloud VPC [mTLS 1.3]", type: "success" },
    { text: "ℹ Scanning proprietary data boundary: Zero telemetry leaks verified", type: "info" },
    { text: "⚡ Mounting quantized Llama-3-70B-Instruct & Mixtral MoE weights", type: "system" },
    { text: "⚡ Initializing Qdrant Vector Mesh across 12 distributed nodes", type: "system" },
    { text: "✔ Synthetic benchmark: 10,000 prompt evals completed", type: "success" },
    { text: "⚡ P99 latency: 32ms | Token throughput: 1,420 tokens/sec", type: "metric" },
    { text: "✔ Self-healing guardrails activated (Nemo + custom PII filter)", type: "success" },
    { text: "🚀 Production Pod READY. Forward engineer handover initiated.", type: "done" }
  ],
  security: [
    { text: "$ vertex audit-security --compliance soc2-hipaa --isolated", type: "command" },
    { text: "✔ Air-gap sandbox validated. Ingress/Egress lockdown active.", type: "success" },
    { text: "ℹ KMS encryption keys held exclusively in client HSM module", type: "info" },
    { text: "ℹ Static AST & dynamic taint analysis for agent tools: 0 CVEs", type: "info" },
    { text: "✔ RBAC & Attribute-based Token Masking enforced at Gateway", type: "success" },
    { text: "⚡ Real-time honeypot & prompt injection shielding operational", type: "metric" },
    { text: "🚀 Enterprise Compliance Clearance Score: 100/100", type: "done" }
  ],
  data: [
    { text: "$ vertex pipeline --sync-stream kafka-flink --lakehouse iceberg", type: "command" },
    { text: "✔ Connected to 48 legacy database shards & CDC pipelines", type: "success" },
    { text: "⚡ Flink stateful window aggregation throughput: 850,000 events/sec", type: "metric" },
    { text: "✔ Apache Iceberg table write latency: 45ms median", type: "success" },
    { text: "ℹ Vector embedding sync lag: 12ms (Near real-time delta)", type: "info" },
    { text: "🚀 High-throughput enterprise data fabric deployed to prod.", type: "done" }
  ]
};

let activeTerminalTab = 'ai';
let terminalInterval = null;
let currentLineIndex = 0;

function initTerminal() {
  const terminalBody = document.getElementById('terminal-logs');
  const tabs = document.querySelectorAll('.term-tab');
  const pauseBtn = document.getElementById('term-pause-btn');
  const restartBtn = document.getElementById('term-restart-btn');

  if (!terminalBody) return;

  function renderTerminal() {
    clearInterval(terminalInterval);
    terminalBody.innerHTML = '';
    currentLineIndex = 0;
    const lines = terminalSequences[activeTerminalTab];

    function appendLine() {
      if (currentLineIndex >= lines.length) {
        clearInterval(terminalInterval);
        return;
      }

      const item = lines[currentLineIndex];
      const lineDiv = document.createElement('div');
      lineDiv.className = 'font-mono text-xs sm:text-sm leading-relaxed mb-1 flex items-start gap-2';

      let content = '';
      if (item.type === 'command') {
        content = `<span class="text-emerald-400 font-semibold">${item.text}</span>`;
      } else if (item.type === 'success') {
        content = `<span class="text-cyan-400">✔</span> <span class="text-slate-200">${item.text.replace('✔', '')}</span>`;
      } else if (item.type === 'metric') {
        content = `<span class="text-amber-400">⚡</span> <span class="text-amber-200 font-medium">${item.text.replace('⚡', '')}</span>`;
      } else if (item.type === 'info') {
        content = `<span class="text-blue-400">ℹ</span> <span class="text-slate-400">${item.text.replace('ℹ', '')}</span>`;
      } else if (item.type === 'system') {
        content = `<span class="text-purple-400">⚙</span> <span class="text-purple-200">${item.text.replace('⚡', '')}</span>`;
      } else if (item.type === 'done') {
        content = `<span class="text-emerald-300 font-bold bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded">${item.text}</span>`;
      }

      lineDiv.innerHTML = content;
      terminalBody.appendChild(lineDiv);
      terminalBody.scrollTop = terminalBody.scrollHeight;
      currentLineIndex++;
    }

    // Print first command immediately
    appendLine();
    terminalInterval = setInterval(appendLine, 950);
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => {
        t.classList.remove('bg-slate-800', 'text-cyan-400', 'border-cyan-500/50');
        t.classList.add('bg-slate-900/50', 'text-slate-400', 'border-transparent');
      });
      tab.classList.add('bg-slate-800', 'text-cyan-400', 'border-cyan-500/50');
      tab.classList.remove('bg-slate-900/50', 'text-slate-400', 'border-transparent');
      activeTerminalTab = tab.getAttribute('data-tab');
      renderTerminal();
    });
  });

  if (pauseBtn) {
    let isPaused = false;
    pauseBtn.addEventListener('click', () => {
      if (isPaused) {
        isPaused = false;
        pauseBtn.innerHTML = `<span>Pause</span>`;
        terminalInterval = setInterval(() => {
          const lines = terminalSequences[activeTerminalTab];
          if (currentLineIndex < lines.length) {
            // Re-trigger via interval
            const item = lines[currentLineIndex];
            const lineDiv = document.createElement('div');
            lineDiv.className = 'font-mono text-xs sm:text-sm leading-relaxed mb-1 flex items-start gap-2';
            lineDiv.innerHTML = `<span class="text-cyan-300">${item.text}</span>`;
            terminalBody.appendChild(lineDiv);
            terminalBody.scrollTop = terminalBody.scrollHeight;
            currentLineIndex++;
          }
        }, 950);
      } else {
        isPaused = true;
        clearInterval(terminalInterval);
        pauseBtn.innerHTML = `<span>Resume</span>`;
      }
    });
  }

  if (restartBtn) {
    restartBtn.addEventListener('click', () => {
      renderTerminal();
    });
  }

  renderTerminal();
}

/* =========================================================================
   3. INTERACTIVE ROI & VELOCITY CALCULATOR
   ========================================================================= */
function initRoiCalculator() {
  const projectScopeSelect = document.getElementById('calc-scope');
  const internalTeamSlider = document.getElementById('calc-team-slider');
  const teamValDisplay = document.getElementById('calc-team-val');
  const timelineSlider = document.getElementById('calc-timeline-slider');
  const timelineValDisplay = document.getElementById('calc-timeline-val');

  // Outputs
  const outTimeSaved = document.getElementById('calc-out-time-saved');
  const outCostSaved = document.getElementById('calc-out-cost-saved');
  const outMultiplier = document.getElementById('calc-out-multiplier');
  const outFdeDuration = document.getElementById('calc-out-fde-duration');
  const outProgressBar = document.getElementById('calc-progress-bar');

  if (!internalTeamSlider || !timelineSlider) return;

  const scopeFactors = {
    agentic: { complexity: 1.35, fdeTimeRatio: 0.22, riskWeight: 1.4 },
    data: { complexity: 1.2, fdeTimeRatio: 0.25, riskWeight: 1.2 },
    modernize: { complexity: 1.5, fdeTimeRatio: 0.30, riskWeight: 1.6 },
    sovereign: { complexity: 1.65, fdeTimeRatio: 0.28, riskWeight: 1.8 }
  };

  function updateCalculator() {
    const scope = projectScopeSelect ? projectScopeSelect.value : 'agentic';
    const teamSize = parseInt(internalTeamSlider.value, 10);
    const monthsStandard = parseInt(timelineSlider.value, 10);

    teamValDisplay.textContent = `${teamSize} Engineers`;
    timelineValDisplay.textContent = `${monthsStandard} Months`;

    const factor = scopeFactors[scope] || scopeFactors.agentic;

    // Standard in-house cost: ~$16,500/month per senior engineer + 25% infra/overhead
    const monthlyCostPerEng = 16500;
    const internalTotalCost = teamSize * monthlyCostPerEng * monthsStandard * 1.25;

    // FDE Timeline: Reduced drastically
    const fdeMonths = Math.max(1, Math.round(monthsStandard * factor.fdeTimeRatio * 10) / 10);
    const fdeWeeks = Math.max(3, Math.round(fdeMonths * 4.3));

    // Time saved
    const monthsSaved = Math.max(1, Math.round((monthsStandard - fdeMonths) * 10) / 10);

    // FDE investment is high value, but saves massive overhead and hiring delay
    // Opportunity + engineer burn saved:
    const engineeringBurnSaved = Math.round(internalTotalCost * 0.48);
    const multiplier = (monthsStandard / fdeMonths).toFixed(1);

    // Format displays
    if (outTimeSaved) outTimeSaved.textContent = `${monthsSaved} Mo. Saved`;
    if (outCostSaved) outCostSaved.textContent = `$${(engineeringBurnSaved / 1000).toFixed(0)}k+`;
    if (outMultiplier) outMultiplier.textContent = `${multiplier}x Faster`;
    if (outFdeDuration) outFdeDuration.textContent = `~${fdeWeeks} Weeks to Production`;

    if (outProgressBar) {
      const percentageSaved = Math.min(88, Math.max(40, Math.round(((monthsStandard - fdeMonths) / monthsStandard) * 100)));
      outProgressBar.style.width = `${percentageSaved}%`;
    }
  }

  internalTeamSlider.addEventListener('input', updateCalculator);
  timelineSlider.addEventListener('input', updateCalculator);
  if (projectScopeSelect) {
    projectScopeSelect.addEventListener('change', updateCalculator);
  }

  updateCalculator();
}

/* =========================================================================
   4. ARCHITECTURE BLUEPRINT EXPLORER
   ========================================================================= */
const archTopologies = {
  agentic: {
    title: "Enterprise Agentic RAG & Multi-Model Swarm",
    badge: "GenAI & Agentic Orchestration",
    description: "Production-grade dual-retrieval pipeline with semantic caching, asynchronous tool execution, real-time guardrails, and model evaluations.",
    throughput: "14,500 Queries / min",
    latency: "38ms P99",
    security: "Zero Telemetry Leakage (VPC Isolated)",
    stack: ["Qdrant", "vLLM", "NeMo Guardrails", "LangGraph", "OpenTelemetry", "Docker"],
    nodes: [
      { step: "01", name: "Semantic Gateway", desc: "Token authentication, semantic cache lookup & rate limiting" },
      { step: "02", name: "Hybrid Retriever", desc: "Dense vector embeddings + sparse BM25 reranking" },
      { step: "03", name: "Agent Swarm Engine", desc: "Cooperative autonomous agents with sandboxed Python tool execution" },
      { step: "04", name: "PII & Hallucination Guardrail", desc: "Sub-10ms deterministic safety validator before egress" }
    ]
  },
  streaming: {
    title: "High-Throughput Real-Time Event Fabric",
    badge: "Data Lakehouse & Streaming",
    description: "Zero-loss event streaming architecture bridging legacy mainframe transaction logs into sub-second vector updates and lakehouse analytics.",
    throughput: "1,200,000 Events / sec",
    latency: "12ms Event-to-Query",
    security: "AES-256 GCM + End-to-End Key Rotation",
    stack: ["Apache Kafka", "Apache Flink", "Apache Iceberg", "DuckDB", "Rust", "Grafana"],
    nodes: [
      { step: "01", name: "CDC Ingestion Shards", desc: "Debezium zero-impact log scraping from Oracle/Postgres/DB2" },
      { step: "02", name: "Flink Stream Processors", desc: "Stateful window aggregations and feature enrichment" },
      { step: "03", name: "Iceberg Storage Engine", desc: "Columnar Parquet storage with time-travel & zero-copy branching" },
      { step: "04", name: "Low-Latency Serving Layer", desc: "Distributed in-memory caching for real-time dashboards & APIs" }
    ]
  },
  sovereign: {
    title: "Air-Gapped Sovereign AI Cloud",
    badge: "Defense & Regulated Healthcare",
    description: "Self-contained on-premise Kubernetes cluster operating inside isolated SCIF or GovCloud environments with zero external dependencies.",
    throughput: "99.999% SLA (Air-Gapped)",
    latency: "22ms Node Interconnect",
    security: "FedRAMP High & ITAR Ready",
    stack: ["Bare-metal K8s", "NVIDIA Triton", "Harbor Registry", "WireGuard", "Vault", "Falco"],
    nodes: [
      { step: "01", name: "Enclave Security Perimeters", desc: "Hardware security module (HSM) identity validation" },
      { step: "02", name: "Air-Gapped Triton Server", desc: "TensorRT-LLM optimized weights on local H100/A100 clusters" },
      { step: "03", name: "Encrypted Vector Ledger", desc: "Immutable cryptographic ledger for tamper-evident provenance" },
      { step: "04", name: "Continuous Compliance Daemon", desc: "Real-time automated audit log capture & STIG validation" }
    ]
  }
};

function initArchitectureExplorer() {
  const tabs = document.querySelectorAll('.arch-tab');
  const titleEl = document.getElementById('arch-title');
  const badgeEl = document.getElementById('arch-badge');
  const descEl = document.getElementById('arch-desc');
  const throughputEl = document.getElementById('arch-throughput');
  const latencyEl = document.getElementById('arch-latency');
  const securityEl = document.getElementById('arch-security');
  const stackContainer = document.getElementById('arch-stack');
  const nodesContainer = document.getElementById('arch-nodes');

  if (!titleEl || !nodesContainer) return;

  function loadTopology(key) {
    const data = archTopologies[key] || archTopologies.agentic;

    titleEl.textContent = data.title;
    if (badgeEl) badgeEl.textContent = data.badge;
    descEl.textContent = data.description;
    throughputEl.textContent = data.throughput;
    latencyEl.textContent = data.latency;
    securityEl.textContent = data.security;

    // Render stack tags
    stackContainer.innerHTML = '';
    data.stack.forEach(tech => {
      const tag = document.createElement('span');
      tag.className = 'px-2.5 py-1 text-xs font-mono font-medium rounded-md bg-slate-800/80 text-cyan-300 border border-slate-700/60 shadow-sm';
      tag.textContent = tech;
      stackContainer.appendChild(tag);
    });

    // Render nodes
    nodesContainer.innerHTML = '';
    data.nodes.forEach(node => {
      const nodeCard = document.createElement('div');
      nodeCard.className = 'p-4 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 transition-all flex items-start gap-3.5 group';
      nodeCard.innerHTML = `
        <span class="text-xs font-mono font-bold px-2 py-1 rounded bg-cyan-950/70 border border-cyan-500/30 text-cyan-400 shrink-0">
          ${node.step}
        </span>
        <div>
          <h4 class="text-sm font-semibold text-white group-hover:text-cyan-300 transition-colors">${node.name}</h4>
          <p class="text-xs text-slate-400 mt-1 leading-relaxed">${node.desc}</p>
        </div>
      `;
      nodesContainer.appendChild(nodeCard);
    });
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => {
        t.classList.remove('bg-cyan-500/20', 'text-cyan-300', 'border-cyan-500/40', 'shadow-md');
        t.classList.add('bg-slate-900/60', 'text-slate-400', 'border-slate-800');
      });
      tab.classList.add('bg-cyan-500/20', 'text-cyan-300', 'border-cyan-500/40', 'shadow-md');
      tab.classList.remove('bg-slate-900/60', 'text-slate-400', 'border-slate-800');

      const target = tab.getAttribute('data-arch');
      loadTopology(target);
    });
  });

  loadTopology('agentic');
}

/* =========================================================================
   5. CASE STUDY FILTERING
   ========================================================================= */
function initCaseStudyFilter() {
  const filterBtns = document.querySelectorAll('.case-filter-btn');
  const caseCards = document.querySelectorAll('.case-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => {
        b.classList.remove('bg-cyan-500', 'text-slate-950', 'font-semibold');
        b.classList.add('bg-slate-900/80', 'text-slate-400', 'font-normal');
      });
      btn.classList.add('bg-cyan-500', 'text-slate-950', 'font-semibold');
      btn.classList.remove('bg-slate-900/80', 'text-slate-400', 'font-normal');

      const category = btn.getAttribute('data-category');

      caseCards.forEach(card => {
        if (category === 'all' || card.getAttribute('data-category') === category) {
          card.style.display = 'block';
          card.classList.add('animate-fadeIn');
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* =========================================================================
   6. FAQ ACCORDION
   ========================================================================= */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const trigger = item.querySelector('.faq-trigger');
    const answer = item.querySelector('.faq-answer');
    const icon = item.querySelector('.faq-icon');

    if (!trigger || !answer) return;

    trigger.addEventListener('click', () => {
      const isOpen = !answer.classList.contains('hidden');

      // Close all other items
      faqItems.forEach(otherItem => {
        const otherAnswer = otherItem.querySelector('.faq-answer');
        const otherIcon = otherItem.querySelector('.faq-icon');
        if (otherAnswer && otherAnswer !== answer) {
          otherAnswer.classList.add('hidden');
          if (otherIcon) otherIcon.style.transform = 'rotate(0deg)';
        }
      });

      if (isOpen) {
        answer.classList.add('hidden');
        if (icon) icon.style.transform = 'rotate(0deg)';
      } else {
        answer.classList.remove('hidden');
        if (icon) icon.style.transform = 'rotate(180deg)';
      }
    });
  });
}

/* =========================================================================
   7. TECHNICAL INTAKE & POD SELECTION MODAL
   ========================================================================= */
function initIntakeModal() {
  const modal = document.getElementById('intake-modal');
  const openButtons = document.querySelectorAll('.open-intake-modal');
  const closeButtons = document.querySelectorAll('.close-intake-modal');
  const intakeForm = document.getElementById('intake-form');
  const podSelectInput = document.getElementById('modal-pod-select');
  const successState = document.getElementById('intake-success-state');

  if (!modal) return;

  openButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const requestedPod = btn.getAttribute('data-pod');
      if (requestedPod && podSelectInput) {
        podSelectInput.value = requestedPod;
      }
      modal.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
      if (successState) successState.classList.add('hidden');
      if (intakeForm) intakeForm.classList.remove('hidden');
    });
  });

  closeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      modal.classList.add('hidden');
      document.body.style.overflow = '';
    });
  });

  // Close on outer backdrop click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.add('hidden');
      document.body.style.overflow = '';
    }
  });

  // Handle Form Submission
  if (intakeForm) {
    intakeForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const submitBtn = intakeForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <span class="inline-block animate-spin mr-2">⚙</span>
        <span>Allocating FDE Lead...</span>
      `;

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
        intakeForm.classList.add('hidden');
        if (successState) {
          successState.classList.remove('hidden');
        }
      }, 1200);
    });
  }
}

/* =========================================================================
   8. SMOOTH SCROLLING & INTERACTION HELPER
   ========================================================================= */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '') return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}

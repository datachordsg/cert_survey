const QUESTIONS = [
  {
    "id": "data_structured",
    "domain": "Data",
    "competency": "Prepare & Validate Structured Data",
    "short_label": "Structured data readiness",
    "question": "How important is it that this high-value individual can organise, clean, and validate structured data so the business can rely on it for reporting and decision-making?",
    "in_practice": "Can structure data properly, catch obvious errors, and ensure working data is usable, consistent, and fit for downstream business use."
  },
  {
    "id": "data_quality_integration",
    "domain": "Data",
    "competency": "Diagnose Data Quality & Integration",
    "short_label": "Data quality and integration",
    "question": "How important is it that this person can spot data quality issues, explain what is wrong, and help connect data from different systems or sources?",
    "in_practice": "Can diagnose missing, inconsistent, duplicated, or poorly joined data and work across systems to improve reliability."
  },
  {
    "id": "data_strategy",
    "domain": "Data",
    "competency": "Design Data / Knowledge Strategy",
    "short_label": "Data and knowledge strategy",
    "question": "How important is it that this person can think beyond day-to-day reporting and help shape how data, documentation, and organisational knowledge should be organised for long-term use?",
    "in_practice": "Can design a sensible structure for data, knowledge assets, and information flows so the organisation scales more effectively."
  },
  {
    "id": "descriptive_dashboarding",
    "domain": "Analytics",
    "competency": "Descriptive Analysis & Dashboarding",
    "short_label": "Analysis and dashboards",
    "question": "How important is it that this person can turn business data into clear analysis, practical dashboards, and simple insights that managers can act on?",
    "in_practice": "Can summarise trends, build useful reporting views, and present evidence clearly to non-technical stakeholders."
  },
  {
    "id": "kpi_modelling",
    "domain": "Analytics",
    "competency": "KPI Analysis & Applied Modelling",
    "short_label": "KPI analysis and modelling",
    "question": "How important is it that this person can interpret KPIs properly, investigate performance drivers, and use applied modelling to support business decisions?",
    "in_practice": "Can move from descriptive reporting into deeper analysis of drivers, trade-offs, and likely outcomes."
  },
  {
    "id": "predictive_strategy",
    "domain": "Analytics",
    "competency": "Decision Systems & Predictive Strategy",
    "short_label": "Predictive and decision strategy",
    "question": "How important is it that this person can think ahead, use predictive approaches, and help design decision systems that improve future business actions?",
    "in_practice": "Can frame forward-looking decisions, support scenario thinking, and design data-informed decision logic."
  },
  {
    "id": "ai_productivity",
    "domain": "AI",
    "competency": "AI Productivity & Prompt Use",
    "short_label": "AI productivity use",
    "question": "How important is it that this person can use AI tools productively to speed up work, improve quality, and support everyday business tasks responsibly?",
    "in_practice": "Can use AI well for drafting, analysis support, task acceleration, and first-pass work without over-relying on it."
  },
  {
    "id": "ai_evaluation_workflow",
    "domain": "AI",
    "competency": "AI Evaluation & Workflow Integration",
    "short_label": "AI workflow integration",
    "question": "How important is it that this person can judge whether AI outputs are good enough and integrate AI into real business workflows rather than using it only as a novelty?",
    "in_practice": "Can evaluate usefulness, fit, and risk of AI outputs, and redesign workflows so AI adds measurable value."
  },
  {
    "id": "ai_governance_design",
    "domain": "AI",
    "competency": "AI Governance / Prompt Design / Decision Systems",
    "short_label": "AI governance and decision design",
    "question": "How important is it that this person can design strong prompts, define guardrails, and help shape how AI should be governed in business decisions?",
    "in_practice": "Can set standards, guardrails, decision rules, and prompt logic so AI use is repeatable, safe, and aligned to business needs."
  },
  {
    "id": "workflow_execution",
    "domain": "Process",
    "competency": "Workflow Execution & Task Coordination",
    "short_label": "Workflow execution",
    "question": "How important is it that this person can keep digital work moving by coordinating tasks, managing handoffs, and ensuring execution happens smoothly across teams?",
    "in_practice": "Can turn plans into action, coordinate responsibilities, and maintain operational discipline across workstreams."
  },
  {
    "id": "process_optimization",
    "domain": "Process",
    "competency": "Process Optimization & Automation",
    "short_label": "Process optimization and automation",
    "question": "How important is it that this person can improve inefficient processes and identify where automation can save time, reduce errors, or increase scale?",
    "in_practice": "Can redesign workflows, remove friction, and introduce automation where it improves efficiency and control."
  },
  {
    "id": "enterprise_transformation",
    "domain": "Process",
    "competency": "Enterprise Transformation & Systems Architecture",
    "short_label": "Enterprise transformation",
    "question": "How important is it that this person can think at enterprise level, connecting systems, functions, and change priorities to support digital transformation?",
    "in_practice": "Can see cross-functional implications, system dependencies, and the bigger transformation roadmap."
  },
  {
    "id": "team_reporting",
    "domain": "Communication",
    "competency": "Team Reporting & Professional Communication",
    "short_label": "Professional reporting",
    "question": "How important is it that this person can communicate clearly in reports, updates, and working discussions so that teams stay aligned and informed?",
    "in_practice": "Can write and speak clearly, structure updates well, and communicate professionally across routine business settings."
  },
  {
    "id": "stakeholder_influence",
    "domain": "Communication",
    "competency": "Stakeholder Communication & Influence",
    "short_label": "Stakeholder influence",
    "question": "How important is it that this person can manage stakeholders, explain ideas persuasively, and gain buy-in for digital or operational change?",
    "in_practice": "Can tailor messages to stakeholders, influence decisions, and handle competing expectations."
  },
  {
    "id": "executive_leadership",
    "domain": "Communication",
    "competency": "Executive Leadership, Branding & Negotiation",
    "short_label": "Executive communication and negotiation",
    "question": "How important is it that this person can operate with executive presence, represent the organisation well, and negotiate or influence at senior level?",
    "in_practice": "Can communicate with senior leaders, frame decisions strategically, and represent the organisation with credibility."
  },
  {
    "id": "ethics_privacy_evidence",
    "domain": "Governance",
    "competency": "Ethics, Privacy & Evidence Basics",
    "short_label": "Ethics and evidence basics",
    "question": "How important is it that this person understands ethical handling of data, respects privacy, and uses evidence properly rather than making unsupported claims?",
    "in_practice": "Can recognise basic ethical and privacy obligations and grounds recommendations in evidence."
  },
  {
    "id": "risk_bias_compliance",
    "domain": "Governance",
    "competency": "Risk, Bias & Compliance Evaluation",
    "short_label": "Risk and compliance evaluation",
    "question": "How important is it that this person can identify risks, challenge bias, and assess whether digital or AI-enabled work meets compliance expectations?",
    "in_practice": "Can evaluate risks, spot bias or weak controls, and raise compliance concerns before they become problems."
  },
  {
    "id": "responsible_ai_systems",
    "domain": "Governance",
    "competency": "Responsible AI, Governance & Compliance Systems",
    "short_label": "Responsible AI systems",
    "question": "How important is it that this person can help build responsible AI practices, governance routines, and compliance systems that the organisation can trust at scale?",
    "in_practice": "Can help institutionalise responsible AI governance, monitoring, documentation, and compliance processes."
  }
];

const state = { questions: QUESTIONS, allocations: {} };

function init() {
  renderQuestions();
  wireButtons();
  updateSummary();
}

function renderQuestions() {
  const wrap = document.getElementById('questions');
  wrap.innerHTML = '';
  state.questions.forEach((q, index) => {
    if (!(q.id in state.allocations)) state.allocations[q.id] = 0;
    const card = document.createElement('article');
    card.className = 'question-card';
    card.innerHTML = `
      <div class="question-top">
        <div>
          <div class="question-domain">${escapeHtml(q.domain)}</div>
          <h3>${index + 1}. ${escapeHtml(q.short_label)}</h3>
          <p>${escapeHtml(q.question)}</p>
          <p class="practice-text"><strong>In practice:</strong> ${escapeHtml(q.in_practice)}</p>
        </div>
        <div class="points-box">
          <label>
            Points
            <input type="number" min="0" max="100" step="1" value="${state.allocations[q.id]}" data-id="${escapeHtml(q.id)}" />
          </label>
          <div class="helper">Allocate part of the 100-point budget.</div>
        </div>
      </div>
    `;
    wrap.appendChild(card);
  });

  document.querySelectorAll('input[data-id]').forEach((input) => {
    input.addEventListener('input', onPointsChange);
    input.addEventListener('blur', normalizeInput);
  });
}

function onPointsChange(event) {
  const input = event.target;
  const id = input.dataset.id;
  let next = parseInt(input.value || '0', 10);
  if (Number.isNaN(next) || next < 0) next = 0;

  const usedExcludingThis = getUsedPoints() - (state.allocations[id] || 0);
  const maxAllowed = 100 - usedExcludingThis;
  if (next > maxAllowed) next = Math.max(maxAllowed, 0);

  state.allocations[id] = next;
  input.value = next;
  updateSummary();
}

function normalizeInput(event) {
  const input = event.target;
  if (input.value === '') {
    input.value = '0';
    state.allocations[input.dataset.id] = 0;
    updateSummary();
  }
}

function getUsedPoints() {
  return Object.values(state.allocations).reduce((a, b) => a + b, 0);
}

function updateSummary() {
  const used = getUsedPoints();
  const remaining = 100 - used;
  document.getElementById('pointsUsed').textContent = `${used} / 100`;
  document.getElementById('pointsRemaining').textContent = `${remaining}`;
  document.getElementById('progressFill').style.width = `${Math.min(used, 100)}%`;
}

function wireButtons() {
  document.getElementById('resetBtn').addEventListener('click', () => {
    for (const q of state.questions) state.allocations[q.id] = 0;
    document.querySelectorAll('input[data-id]').forEach((el) => (el.value = '0'));
    updateSummary();
    setStatus('All points reset.', true);
  });

  document.getElementById('autoBalanceBtn').addEventListener('click', autoBalance);
  document.getElementById('submitBtn').addEventListener('click', submitSurvey);
  document.getElementById('downloadJsonBtn').addEventListener('click', downloadResponseJson);
  document.getElementById('downloadCsvBtn').addEventListener('click', downloadRankingCsv);
}

function autoBalance() {
  const remaining = 100 - getUsedPoints();
  if (remaining <= 0) {
    setStatus('No remaining points to distribute.', false);
    return;
  }
  const ids = state.questions.map((q) => q.id);
  const base = Math.floor(remaining / ids.length);
  let extra = remaining % ids.length;
  ids.forEach((id) => {
    state.allocations[id] += base + (extra > 0 ? 1 : 0);
    if (extra > 0) extra -= 1;
  });
  document.querySelectorAll('input[data-id]').forEach((el) => {
    el.value = state.allocations[el.dataset.id];
  });
  updateSummary();
  setStatus('Remaining points distributed.', true);
}

function buildPayload() {
  const allocations = state.questions.map((q) => ({
    id: q.id,
    domain: q.domain,
    competency: q.competency,
    short_label: q.short_label,
    question: q.question,
    in_practice: q.in_practice,
    points: state.allocations[q.id] || 0,
  }));

  const ranked = [...allocations].sort((a, b) => b.points - a.points);

  return {
    submitted_at: new Date().toISOString(),
    survey_name: 'High-Value Individual Priority Survey',
    target_profile: 'Ideal high-value individual in digital transformation and corporate enablement',
    total_points: getUsedPoints(),
    allocations,
    ranked,
  };
}

async function submitSurvey() {
  const total = getUsedPoints();
  if (total !== 100) {
    setStatus('The total must equal exactly 100 points before submission.', false);
    return;
  }

  const url = (window.APP_CONFIG && window.APP_CONFIG.appsScriptUrl || '').trim();
  if (!url || url.includes('PASTE_YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE')) {
    setStatus('Please add your Google Apps Script web app URL in index.html before deployment.', false);
    return;
  }

  const payload = buildPayload();
  const submitBtn = document.getElementById('submitBtn');
  submitBtn.disabled = true;
  setStatus('Submitting survey...', true);

  try {
    const form = new FormData();
    form.append('payload', JSON.stringify(payload));

    const res = await fetch(url, {
      method: 'POST',
      body: form,
      mode: 'cors'
    });

    const text = await res.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      data = { status: res.ok ? 'success' : 'error', message: text };
    }

    if (!res.ok || data.status !== 'success') {
      throw new Error(data.message || 'Submission failed.');
    }

    setStatus('Survey submitted successfully.', true);
    renderResults(payload.ranked);
  } catch (error) {
    setStatus(`Unable to submit to Google Sheets: ${error.message}`, false);
  } finally {
    submitBtn.disabled = false;
  }
}

function renderResults(ranked) {
  const panel = document.getElementById('resultsPanel');
  const list = document.getElementById('resultsList');
  list.innerHTML = '';
  ranked.forEach((item, idx) => {
    const row = document.createElement('div');
    row.className = 'result-item';
    row.innerHTML = `
      <div class="result-rank">#${idx + 1}</div>
      <div>
        <div><strong>${escapeHtml(item.short_label)}</strong></div>
        <div>${escapeHtml(item.competency)}</div>
      </div>
      <div class="result-score">${item.points} pts</div>
    `;
    list.appendChild(row);
  });
  panel.classList.remove('hidden');
  panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function downloadResponseJson() {
  const total = getUsedPoints();
  if (total !== 100) {
    setStatus('Set the total to 100 before downloading the response.', false);
    return;
  }
  const payload = buildPayload();
  downloadFile(`survey-response-${Date.now()}.json`, JSON.stringify(payload, null, 2), 'application/json');
}

function downloadRankingCsv() {
  const total = getUsedPoints();
  if (total !== 100) {
    setStatus('Set the total to 100 before downloading the ranking.', false);
    return;
  }
  const rows = [
    ['rank', 'short_label', 'competency', 'domain', 'points']
  ];
  buildPayload().ranked.forEach((item, idx) => {
    rows.push([idx + 1, item.short_label, item.competency, item.domain, item.points]);
  });
  const csv = rows.map((row) => row.map(csvEscape).join(',')).join('
');
  downloadFile(`survey-ranking-${Date.now()}.csv`, csv, 'text/csv');
}

function downloadFile(filename, content, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function csvEscape(value) {
  const str = String(value ?? '');
  if (/[",
]/.test(str)) return `"${str.replace(/"/g, '""')}"`;
  return str;
}

function setStatus(message, ok) {
  const el = document.getElementById('statusMsg');
  el.textContent = message;
  el.className = `status ${ok ? 'ok' : 'error'}`;
}

function escapeHtml(str) {
  return String(str)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

init();

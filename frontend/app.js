const QUESTIONS = [
  { id: 'd1', domain: 'Data', competency: 'D1 = Data - Prepare & Validate Structured Data' },
  { id: 'd2', domain: 'Data', competency: 'D2 = Data - Diagnose Data Quality & Integration' },
  { id: 'd3', domain: 'Data', competency: 'D3 = Data - Design Data / Knowledge Strategy' },
  { id: 'a1', domain: 'Analytics', competency: 'A1 = Analytics - Descriptive Analysis & Dashboarding' },
  { id: 'a2', domain: 'Analytics', competency: 'A2 = Analytics - KPI Analysis & Applied Modelling' },
  { id: 'a3', domain: 'Analytics', competency: 'A3 = Analytics - Decision Systems & Predictive Strategy' },
  { id: 'ai1', domain: 'AI', competency: 'AI1 = AI - Productivity & Prompt Use' },
  { id: 'ai2', domain: 'AI', competency: 'AI2 = AI - Evaluation & Workflow Integration' },
  { id: 'ai3', domain: 'AI', competency: 'AI3 = AI - Governance / Prompt Design / Decision Systems' },
  { id: 'p1', domain: 'Process', competency: 'P1 = Process - Workflow Execution & Task Coordination' },
  { id: 'p2', domain: 'Process', competency: 'P2 = Process - Process Optimization & Automation' },
  { id: 'p3', domain: 'Process', competency: 'P3 = Process - Enterprise Transformation & Systems Architecture' },
  { id: 'c1', domain: 'Communication', competency: 'C1 = Communication - Team Reporting & Professional Communication' },
  { id: 'c2', domain: 'Communication', competency: 'C2 = Communication - Stakeholder Communication & Influence' },
  { id: 'c3', domain: 'Communication', competency: 'C3 = Communication - Executive Leadership, Branding & Negotiation' },
  { id: 'g1', domain: 'Governance', competency: 'G1 = Governance - Ethics, Privacy & Evidence Basics' },
  { id: 'g2', domain: 'Governance', competency: 'G2 = Governance - Risk, Bias & Compliance Evaluation' },
  { id: 'g3', domain: 'Governance', competency: 'G3 = Governance - Responsible AI, Governance & Compliance Systems' }
];

const state = {
  responses: Object.fromEntries(QUESTIONS.map(q => [q.id, '']))
};

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

const PROMPTS = {
  d1: 'In your organisation, what would you expect this person to do well when preparing, checking, and organising structured data for use?',
  d2: 'In your organisation, what would you expect this person to do well when spotting data quality issues and combining data from different sources?',
  d3: 'In your organisation, what would you expect this person to do well when shaping a clear data or knowledge strategy for business improvement?',
  a1: 'In your organisation, what would you expect this person to do well when analysing data and presenting clear dashboards or reports?',
  a2: 'In your organisation, what would you expect this person to do well when using KPIs, analysis, or models to support decisions?',
  a3: 'In your organisation, what would you expect this person to do well when building decision systems or using predictive thinking to guide action?',
  ai1: 'In your organisation, what would you expect this person to do well when using AI tools to improve productivity and quality of work?',
  ai2: 'In your organisation, what would you expect this person to do well when evaluating AI outputs and fitting AI into real work processes?',
  ai3: 'In your organisation, what would you expect this person to do well when designing prompts, managing AI risks, and using AI for better decisions?',
  p1: 'In your organisation, what would you expect this person to do well when managing workflows, tasks, and day-to-day coordination?',
  p2: 'In your organisation, what would you expect this person to do well when improving processes and introducing automation?',
  p3: 'In your organisation, what would you expect this person to do well when supporting wider business transformation and system-level change?',
  c1: 'In your organisation, what would you expect this person to do well when reporting clearly and communicating professionally with teams?',
  c2: 'In your organisation, what would you expect this person to do well when engaging stakeholders and influencing action across the business?',
  c3: 'In your organisation, what would you expect this person to do well when communicating with senior leaders, representing the business, or handling negotiation?',
  g1: 'In your organisation, what would you expect this person to do well when handling ethics, privacy, and evidence responsibly?',
  g2: 'In your organisation, what would you expect this person to do well when reviewing risk, bias, and compliance concerns?',
  g3: 'In your organisation, what would you expect this person to do well when putting responsible AI, governance, and compliance into practice across the organisation?'
};

function buildPrompt(q) {
  return PROMPTS[q.id] || `In your organisation, what would you expect this person to do well in relation to ${q.competency}?`;
}

function renderMatrix() {
  const body = document.getElementById('matrixBody');
  body.innerHTML = '';

  QUESTIONS.forEach((q, index) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${index + 1}</td>
      <td>
        <div class="domain-tag">${escapeHtml(q.domain)}</div>
        <div class="area-title">${escapeHtml(q.competency)}</div>
      </td>
      <td><div class="prompt-box">${escapeHtml(buildPrompt(q))}</div></td>
      <td>
        <textarea data-id="${escapeHtml(q.id)}" placeholder="Enter your expectations for this competency..."></textarea>
      </td>
    `;
    body.appendChild(tr);
  });

  document.querySelectorAll('textarea[data-id]').forEach((el) => {
    el.addEventListener('input', (event) => {
      state.responses[event.target.dataset.id] = event.target.value;
    });
  });
}

function setStatus(message, ok) {
  const el = document.getElementById('statusMsg');
  el.textContent = message;
  el.className = `status ${ok ? 'ok' : 'error'}`;
}

function buildPayload() {
  const answers = QUESTIONS.map((q) => ({
    id: q.id,
    domain: q.domain,
    competency: q.competency,
    question: buildPrompt(q),
    response: state.responses[q.id] || ''
  }));

  return {
    submitted_at: new Date().toISOString(),
    survey_name: 'High-Value Individual Competency Needs Survey',
    target_profile: 'Ideal high-value individual in digital transformation and corporate enablement',
    industry: document.getElementById('industry').value.trim(),
    company_size: document.getElementById('companySize').value.trim(),
    answers
  };
}

function validatePayload(payload) {
  if (!payload.industry) return 'Please enter the company industry.';
  if (!payload.company_size) return 'Please enter the company size.';
  const filled = payload.answers.filter(a => a.response.trim() !== '').length;
  if (filled === 0) return 'Please answer at least one competency question before submitting.';
  return '';
}

async function submitSurvey() {
  const url = ((window.APP_CONFIG && window.APP_CONFIG.appsScriptUrl) || '').trim();
  const payload = buildPayload();
  const validation = validatePayload(payload);
  if (validation) {
    setStatus(validation, false);
    return;
  }

  if (!url || url.includes('PASTE_YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE')) {
    setStatus('Add your Google Apps Script web app URL in index.html before deployment.', false);
    return;
  }

  const submitBtn = document.getElementById('submitBtn');
  submitBtn.disabled = true;
  setStatus('Submitting survey...', true);

  try {
    const form = new FormData();
    form.append('payload', JSON.stringify(payload));

    const response = await fetch(url, {
      method: 'POST',
      body: form,
      mode: 'cors'
    });

    const text = await response.text();
    let data;
    try { data = JSON.parse(text); }
    catch { data = { status: response.ok ? 'success' : 'error', message: text }; }

    if (!response.ok || data.status !== 'success') {
      throw new Error(data.message || 'Submission failed.');
    }

    setStatus('Survey submitted successfully.', true);
  } catch (error) {
    setStatus(`Unable to submit to Google Sheets: ${error.message}`, false);
  } finally {
    submitBtn.disabled = false;
  }
}

function resetAll() {
  document.getElementById('industry').value = '';
  document.getElementById('companySize').value = '';
  QUESTIONS.forEach((q) => { state.responses[q.id] = ''; });
  document.querySelectorAll('textarea[data-id]').forEach((el) => { el.value = ''; });
  setStatus('All answers cleared.', true);
}

function wireButtons() {
  document.getElementById('resetBtn').addEventListener('click', resetAll);
  document.getElementById('submitBtn').addEventListener('click', submitSurvey);
}

function init() {
  renderMatrix();
  wireButtons();
}

init();

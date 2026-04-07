const COMPETENCIES = [
  'Analytics or Business Intelligence',
  'Use of AI',
  'Proficiency in Tools',
  'Soft Skills and Communication',
  'Governance'
];

const TOOL_OPTIONS = [
  'ChatGPT', 'Copilot', 'Python', 'R', 'Power BI', 'Tableau', 'Microsoft Office',
  'Gemini', 'Canva', 'SQL', 'OneDrive', 'Google Workspace', 'Trello',
  'Perplexity', 'AnythingLLM', 'Zapier AI', 'Others'
];

const AREA_DESCRIPTIONS = {
  'Analytics or Business Intelligence': 'Focus on data use, insight generation, business interpretation, and decision support.',
  'Use of AI': 'Focus on how candidates use, assess, or apply AI in work and decision contexts.',
  'Proficiency in Tools': 'Focus on practical use of software, platforms, technical environments, or work tools.',
  'Soft Skills and Communication': 'Focus on stakeholder engagement, teamwork, influence, communication, and change support.',
  'Governance': 'Focus on controls, responsibility, policy, compliance, ethics, and risk-aware use of digital capabilities.'
};

const PROMPT = 'If you were the hiring manager, what actual interview questions would you ask the candidate in this area? Please write the questions as you would ask them in the interview. You may also include questions you have in mind, even if they may not necessarily be asked. Please write one question per line and keep your questions mainly focused on the selected area.';

const form = document.getElementById('surveyForm');
const toolGrid = document.getElementById('toolGrid');
const priorityGrid = document.getElementById('priorityGrid');
const sectionsWrap = document.getElementById('competencySections');
const statusEl = document.getElementById('status');
const submitBtn = document.getElementById('submitBtn');
const otherToolWrap = document.getElementById('otherToolWrap');
const otherToolInput = document.getElementById('otherTool');

function setStatus(message, type = '') {
  statusEl.textContent = message;
  statusEl.className = 'status' + (type ? ` ${type}` : '');
}

function renderTools() {
  toolGrid.innerHTML = TOOL_OPTIONS.map((tool, index) => `
    <div class="choice-card">
      <input type="checkbox" id="tool_${index}" name="tools" value="${tool}">
      <label for="tool_${index}">${tool}</label>
    </div>
  `).join('');

  toolGrid.querySelectorAll('input[name="tools"]').forEach((input) => {
    input.addEventListener('change', syncOtherToolField);
  });
}

function renderPriorityChoices() {
  priorityGrid.innerHTML = COMPETENCIES.map((name, index) => `
    <div class="choice-card">
      <input type="radio" id="priority_${index}" name="priorityCompetency" value="${name}">
      <label for="priority_${index}">${name}</label>
    </div>
  `).join('');

  priorityGrid.querySelectorAll('input[name="priorityCompetency"]').forEach((input) => {
    input.addEventListener('change', updatePriorityHighlight);
  });
}

function renderCompetencySections() {
  sectionsWrap.innerHTML = COMPETENCIES.map((name, index) => `
    <section class="competency-card" data-competency="${name}">
      <div class="competency-card__head">
        <div>
          <div class="competency-chip">Area ${index + 1}</div>
          <h3>${name}</h3>
          <p class="competency-card__desc">${AREA_DESCRIPTIONS[name]}</p>
        </div>
      </div>
      <div class="competency-card__body">
        <div class="prompt-panel">
          ${PROMPT}
          <div class="prompt-note">Write one question per line.</div>
        </div>
        <label>
          <span class="field-label">Interview questions for ${name}</span>
          <textarea id="response_${index}" data-competency="${name}" placeholder="Enter one interview question per line."></textarea>
        </label>
      </div>
    </section>
  `).join('');
}

function updatePriorityHighlight() {
  const selected = document.querySelector('input[name="priorityCompetency"]:checked')?.value || '';
  document.querySelectorAll('.competency-card').forEach((card, index) => {
    const isPriority = card.dataset.competency === selected;
    card.classList.toggle('is-priority', isPriority);
    const chip = card.querySelector('.competency-chip');
    chip.textContent = isPriority ? 'First and foremost priority' : `Area ${index + 1}`;
  });
}

function getSelectedTools() {
  return [...document.querySelectorAll('input[name="tools"]:checked')].map((el) => el.value);
}

function syncOtherToolField() {
  const showOther = getSelectedTools().includes('Others');
  otherToolWrap.hidden = !showOther;
  otherToolInput.required = showOther;
  if (!showOther) otherToolInput.value = '';
}

function validateForm() {
  const industry = document.getElementById('industry').value.trim();
  const companySize = document.getElementById('companySize').value;
  const tools = getSelectedTools();
  const priority = document.querySelector('input[name="priorityCompetency"]:checked')?.value || '';

  if (!industry) return 'Please fill in the industry.';
  if (!companySize) return 'Please select the company size.';
  if (!tools.length) return 'Please select at least one tool.';
  if (tools.includes('Others') && !otherToolInput.value.trim()) return 'Please specify the other tool.';
  if (!priority) return 'Please select the first and foremost priority.';

  for (let i = 0; i < COMPETENCIES.length; i += 1) {
    const value = document.getElementById(`response_${i}`).value.trim();
    if (!value) return `Please write the interview questions for ${COMPETENCIES[i]}.`;
  }

  return '';
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const error = validateForm();
  if (error) {
    setStatus(error, 'error');
    return;
  }

  const payload = {
    industry: document.getElementById('industry').value.trim(),
    companySize: document.getElementById('companySize').value,
    toolsSelected: getSelectedTools(),
    otherTool: otherToolInput.value.trim(),
    firstPriority: document.querySelector('input[name="priorityCompetency"]:checked').value,
    analyticsQuestions: document.getElementById('response_0').value.trim(),
    aiQuestions: document.getElementById('response_1').value.trim(),
    toolsQuestions: document.getElementById('response_2').value.trim(),
    softSkillsQuestions: document.getElementById('response_3').value.trim(),
    governanceQuestions: document.getElementById('response_4').value.trim(),
    submittedAtClient: new Date().toISOString()
  };

  const appsScriptUrl = window.APP_CONFIG?.appsScriptUrl || '';
  if (!appsScriptUrl) {
    setStatus('Apps Script URL is missing.', 'error');
    return;
  }

  submitBtn.disabled = true;
  setStatus('Submitting response...');

  try {
    const response = await fetch(appsScriptUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    if (data.status !== 'success') {
      throw new Error(data.message || 'Submission failed.');
    }

    setStatus('Response submitted successfully.', 'success');
    form.reset();
    syncOtherToolField();
    updatePriorityHighlight();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } catch (error) {
    setStatus(`Unable to submit to Google Sheets: ${error.message}`, 'error');
  } finally {
    submitBtn.disabled = false;
  }
});

renderTools();
renderPriorityChoices();
renderCompetencySections();
syncOtherToolField();
updatePriorityHighlight();

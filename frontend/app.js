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

const AREA_CONFIG = {
  'Analytics or Business Intelligence': {
    description: 'Data use, insight generation, interpretation, and decision support.',
    focuses: [
      'Identify the right business questions to investigate with data',
      'Interpret KPIs, dashboards, and trends in a meaningful way',
      'Spot data quality issues that could distort analysis',
      'Translate analysis into recommendations for management',
      'Explain insights clearly to non-technical stakeholders',
      'Find root causes behind performance or process problems',
      'Measure whether a business change actually improved results'
    ]
  },
  'Use of AI': {
    description: 'How AI is applied, judged, and governed in real work situations.',
    focuses: [
      'Judge whether AI output is reliable enough to use',
      'Choose when AI should or should not be used',
      'Use AI to improve productivity in real workflows',
      'Write or refine prompts to get useful output',
      'Explain AI limitations to non-technical stakeholders',
      'Manage risks created by AI use in business settings',
      'Evaluate whether AI is actually improving work quality'
    ]
  },
  'Proficiency in Tools': {
    description: 'Practical use of platforms, software, and technical tools in the role.',
    focuses: [
      'Use core digital tools confidently in daily work',
      'Learn and apply a new tool quickly when needed',
      'Choose the right tool for a task or business need',
      'Connect data or workflows across different tools',
      'Automate repetitive work with existing tools',
      'Help teams adopt tools effectively in practice',
      'Assess whether a tool is creating value or unnecessary complexity'
    ]
  },
  'Soft Skills and Communication': {
    description: 'Influence, collaboration, stakeholder engagement, and communication.',
    focuses: [
      'Explain technical issues clearly to non-technical stakeholders',
      'Influence action without relying on formal authority',
      'Handle resistance to change or digital adoption',
      'Align technical and business teams around priorities',
      'Present recommendations in a way that drives action',
      'Navigate difficult stakeholder conversations constructively',
      'Turn a vague business issue into a clear action plan'
    ]
  },
  'Governance': {
    description: 'Risk, control, responsible use, compliance, and accountability.',
    focuses: [
      'Apply responsible and practical governance in digital work',
      'Balance innovation with compliance and control',
      'Identify risks in data, AI, or automated workflows',
      'Handle data access, privacy, and accountability appropriately',
      'Put practical checks in place before rollout',
      'Recognise when a digital solution creates ethical concerns',
      'Advise leadership on responsible digital or AI adoption'
    ]
  }
};

const IMPORTANCE_SCALE = [
  '1 — Not important',
  '2 — Slightly important',
  '3 — Moderately important',
  '4 — Very important',
  '5 — Critical'
];

const LEVEL_SCALE = [
  '1 — Basic awareness',
  '2 — Can assist with guidance',
  '3 — Can work independently',
  '4 — Can handle complex situations',
  '5 — Can advise or lead others'
];

const form = document.getElementById('surveyForm');
const toolGrid = document.getElementById('toolGrid');
const priorityGrid = document.getElementById('priorityGrid');
const sectionsWrap = document.getElementById('competencySections');
const statusEl = document.getElementById('status');
const submitBtn = document.getElementById('submitBtn');
const otherToolWrap = document.getElementById('otherToolWrap');
const otherToolInput = document.getElementById('otherTool');
const submissionOverlay = document.getElementById('submissionOverlay');
const submissionTitle = document.getElementById('submissionTitle');
const submissionMessage = document.getElementById('submissionMessage');

function slugify(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
}

function setStatus(message, type = '') {
  statusEl.textContent = message;
  statusEl.className = `status ${type}`.trim();
}

function renderTools() {
  toolGrid.innerHTML = TOOL_OPTIONS.map(tool => `
    <label class="choice-pill choice-pill--tool">
      <input type="checkbox" name="toolsSelected" value="${tool}" ${tool === 'ChatGPT' ? '' : ''} />
      <span>${tool}</span>
    </label>
  `).join('');

  toolGrid.addEventListener('change', syncOtherToolField);
}

function syncOtherToolField() {
  const selected = getSelectedTools();
  const show = selected.includes('Others');
  otherToolWrap.hidden = !show;
  otherToolInput.required = show;
  if (!show) otherToolInput.value = '';
}

function getSelectedTools() {
  return Array.from(document.querySelectorAll('input[name="toolsSelected"]:checked')).map(input => input.value);
}

function renderPriorityChoices() {
  priorityGrid.innerHTML = COMPETENCIES.map(name => `
    <label class="priority-card">
      <input type="radio" name="firstPriority" value="${name}" required />
      <span class="priority-card__title">${name}</span>
      <span class="priority-card__meta">${AREA_CONFIG[name].description}</span>
    </label>
  `).join('');

  priorityGrid.addEventListener('change', updatePriorityHighlight);
}

function renderScalePills(name, values, groupLabel) {
  return values.map((label, index) => `
    <label class="scale-pill">
      <input type="radio" name="${name}" value="${index + 1}" required />
      <span>${label}</span>
    </label>
  `).join('');
}

function renderCompetencySections() {
  sectionsWrap.innerHTML = COMPETENCIES.map((name, idx) => {
    const key = slugify(name);
    const focusHtml = AREA_CONFIG[name].focuses.map((item, itemIdx) => `
      <label class="focus-option">
        <input type="checkbox" name="${key}_focus" value="${item}" />
        <span class="focus-option__tick">${String(itemIdx + 1).padStart(2, '0')}</span>
        <span>${item}</span>
      </label>
    `).join('');

    return `
      <article class="competency-card" data-competency="${name}">
        <div class="competency-card__head">
          <div>
            <div class="competency-card__eyebrow">Area ${idx + 1}</div>
            <h3>${name}</h3>
            <p>${AREA_CONFIG[name].description}</p>
          </div>
          <div class="priority-badge" hidden>Top priority</div>
        </div>

        <div class="field-card field-card--soft">
          <div class="field-label-row">
            <span class="field-label">How important is this area when hiring this person?</span>
          </div>
          <div class="scale-grid">${renderScalePills(`${key}_importance`, IMPORTANCE_SCALE)}</div>
        </div>

        <div class="field-card field-card--soft">
          <div class="field-label-row">
            <span class="field-label">Which of the following would you most want to assess in this area?</span>
            <span class="field-helper"><span id="${key}_count">0</span> of 3 selected</span>
          </div>
          <div class="focus-grid" data-focus-group="${key}">${focusHtml}</div>
          <div class="micro-note">Select up to three.</div>
        </div>

        <div class="field-card field-card--soft">
          <div class="field-label-row">
            <span class="field-label">What level would you expect in this area?</span>
          </div>
          <div class="scale-grid">${renderScalePills(`${key}_level`, LEVEL_SCALE)}</div>
        </div>
      </article>
    `;
  }).join('');

  document.querySelectorAll('.focus-grid').forEach(grid => {
    grid.addEventListener('change', () => enforceFocusLimit(grid.dataset.focusGroup));
  });
}

function enforceFocusLimit(groupKey) {
  const inputs = Array.from(document.querySelectorAll(`input[name="${groupKey}_focus"]`));
  const checked = inputs.filter(input => input.checked);
  const maxed = checked.length >= 3;
  inputs.forEach(input => {
    if (!input.checked) input.disabled = maxed;
  });
  const counter = document.getElementById(`${groupKey}_count`);
  if (counter) counter.textContent = String(checked.length);
}

function updatePriorityHighlight() {
  const selected = document.querySelector('input[name="firstPriority"]:checked')?.value || '';
  document.querySelectorAll('.competency-card').forEach(card => {
    const match = card.dataset.competency === selected;
    card.classList.toggle('competency-card--priority', match);
    const badge = card.querySelector('.priority-badge');
    if (badge) badge.hidden = !match;
  });
}

function getFocusValues(groupKey) {
  return Array.from(document.querySelectorAll(`input[name="${groupKey}_focus"]:checked`)).map(input => input.value);
}

function buildPayload() {
  const payload = {
    industry: document.getElementById('industry').value.trim(),
    companySize: document.getElementById('companySize').value,
    toolsSelected: getSelectedTools(),
    otherTool: document.getElementById('otherTool').value.trim(),
    firstPriority: document.querySelector('input[name="firstPriority"]:checked')?.value || '',
    additionalComments: document.getElementById('additionalComments').value.trim(),
    submittedAtClient: new Date().toISOString()
  };

  COMPETENCIES.forEach(name => {
    const key = slugify(name);
    payload[`${key}_importance`] = document.querySelector(`input[name="${key}_importance"]:checked`)?.value || '';
    payload[`${key}_focus`] = getFocusValues(key);
    payload[`${key}_level`] = document.querySelector(`input[name="${key}_level"]:checked`)?.value || '';
  });

  return payload;
}

function validatePayload(payload) {
  if (!payload.industry) return 'Industry is required.';
  if (!payload.companySize) return 'Company size is required.';
  if (!payload.toolsSelected.length) return 'Please select at least one tool.';
  if (payload.toolsSelected.includes('Others') && !payload.otherTool) return 'Please specify the other tool.';
  if (!payload.firstPriority) return 'Please select your top priority area.';

  for (const name of COMPETENCIES) {
    const key = slugify(name);
    if (!payload[`${key}_importance`]) return `Please rate the importance of ${name}.`;
    if (!payload[`${key}_focus`].length) return `Please select at least one focus item for ${name}.`;
    if (payload[`${key}_focus`].length > 3) return `${name} allows up to three focus items.`;
    if (!payload[`${key}_level`]) return `Please select the expected level for ${name}.`;
  }

  return '';
}

function showSubmissionOverlay(title, message) {
  submissionTitle.textContent = title;
  submissionMessage.textContent = message;
  submissionOverlay.hidden = false;
  document.body.classList.add('overlay-open');
}

function hideSubmissionOverlay() {
  submissionOverlay.hidden = true;
  document.body.classList.remove('overlay-open');
}

form.addEventListener('submit', async event => {
  event.preventDefault();
  const payload = buildPayload();
  const validationError = validatePayload(payload);
  if (validationError) {
    setStatus(validationError, 'error');
    return;
  }

  const appsScriptUrl = window.APP_CONFIG?.appsScriptUrl || '';
  if (!appsScriptUrl) {
    setStatus('Apps Script URL is missing.', 'error');
    return;
  }

  submitBtn.disabled = true;
  setStatus('Submitting response...');
  showSubmissionOverlay('Submitting your response', 'Please wait while we save your response securely.');

  try {
    const response = await fetch(appsScriptUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    if (data.status !== 'success') throw new Error(data.message || 'Submission failed.');

    setStatus('Response submitted successfully.', 'success');
    form.reset();
    syncOtherToolField();
    document.querySelectorAll('.focus-grid').forEach(grid => enforceFocusLimit(grid.dataset.focusGroup));
    updatePriorityHighlight();
    showSubmissionOverlay('Submission complete', 'Thank you for your participation. We are working on something very exciting!');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(hideSubmissionOverlay, 2600);
  } catch (error) {
    hideSubmissionOverlay();
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
document.querySelectorAll('.focus-grid').forEach(grid => enforceFocusLimit(grid.dataset.focusGroup));

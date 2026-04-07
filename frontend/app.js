const COMPETENCIES = [
  'Analytics or Business Intelligence',
  'Use of AI',
  'Proficiency in Tools',
  'Soft Skills and Communication',
  'Governance'
];

const form = document.getElementById('surveyForm');
const steps = [...document.querySelectorAll('.step')];
const stepIndicator = document.getElementById('step-indicator');
const backBtn = document.getElementById('backBtn');
const nextBtn = document.getElementById('nextBtn');
const submitBtn = document.getElementById('submitBtn');
const statusEl = document.getElementById('status');

const top1Select = document.getElementById('top1Competency');
const top2Select = document.getElementById('top2Competency');
const top3Select = document.getElementById('top3Competency');

let currentStep = 1;

function setStatus(message, type = '') {
  statusEl.textContent = message;
  statusEl.className = 'status' + (type ? ` ${type}` : '');
}

function populateSelect(selectEl, options, currentValue = '') {
  selectEl.innerHTML = '';
  const placeholder = document.createElement('option');
  placeholder.value = '';
  placeholder.textContent = 'Select a competency';
  selectEl.appendChild(placeholder);

  options.forEach(option => {
    const el = document.createElement('option');
    el.value = option;
    el.textContent = option;
    if (option === currentValue) el.selected = true;
    selectEl.appendChild(el);
  });
}

function refreshCompetencyOptions() {
  const selected1 = top1Select.value;
  const selected2 = top2Select.value;
  const selected3 = top3Select.value;

  populateSelect(top1Select, COMPETENCIES, selected1);
  populateSelect(top2Select, COMPETENCIES.filter(v => v !== selected1), selected2);
  populateSelect(top3Select, COMPETENCIES.filter(v => v !== selected1 && v !== selected2), selected3);
}

function showStep(stepNumber) {
  currentStep = stepNumber;
  steps.forEach(step => step.classList.toggle('active', Number(step.dataset.step) === stepNumber));
  stepIndicator.textContent = `Step ${stepNumber} of 4`;
  backBtn.disabled = stepNumber === 1;
  nextBtn.hidden = stepNumber === 4;
  submitBtn.hidden = stepNumber !== 4;
  refreshCompetencyOptions();
}

function validateStep(stepNumber) {
  if (stepNumber === 1) {
    const industry = document.getElementById('industry');
    const companySize = document.getElementById('companySize');
    if (!industry.value.trim()) return 'Please fill in the industry.';
    if (!companySize.value) return 'Please select the company size.';
    return '';
  }

  if (stepNumber === 2) {
    if (!top1Select.value) return 'Please choose your top competency.';
    if (!document.getElementById('top1Questions').value.trim()) return 'Please write the interview questions for your top competency.';
    return '';
  }

  if (stepNumber === 3) {
    if (!top2Select.value) return 'Please choose your second competency.';
    if (!document.getElementById('top2Questions').value.trim()) return 'Please write the interview questions for your second competency.';
    return '';
  }

  if (stepNumber === 4) {
    if (!top3Select.value) return 'Please choose your third competency.';
    if (!document.getElementById('top3Questions').value.trim()) return 'Please write the interview questions for your third competency.';
    return '';
  }

  return '';
}

backBtn.addEventListener('click', () => {
  if (currentStep > 1) {
    setStatus('');
    showStep(currentStep - 1);
  }
});

nextBtn.addEventListener('click', () => {
  const error = validateStep(currentStep);
  if (error) {
    setStatus(error, 'error');
    return;
  }
  setStatus('');
  showStep(currentStep + 1);
});

top1Select.addEventListener('change', refreshCompetencyOptions);
top2Select.addEventListener('change', refreshCompetencyOptions);

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const error = validateStep(4);
  if (error) {
    setStatus(error, 'error');
    return;
  }

  const payload = {
    industry: document.getElementById('industry').value.trim(),
    companySize: document.getElementById('companySize').value,
    top1Competency: top1Select.value,
    top1Questions: document.getElementById('top1Questions').value.trim(),
    top2Competency: top2Select.value,
    top2Questions: document.getElementById('top2Questions').value.trim(),
    top3Competency: top3Select.value,
    top3Questions: document.getElementById('top3Questions').value.trim(),
    submittedAtClient: new Date().toISOString()
  };

  const appsScriptUrl = window.APP_CONFIG?.appsScriptUrl || '';
  if (!appsScriptUrl) {
    setStatus('Apps Script URL is missing.', 'error');
    return;
  }

  submitBtn.disabled = true;
  backBtn.disabled = true;
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
    refreshCompetencyOptions();
    showStep(1);
  } catch (error) {
    setStatus(`Unable to submit to Google Sheets: ${error.message}`, 'error');
  } finally {
    submitBtn.disabled = false;
    backBtn.disabled = currentStep === 1;
  }
});

refreshCompetencyOptions();
showStep(1);

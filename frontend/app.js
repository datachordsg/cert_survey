const state = { questions: [], allocations: {} };

async function init() {
  const res = await fetch('competency_questions.json');
  state.questions = await res.json();
  renderQuestions();
  wireButtons();
  updateSummary();
}

function renderQuestions() {
  const wrap = document.getElementById('questions');
  wrap.innerHTML = '';
  state.questions.forEach((q, index) => {
    state.allocations[q.id] = 0;
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
            <input type="number" min="0" step="1" value="0" data-id="${escapeHtml(q.id)}" />
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
  const respondent = {
    name: document.getElementById('respondentName').value.trim(),
    email: document.getElementById('respondentEmail').value.trim(),
    company: document.getElementById('companyName').value.trim(),
    role: document.getElementById('jobTitle').value.trim(),
    industry: document.getElementById('industry').value.trim(),
    country: document.getElementById('country').value.trim(),
  };

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
    respondent,
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

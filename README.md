# Hiring Manager Interview Question Survey

This package contains:
- `frontend/` — static survey app for GitHub Pages
- `google_apps_script/` — Google Apps Script backend to save responses into Google Sheets

## Survey flow
1. Enter industry and company size
2. Select Top 1 competency and write interview questions
3. Select Top 2 competency from the remaining options and write interview questions
4. Select Top 3 competency from the remaining options and write interview questions

## Competency options
- Analytics or Business Intelligence
- Use of AI
- Proficiency in Tools
- Soft Skills and Communication
- Governance

## Google Sheet output
Each submission is one row in `SurveyResponses` with these columns:
- response_id
- submitted_at
- industry
- company_size
- top1_competency
- top1_questions
- top2_competency
- top2_questions
- top3_competency
- top3_questions
- submitted_at_client

## Setup
1. Create a Google Sheet.
2. Open **Extensions > Apps Script** from that Google Sheet.
3. Replace the default code with `google_apps_script/Code.gs`.
4. Replace the manifest with `google_apps_script/appsscript.json`.
5. In Apps Script, set **Script Properties**:
   - Key: `SPREADSHEET_ID`
   - Value: your Google Sheet ID
6. Deploy as a **Web app**:
   - Execute as: `Me`
   - Who has access: `Anyone`
7. The frontend already contains this Apps Script URL:
   - `https://script.google.com/macros/s/AKfycbwS29VjGzrrVzZhdnye3WV0rf_u8OB48kfAAHgnfBzStabM7-8NbpGhRBXuZQHYfpaK/exec`
8. Upload the contents of `frontend/` to a GitHub repository and enable GitHub Pages.

## Notes
- If you already have an old `SurveyResponses` tab with a different structure, rename or delete it first.
- The app prevents the same competency from being selected again in later steps.

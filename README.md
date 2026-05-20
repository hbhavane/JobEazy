# JobEazy

Local-first Chrome extension (Manifest V3) for tracking job applications.

## Setup

```bash
npm install
npm run build
```

Then load unpacked extension from `src/` in Chrome.




# JobEazy 🧠💼  
A Local-First Chrome Extension for Smart Job Tracking

---

## 🚀 Overview

JobEazy is a lightweight, privacy-first Chrome Extension that helps you track job applications directly from job posting pages — without spreadsheets, accounts, or external tools.

With one click, you can save any job, auto-extract key details, and manage your entire job search in a clean local dashboard.

No backend. No login. No cloud. Just your browser.

---

## 🎯 Problem It Solves

Job hunting becomes messy fast:

- Too many open tabs
- Losing track of applied jobs
- Manually maintaining spreadsheets
- Forgetting job links or statuses
- No centralized system

JobEazy replaces all of that with a simple workflow:

> Open job → Click save → Done

---

## ✨ Features (v1)

### ⚡ One-Click Job Saving
Save any job posting instantly from the browser.

Automatically captures:
- Job title
- Company
- Location
- Source website
- URL
- Timestamp

---

### 🧠 Smart Auto-Extraction
Uses a layered extraction system:

1. Structured `JobPosting` JSON-LD (best accuracy)
2. Site-specific extractors (LinkedIn, Greenhouse, Lever)
3. Generic fallback (works on most career pages)

---

### 🏷️ Status Tracking
Track your job pipeline with customizable statuses:

- Saved
- Applied
- Interviewing
- Offer
- Rejected

Status updates are saved instantly.

---

### 📝 Notes Support
Add personal notes to each job:
- Interview details
- Salary expectations
- Follow-up reminders
- Personal thoughts

---

### 💾 Local-First Storage
All data is stored securely in your browser using:

- `chrome.storage.local`

No accounts. No tracking. No cloud sync.

---

### 📊 Dashboard CRM
A simple built-in dashboard to manage your job search:

- View all saved jobs
- Edit statuses instantly
- Add/edit notes
- Delete jobs
- Search & filter jobs
- Sort by latest updates

---

### 📤 CSV Export
Export all your job data instantly:

- Clean CSV format
- Opens in Excel / Google Sheets / Notion
- Fully offline export
- No dependencies

---

## 🔧 Tech Stack

- Chrome Extension (Manifest V3)
- JavaScript (Vanilla)
- Tailwind CSS (UI)
- Chrome Storage API
- DOM-based extraction
- JSON-LD parsing
- Blob API (CSV export)

---

## 🧱 Architecture


src/
├── background/
├── content/
├── popup/
├── dashboard/
├── storage/
├── extractors/
├── utils/
└── styles/


---

## 🔄 How It Works

### 1. Save Job
User clicks extension icon → data extracted from page → popup opens pre-filled.

### 2. Edit & Save
User adjusts:
- status
- notes
- fields (if needed)

Data is stored locally instantly.

### 3. Manage
Dashboard allows full control over saved jobs.

### 4. Export
Export all jobs to CSV with one click.

---

## 🧠 Design Philosophy

JobEazy is built with:

- **Simplicity first** – minimal UI, zero clutter
- **Local-first privacy** – everything stays in your browser
- **Zero friction UX** – one-click saving
- **Practical engineering** – no overengineering, just useful features

---

## 📦 Installation (Dev Mode)

1. Clone the repository
```bash
git clone https://github.com/your-username/jobeazy.git
Open Chrome
chrome://extensions
Enable Developer Mode
Click Load Unpacked
Select the project folder
🧪 Future Improvements (Optional)
Duplicate detection improvements
Keyboard shortcuts
Advanced filtering system
Resume attachment per job
Follow-up reminders
Google Sheets sync (optional)
📌 Why This Project Matters

JobEazy demonstrates:

Chrome Extension development (MV3)
DOM scraping & structured data parsing
Local-first architecture design
State management using Chrome APIs
Clean UI design with Tailwind CSS
Real-world productivity problem solving
🧑‍💻 Author

Built as a personal productivity tool to simplify job hunting and eliminate spreadsheet chaos.

📄 License

MIT License — free to use and modify.


---

If you want next step, I can also:
- turn this into a **GitHub profile README banner version**
- or help you write a **killer resume bullet points section for this project**
- or help you make it look like a “startup-grade product” for portfolio impact

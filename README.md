# Resume Studio — Basic Resume Builder

[![Live Demo](https://img.shields.io/badge/demo-online-green)](https://basic-resume-builder-lemon.vercel.app/)
[![GitHub stars](https://img.shields.io/github/stars/NehitPahuja/Basic-resume-builder?style=social)](https://github.com/NehitPahuja/Basic-resume-builder/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/NehitPahuja/Basic-resume-builder?style=social)](https://github.com/NehitPahuja/Basic-resume-builder/network/members)
![HTML5](https://img.shields.io/badge/HTML5-orange?logo=html5\&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-blue?logo=css3\&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-yellow?logo=javascript\&logoColor=black)

A lightweight, browser-based resume builder to quickly draft a professional CV and export it as a PDF. No signup required—and now includes an optional Node.js backend so you can save and reload drafts from any device.

[**Live Demo**](https://basic-resume-builder-lemon.vercel.app/) • [**Repository**](https://github.com/NehitPahuja/Basic-resume-builder)

## Features

* Inline editing: Click into any field (name, title, contact, summary, sections) and type.
* Work/Education sections: Add roles and programs interactively.
* Skills block: Simple list for quick scanning.
* One-click PDF: Use the **Download PDF** button to export your resume.
* Save & load drafts: Persist resumes to the Express backend and reload them later with a shareable draft ID.

## Tech Stack

* HTML5 – structure
* CSS3 – layout & styles
* Vanilla JavaScript – interactivity (form fields, add/remove items, PDF trigger)
* Node.js + Express – lightweight REST API for saving and loading resume drafts


## Getting Started

1. **Clone the repository**

   ```bash
   git clone https://github.com/NehitPahuja/Basic-resume-builder.git
   cd Basic-resume-builder
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the backend + static server**

   ```bash
   npm start
   ```

   The app will be available at [http://localhost:4000](http://localhost:4000).

4. **Build your resume**

   * Click fields to edit content in the live preview.
   * Add entries under **Work History** / **Education**.
   * Click **Save Draft** to store a copy on the backend—an ID will be generated so you can reload it later with **Load Draft**.
   * Click **Download PDF** to export a polished copy.

> Prefer the original static version? Open `index.html` directly in your browser without starting the backend (save/load will be unavailable).

## Project Structure

```
.
├─ index.html     # Layout & content areas
├─ styles.css     # Styling
├─ script.js      # Field logic, add/remove items, PDF trigger, backend integration
├─ server.js      # Express server that serves static assets + REST API
├─ package.json   # Project metadata & dependencies
├─ data/          # JSON storage for saved drafts (gitignored)
└─ .gitignore
```

## REST API

The backend persists drafts to `data/resumes.json` on disk and exposes a small REST API:

| Method | Endpoint | Description |
| ------ | -------- | ----------- |
| `GET`  | `/api/health` | Health check for uptime monitoring. |
| `POST` | `/api/resumes` | Save a draft. Expects the same shape as the frontend state and returns `{ id }`. |
| `GET`  | `/api/resumes` | List saved drafts with minimal metadata (ID, name, job title, timestamp). |
| `GET`  | `/api/resumes/:id` | Retrieve a full draft by ID for loading back into the editor. |

> Drafts are stored unencrypted on disk for simplicity. Use environment-level protections or swap in a different persistence layer before deploying publicly.

## Deploy

Because it’s static, you can deploy anywhere:

* Vercel (the demo is hosted there).
* GitHub Pages
* Netlify

## Roadmap Ideas

* Multiple templates (classic, modern, minimalist)
* Section reordering + drag & drop
* Dark mode toggle
* Auto-save to LocalStorage
* Custom theme colors and font picker

## Contributing

1. Fork the repo
2. Create a feature branch: `git checkout -b feat/your-feature`
3. Commit: `git commit -m "Add your feature"`
4. Push: `git push origin feat/your-feature`
5. Open a Pull Request

## Author

**[@NehitPahuja](https://github.com/NehitPahuja)**
Demo: [basic-resume-builder-lemon.vercel.app](https://basic-resume-builder-lemon.vercel.app/)


Do you also want me to **add shields.io badges** (like Tech Stack, Live Demo, Stars, Forks) at the top for a more professional look?

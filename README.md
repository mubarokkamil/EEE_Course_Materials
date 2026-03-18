# ⚡ EEE Course Materials

A web-based repository of study materials for Electrical & Electronic Engineering courses, hosted on **GitHub Pages**.

🔗 **Live Site:** `https://<your-username>.github.io/EEE_Course_Materials/`

---

## 📁 Repository Structure

```
EEE_Course_Materials/
│
├── index.html              ← Homepage (lists all courses)
├── courses/
│   ├── course.html         ← Course page (lists topics)
│   └── topic.html          ← Topic page (lists materials)
│
├── css/
│   └── style.css           ← All styles
│
├── js/
│   ├── courses.js          ← ⭐ ALL DATA LIVES HERE (edit this!)
│   ├── main.js             ← Homepage logic
│   ├── course.js           ← Course page logic
│   └── topic.js            ← Topic page logic
│
└── materials/              ← Upload all your PDFs, code, notes here
    ├── circuit-analysis/
    ├── electronics/
    ├── signals/
    ├── power/
    ├── microprocessors/
    └── emf/
```

---

## ➕ How to Add a New Course

1. Open `js/courses.js`
2. Add a new object to the `COURSES` array:

```js
{
  id: "digital-electronics",       // unique slug, no spaces
  code: "EEE 203",
  name: "Digital Electronics",
  icon: "🔢",
  desc: "Logic gates, combinational & sequential circuits.",
  topics: [
    {
      id: "logic-gates",
      name: "Logic Gates",
      desc: "AND, OR, NOT, XOR and universal gates.",
      materials: [
        {
          type: "pdf",              // pdf | code | notes | video | link
          name: "Logic Gates Notes",
          url: "materials/digital/logic-gates.pdf",
          desc: "With truth tables and examples"
        }
      ]
    }
  ]
}
```

3. Upload your files to `materials/<course-folder>/`
4. Commit and push — the site updates automatically!

---

## 🚀 GitHub Pages Setup

1. Go to your repo → **Settings** → **Pages**
2. Set **Source** to `Deploy from a branch`
3. Select `main` branch, `/ (root)` folder
4. Save — your site will be live in a minute!

---

## 📌 Material Types

| Type    | Icon | Use for                        |
|---------|------|-------------------------------|
| `pdf`   | 📄   | PDF notes, papers, slides     |
| `code`  | 💻   | Python, MATLAB, C, Arduino    |
| `notes` | 📝   | Markdown notes                |
| `video` | 🎬   | YouTube or local video links  |
| `link`  | 🔗   | External references           |

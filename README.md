# Madrassa Darul Falah Chota Lahor Website - Modular Directory Architecture

This project is organized into a clean, modular folder layout for production deployment:

```
madrassadarulfalah/
│
├── index.html                  (Main Home / Landing Page)
│
├── sections/                   (All Section & Department Endpoint Pages)
│   ├── about.html
│   ├── academics.html
│   ├── hifz-quran.html
│   ├── schooling.html
│   ├── dars-e-nizami.html
│   ├── darul-ifta.html
│   ├── facilities.html
│   ├── admissions.html
│   ├── reviews.html
│   ├── gallery.html
│   └── contact.html
│
├── style/                      (Stylesheets, Scripts & Data JSON)
│   ├── style.css
│   ├── script.js
│   └── data.json
│
└── images/                     (Categorized Photo Assets)
    ├── hero/
    ├── programs/
    ├── facilities/
    ├── leadership/
    └── gallery/
```

## Key Features
- **Root Home Directory**: Only `index.html` resides at the top level for clean URL mapping (`/index.html` or domain root `/`).
- **`sections/` Folder**: All subpages and department endpoints are isolated in their own dedicated directory.
- **`style/` Folder**: `style.css`, `script.js`, and structured data `data.json` are cleanly separated from markup.
- **Hover-Only Dropdowns**: Main navigation dropdowns for *About Us* and *Academics* expand only on mouse hover (`:hover`).
- **Bilingual English & Urdu**: Full RTL script support with instant language switching.

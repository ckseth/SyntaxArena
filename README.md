# 🚀 My-Projects Portfolio

A unified monorepo showcasing full-stack web applications, interactive browser-based games, and algorithmic desktop software.

---

## 📂 Repository Structure

```text
My-Projects/
├── CampusTrade/         # Full-stack MERN campus marketplace platform
│   ├── backend/         # Express.js REST API, MongoDB models, JWT Auth
│   └── frontend/        # React 18, Vite, Tailwind CSS client application
├── Syntax-Arena/        # Interactive gamified coding & syntax playground
│   ├── arena.html / .js # Challenge arena environment
│   ├── game.html / .js  # Core game mechanics and logic checks
│   └── index.html       # Landing page & navigation
├── SkillSphere/         # Algorithmic Skill Exchange & Learning Network
│   ├── main.py          # Tkinter desktop GUI & application controller
│   ├── algorithms.py    # Graph traversal (BFS/DFS) & DP matching logic
│   ├── database.py      # SQLite persistence layer
│   └── skillsphere.db   # Local database store
├── .gitignore           # Unified multi-stack ignore rules
└── README.md            # Monorepo documentation
```

---

## 🛠️ Project Showcases

### 1. 🛒 [CampusTrade](./CampusTrade)
> **A peer-to-peer campus marketplace designed for university students to exchange textbooks, electronics, and college essentials safely.**

- **Architecture**: Decoupled Client-Server (MERN Stack)
- **Frontend**: React 18, Vite, Tailwind CSS, Lucide React, Context API
- **Backend**: Node.js, Express.js, MongoDB (Mongoose), JSON Web Tokens (JWT), Multer
- **Key Features**:
  - 🔐 Secure authentication & profile management
  - 📦 Product listings with category search, price filters, and image uploads
  - 🛒 Dynamic shopping cart & interactive checkout flow
  - 🌙 Responsive UI with tailored dark mode support

#### Quick Start:
```bash
# 1. Setup Backend
cd CampusTrade/backend
npm install
# Configure your MongoDB URI & JWT secret in a .env file (see .env.example)
npm start

# 2. Setup Frontend
cd ../frontend
npm install
npm run dev
```

---

### 2. ⚡ [Syntax-Arena](./Syntax-Arena)
> **A browser-based interactive coding arena and arcade designed to sharpen syntax recall, logic intuition, and speed.**

- **Architecture**: Client-side Vanilla Web Application
- **Tech Stack**: HTML5, Modern JavaScript (ES6+), Responsive CSS3
- **Key Features**:
  - 🎮 Dynamic question engine testing syntax accuracy and coding patterns
  - ⏱️ Real-time countdown timer & scoring algorithm
  - 🎨 Clean, retro-modern gaming interface with audio-visual cues

#### Quick Start:
```bash
cd Syntax-Arena
# Open index.html directly in your browser or serve via any static server:
npx serve .
```

---

### 3. 🌐 [SkillSphere](./SkillSphere)
> **An AI & Graph-powered skill exchange platform that pairs learners and mentors using computer science algorithms.**

- **Architecture**: Python Desktop Application with SQLite Backend
- **Tech Stack**: Python 3, Tkinter, SQLite3
- **Core Algorithms**:
  - 🔍 **Graph Algorithms (BFS & DFS)**: Skill compatibility pathfinding and network connection discovery
  - 🧩 **Dynamic Programming**: Multi-attribute skill and availability optimization
- **Key Features**:
  - 👤 User profile creation with skills offered and skills wanted
  - 🤝 Algorithmic matchmaker finding reciprocal peer exchanges
  - 💾 Persistent local database storage with relational schema

#### Quick Start:
```bash
cd SkillSphere
# Run the desktop application
python main.py
```

---

## 🔒 Security & Best Practices

- **Zero Secrets**: All API keys, credentials, and sensitive configuration files (`.env`) are strictly excluded from version control.
- **Clean Monorepo**: Dependencies (`node_modules/`, `venv/`, `__pycache__/`) and build artifacts are managed through root and local ignore policies.
- **Standardized Code Structure**: Each project maintains its self-contained directory while contributing to a single unified git history.

---

## 📜 License & Author

- **Author**: [ckseth](https://github.com/ckseth)
- **Repository**: [My-Projects](https://github.com/ckseth/My-Projects)
- Distributed under the [MIT License](LICENSE) (or respective project licenses).

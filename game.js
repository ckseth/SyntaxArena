window.addEventListener("DOMContentLoaded", () => {
  const codeSnippet = document.getElementById("codeSnippet");
  const optionsGrid = document.getElementById("optionsGrid");
  const scoreDisplay = document.getElementById("currentScore");
  const levelName = document.getElementById("levelName"); // Level display selector
  const heroCard = document.querySelector(".hero-card");

  let score = 0;

  // Level Data: Name, required score, and neon color
  const levels = [
    { name: "Web Wilderness", threshold: 0, color: "#00d4ff" },
    { name: "Python Pit", threshold: 50, color: "#ffd700" },
    { name: "Logic Labyrinth", threshold: 100, color: "#bc13fe" },
  ];

  const challenges = [
    { code: "body {\n  color: purple;\n}", lang: "CSS" },
    { code: "print('Hello World')", lang: "Python" },
    { code: "console.log('Hi');", lang: "JavaScript" },
    { code: "<h1>Title</h1>", lang: "HTML" },
    { code: "public class Main {}", lang: "Java" },
    { code: "#include <stdio.h>\nint main() {}", lang: "C" },
    { code: "#include <iostream>\nint main() {}", lang: "C++" },
    { code: "SELECT * FROM users;", lang: "SQL" },
    { code: "echo 'Hello World';", lang: "PHP" },
    { code: "let x: number = 10;", lang: "TypeScript" },
    { code: 'fn main() {\n  println!("Hi");\n}', lang: "Rust" },
  ];

  const allLanguages = [
    "HTML",
    "CSS",
    "JavaScript",
    "Python",
    "Java",
    "C",
    "C++",
    "SQL",
    "PHP",
    "TypeScript",
    "Rust",
    "Swift",
    "Go",
  ];

  // --- New Function to Update Levels ---
  function updateLevelStatus() {
    // Score ke basis par sahi level dhoondna
    const currentLvl = [...levels]
      .reverse()
      .find((lvl) => score >= lvl.threshold);

    if (currentLvl) {
      levelName.textContent = currentLvl.name;
      levelName.style.color = currentLvl.color;
      levelName.style.textShadow = `0 0 10px ${currentLvl.color}`;
    }
  }

  function loadNewChallenge() {
    const randomIdx = Math.floor(Math.random() * challenges.length);
    const challenge = challenges[randomIdx];

    codeSnippet.textContent = challenge.code;
    optionsGrid.innerHTML = "";

    let options = [challenge.lang];

    while (options.length < 4) {
      let randomLang =
        allLanguages[Math.floor(Math.random() * allLanguages.length)];
      if (!options.includes(randomLang)) {
        options.push(randomLang);
      }
    }

    options.sort(() => Math.random() - 0.5);

    options.forEach((lang) => {
      const btn = document.createElement("button");
      btn.className = "game-btn";
      btn.textContent = lang;

      btn.onclick = () => {
        if (lang === challenge.lang) {
          score += 10;
          scoreDisplay.textContent = score;
          updateLevelStatus(); // Check and update level after every correct answer
          loadNewChallenge();
        } else {
          showGameOver();
        }
      };
      optionsGrid.appendChild(btn);
    });
  }

  function showGameOver() {
    heroCard.innerHTML = `
        <div class="game-over-screen">
            <h1 style="color: #ff4757; font-size: 2rem;">YOU LOST!</h1>
            <p style="margin: 10px 0; font-size: 1rem;">Final Score: <span style="color: #00d4ff;">${score}</span></p>
            <div class="choice-container" style="margin-top: 20px;">
                <button class="game-btn" id="replayBtn" style="background: #00d4ff; color: #000;">REPLAY</button>
                <button class="game-btn" id="exitBtn" style="margin-left:10px;">EXIT</button>
            </div>
        </div>
    `;

    document.getElementById("replayBtn").onclick = () => location.reload();
    document.getElementById("exitBtn").onclick = () =>
      (window.location.href = "index.html");
  }

  // First time call
  updateLevelStatus();
  loadNewChallenge();
});

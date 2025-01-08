// Config
const config = {
  toxicityLevels: {
    HIGH: { color: "#ffe5e5", threshold: 0.8 },
    MEDIUM: { color: "#fff5e5", threshold: 0.6 },
    LOW: { color: "#f5f5f5", threshold: 0.3 },
  },
  defaultObfuscationChar: "█",
  enableStats: true,
  debug: true,
};

const toxicPatterns = {
  violence: {
    level: "HIGH",
    patterns: ["kill", "murder", "attack", "violent"],
  },
  hate: {
    level: "HIGH",
    patterns: ["hate", "racist", "discrimination"],
  },
  negativity: {
    level: "MEDIUM",
    patterns: ["terrible", "awful", "horrible"],
  },
  custom: {
    level: "MEDIUM",
    patterns: [],
  },
};

// Statistics class
class Statistics {
  constructor() {
    this.stats = {
      totalScanned: 0,
      toxicFound: 0,
      byLevel: {
        HIGH: 0,
        MEDIUM: 0,
        LOW: 0,
      },
      byCategory: {},
    };
  }

  updateStats(analysis) {
    this.stats.totalScanned++;
    if (analysis.isToxic) {
      this.stats.toxicFound++;
      this.stats.byLevel[analysis.level]++;

      analysis.matches.forEach((match) => {
        this.stats.byCategory[match.category] =
          (this.stats.byCategory[match.category] || 0) + 1;
      });
    }
  }

  displayStats() {
    const statsModal = document.createElement("div");
    statsModal.innerHTML = `
      <div class="stats-modal" style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); 
           background: white; padding: 20px; border-radius: 10px; box-shadow: 0 0 20px rgba(0,0,0,0.2); z-index: 10001;">
        <h3>Content Analysis Statistics</h3>
        <p>Total Content Scanned: ${this.stats.totalScanned}</p>
        <p>Toxic Content Found: ${this.stats.toxicFound}</p>
        <h4>By Level:</h4>
        <ul>
          ${Object.entries(this.stats.byLevel)
            .map(([level, count]) => `<li>${level}: ${count}</li>`)
            .join("")}
        </ul>
        <h4>By Category:</h4>
        <ul>
          ${Object.entries(this.stats.byCategory)
            .map(([category, count]) => `<li>${category}: ${count}</li>`)
            .join("")}
        </ul>
        <button onclick="this.parentElement.remove()">Close</button>
      </div>
    `;
    document.body.appendChild(statsModal);
  }
}

// ToxicityDetector class
class ToxicityDetector {
  constructor() {
    console.log("ToxicityDetector: Initializing...");
  }

  async analyzeToxicity(text) {
    return this.patternBasedAnalysis(text);
  }

  patternBasedAnalysis(text) {
    console.log(
      "ToxicityDetector: Analyzing text:",
      text.substring(0, 50) + "..."
    );
    const matches = [];
    let maxLevel = "LOW";

    Object.entries(toxicPatterns).forEach(([category, data]) => {
      data.patterns.forEach((pattern) => {
        if (text.toLowerCase().includes(pattern.toLowerCase())) {
          console.log(
            `ToxicityDetector: Found match - Pattern: ${pattern}, Level: ${data.level}`
          );
          matches.push({ pattern, category, level: data.level });
          if (
            config.toxicityLevels[data.level].threshold >
            config.toxicityLevels[maxLevel].threshold
          ) {
            maxLevel = data.level;
          }
        }
      });
    });

    return {
      isToxic: matches.length > 0,
      level: maxLevel,
      matches,
      text,
    };
  }
}

// ContentFilter class
class ContentFilter {
  constructor() {
    console.log("ContentFilter: Initializing...");
    this.detector = new ToxicityDetector();
    this.stats = new Statistics();
    this.isEnabled = true;
    this.setupUI();
    this.initializeObserver();
    this.addStatusIndicator();
  }

  addStatusIndicator() {
    const indicator = document.createElement("div");
    indicator.id = "toxicity-filter-indicator";
    indicator.style.cssText = `
      position: fixed;
      top: 10px;
      left: 10px;
      background: #4CAF50;
      color: white;
      padding: 5px 10px;
      border-radius: 5px;
      z-index: 10000;
      font-family: Arial, sans-serif;
      font-size: 12px;
    `;
    indicator.textContent = "Toxicity Filter: Active";
    document.body.appendChild(indicator);
  }

  setupUI() {
    const controls = document.createElement("div");
    controls.innerHTML = `
      <div id="toxicity-controls" style="position: fixed; top: 10px; right: 10px; z-index: 10000; background: white; padding: 10px; border-radius: 5px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
        <button id="toggle-filter">Toggle Filter</button>
        <button id="show-stats">Show Statistics</button>
        <div id="sensitivity">
          Sensitivity: <input type="range" min="0" max="100" value="70">
        </div>
      </div>
    `;
    document.body.appendChild(controls);
    this.addEventListeners();
  }

  addEventListeners() {
    document.getElementById("toggle-filter").addEventListener("click", () => {
      this.isEnabled = !this.isEnabled;
      this.processParagraphs();
    });

    document.getElementById("show-stats").addEventListener("click", () => {
      this.stats.displayStats();
    });
  }

  async processParagraphs() {
    console.log("ContentFilter: Processing paragraphs...");
    const paragraphs = document.querySelectorAll("p, h1, h2, h3, article");
    console.log(
      `ContentFilter: Found ${paragraphs.length} elements to process`
    );

    for (const element of paragraphs) {
      const originalText = element.innerText;
      console.log("Processing text:", originalText.substring(0, 50) + "...");

      const analysis = await this.detector.analyzeToxicity(originalText);

      if (analysis.isToxic) {
        console.log("Found toxic content:", analysis);
        this.handleToxicContent(element, analysis);
        this.stats.updateStats(analysis);
      }
    }
  }

  handleToxicContent(element, analysis) {
    const wrapper = document.createElement("div");
    wrapper.className = "toxic-content-wrapper";
    wrapper.style.backgroundColor = config.toxicityLevels[analysis.level].color;

    const obfuscatedText = this.obfuscateText(
      element.innerText,
      analysis.matches
    );
    wrapper.innerHTML = `
      <div class="toxic-content">${obfuscatedText}</div>
      <div class="reveal-button">
        <button onclick="this.parentElement.previousElementSibling.classList.toggle('revealed')">
          Show/Hide Content
        </button>
        <span class="toxicity-level">Toxicity Level: ${analysis.level}</span>
      </div>
    `;

    element.replaceWith(wrapper);
  }

  obfuscateText(text, matches) {
    let result = text;
    matches.forEach((match) => {
      const regex = new RegExp(match.pattern, "gi");
      result = result.replace(
        regex,
        config.defaultObfuscationChar.repeat(match.pattern.length)
      );
    });
    return result;
  }

  initializeObserver() {
    const observer = new MutationObserver(() => {
      if (this.isEnabled) {
        this.processParagraphs();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }
}

// Initialize the filter
console.log("Content script loaded. Initializing ContentFilter...");
window.addEventListener("DOMContentLoaded", () => {
  const filter = new ContentFilter();
  // Make it available globally for testing
  window.toxicityFilter = filter;
});

window.readStoredJson = function(key, fallback) {
    try {
        const value = localStorage.getItem(key);
        return value ? JSON.parse(value) : fallback;
    } catch {
        return fallback;
    }
};

function closeMenu() {
    const sideMenu = document.getElementById("sideMenu");
    const globalBtn = document.getElementById("globalMenuBtn");
    if (!sideMenu) return;
    sideMenu.classList.remove("open");
    sideMenu.setAttribute("aria-hidden", "true");
    if (globalBtn) globalBtn.setAttribute("aria-expanded", "false");
}

document.addEventListener("click", function (e) {
    const moduleButton = e.target.closest("[data-module]");

    // MODULE SWITCH
    if (moduleButton && moduleButton.dataset.module !== "tools") {

        document.querySelectorAll(".calculator, .gpa-calculator")
            .forEach(calc => calc.remove());

        document.querySelectorAll(".module-section")
            .forEach(sec => sec.style.display = "none");

        const id = moduleButton.dataset.module + "Section";
        const section = document.getElementById(id);
        if (!section) return;
        section.style.display = "flex";
        document.querySelectorAll("[data-module]").forEach(button => {
            button.setAttribute("aria-current", button === moduleButton ? "page" : "false");
        });

        localStorage.setItem("currentModule", moduleButton.dataset.module);

        closeMenu();
    }

    // CALCULATOR
    const calculatorButton = e.target.closest("[data-calculator]");
    if (calculatorButton) {
        showCalculator(calculatorButton.dataset.calculator);
        closeMenu();
    }
});


// Function to show calculator in current module
function showCalculator(type) {
    const activeSection = document.querySelector(".module-section:not([style*='display: none'])");
    if (!activeSection) return;

    // Clear any existing calculator
    const existingCalc = activeSection.querySelector(".calculator");
    if (existingCalc) existingCalc.remove();

    // Create calculator
    const calcDiv = document.createElement("div");
    calcDiv.className = "calculator";
    calcDiv.innerHTML = type === "math" ? createMathCalculator() : createGPACalculator();
    activeSection.appendChild(calcDiv);
}

// Menu toggle
// universal menu toggle (single source of truth)
document.querySelectorAll(".menu-toggle").forEach(btn => {
  btn.addEventListener("click", function(e) {
    e.stopPropagation();

    const sideMenu = document.getElementById("sideMenu");
    if(!sideMenu) return;

    // toggle visual state
    const isOpen = sideMenu.classList.toggle("open");

    // sync ARIA attributes
    sideMenu.setAttribute("aria-hidden", !isOpen);
    // update global button expanded state (if present)
    const globalBtn = document.getElementById("globalMenuBtn");
    if(globalBtn) globalBtn.setAttribute("aria-expanded", isOpen);
  });
});

// close menu when clicking outside
document.addEventListener("click", function(e) {
  const sideMenu = document.getElementById("sideMenu");
  if (!sideMenu) return;
  if (sideMenu.contains(e.target)) return;
    if (sideMenu.classList.contains("open")) {
        closeMenu();
  }
});

document.addEventListener("keydown", function(e) {
    if (e.key === "Escape") closeMenu();
});


// Sub-menu toggle for Tools
document.addEventListener("click", function(e) {
    if (e.target.closest("li.has-submenu button[data-module='tools']")) {
        const submenu = e.target.closest("li").querySelector(".submenu");
        const button = e.target.closest("button[data-module='tools']");
        const isOpen = submenu.classList.toggle("open");
        button.setAttribute("aria-expanded", isOpen);
    }
});

// Load last module on page load
document.addEventListener("DOMContentLoaded", function() {
    const allowedModules = ["dashboard", "todo", "notes", "focus"];
    const savedModule = allowedModules.includes(localStorage.getItem("currentModule"))
        ? localStorage.getItem("currentModule")
        : "dashboard";
    const id = savedModule + "Section";
    const section = document.getElementById(id);
    if (section) {
        // Hide all modules
        document.querySelectorAll(".module-section").forEach(sec => sec.style.display = "none");
        // Show the saved module
        section.style.display = "flex";
        const activeButton = document.querySelector(`[data-module="${savedModule}"]`);
        if (activeButton) activeButton.setAttribute("aria-current", "page");
    }
});



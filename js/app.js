document.addEventListener("click", function (e) {

    // MODULE SWITCH
    if (e.target.dataset.module && e.target.dataset.module !== "tools") {

        document.querySelectorAll(".calculator, .gpa-calculator")
            .forEach(calc => calc.remove());

        document.querySelectorAll(".module-section")
            .forEach(sec => sec.style.display = "none");

        const id = e.target.dataset.module + "Section";
        document.getElementById(id).style.display = "flex";

        localStorage.setItem("currentModule", e.target.dataset.module);

        document.getElementById("sideMenu").classList.remove("open");
    }

    // CALCULATOR
    if (e.target.dataset.calculator) {
        showCalculator(e.target.dataset.calculator);
        document.getElementById("sideMenu").classList.remove("open");
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
    sideMenu.classList.remove("open");
    sideMenu.setAttribute("aria-hidden", "true");
    const globalBtn = document.getElementById("globalMenuBtn");
    if(globalBtn) globalBtn.setAttribute("aria-expanded", "false");
  }
});


// Sub-menu toggle for Tools
document.addEventListener("click", function(e) {
    if (e.target.closest("li.has-submenu button[data-module='tools']")) {
        const submenu = e.target.closest("li").querySelector(".submenu");
        submenu.classList.toggle("open");
    }
});

// Load last module on page load
document.addEventListener("DOMContentLoaded", function() {
    // Always start with dashboard
    const id = "dashboardSection";
    const section = document.getElementById(id);
    if (section) {
        // Hide all modules
        document.querySelectorAll(".module-section").forEach(sec => sec.style.display = "none");
        // Show dashboard
        section.style.display = "flex";
    }
});



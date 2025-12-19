document.addEventListener("click", function(e){
    if (e.target.dataset.module && e.target.dataset.module !== "tools") {
        // Remove any existing calculators
        document.querySelectorAll(".calculator, .gpa-calculator").forEach(calc => calc.remove());

        // Hide all modules
        document.querySelectorAll(".module-section")
            .forEach(sec => sec.style.display = "none");

        // Show selected module
        const id = e.target.dataset.module + "Section";
        document.getElementById(id).style.display = "flex";

        // Save current module
        localStorage.setItem("currentModule", e.target.dataset.module);

        // Close sidebar
        document.getElementById("sideMenu").classList.remove("open");
    }

    if (e.target.dataset.calculator) {
        const calculatorType = e.target.dataset.calculator;
        showCalculator(calculatorType);

        // Close sidebar
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
document.querySelectorAll(".menu-toggle").forEach(btn => {
    btn.addEventListener("click", function() {
        const menu = document.getElementById("sideMenu");
        menu.classList.toggle("open");
    });
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

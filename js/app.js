document.addEventListener("click", function(e){
    if (!e.target.dataset.module) return;

    // Hide all modules
    document.querySelectorAll(".module-section")
        .forEach(sec => sec.style.display = "none");

    // Show selected module
    const id = e.target.dataset.module + "Section";
    document.getElementById(id).style.display = "block";
});

document.getElementById('gradeDistributions').addEventListener('click', function() {
    // Redirect to the grade distributions page
    window.location.href = 'gradeDistributions.html';
});

document.getElementById('findCourses').addEventListener('click', function() {
    // Redirect to the find easy courses page
    window.location.href = 'findEasyCourses.html';
});

// Get the modal
var modal = document.getElementById("infoModal");
var btn = document.getElementById("infoBtn");
var span = document.getElementsByClassName("close")[0];

btn.onclick = function() {
    modal.style.display = "block";
}

span.onclick = function() {
    modal.style.display = "none";
}

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}
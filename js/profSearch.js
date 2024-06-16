let names = [];
let currentCourse = null;
google.charts.load("current", { packages: ["corechart"] });

// Function to show suggestions based on user input
function showSuggestions() {
    const input = document.getElementById('searchBox').value.toLowerCase();
    const suggestions = document.getElementById('suggestions');
    suggestions.innerHTML = ''; 
    suggestions.style.display = 'none';

    if (input.length > 0) {
        const inputParts = input.split(' ').filter(part => part); // Split input by spaces and filter out empty parts
        
        const filteredNames = names.filter(name => {
            const nameParts = name.toLowerCase().split(/[,\s]+/).filter(part => part); // Split name by comma and spaces and filter out empty parts
            
            // Check if every input part is included in any part of the name
            return inputParts.every(inputPart => 
                nameParts.some(namePart => namePart.includes(inputPart))
            );
        });

        if (filteredNames.length > 0) {
            suggestions.style.display = 'block';
            filteredNames.forEach(name => {
                const div = document.createElement('div');
                div.className = 'suggestion-item';
                div.textContent = name;
                div.onclick = () => selectName(name);
                suggestions.appendChild(div);
            });
        }

        const inputRect = document.getElementById('searchBox').getBoundingClientRect();
        suggestions.style.width = `${inputRect.width}px`;
        suggestions.style.left = `${inputRect.left}px`;
        suggestions.style.top = `${inputRect.bottom}px`;
    }
}


// Handle name selection from suggestions
function selectName(name) {
    const searchBox = document.getElementById('searchBox');
    searchBox.value = name;
    document.getElementById('suggestions').style.display = 'none';

    // Construct API URL with selected name
    const apiUrl = `https://grade-distribution-api-adamnimer1.replit.app/api/profSearch?instructor=${encodeURIComponent(name)}`;

    // API call with selected name
    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            displayData(data.response);
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred: ' + error.message);
        });
}

// Function to display data organized by semester
function displayData(data) {
    const content = document.getElementById('content');
    content.innerHTML = '';

    const semesters = {};

    data.forEach(item => {
        const semester = item.semester.trim();
        if (!semesters[semester]) {
            semesters[semester] = [];
        }
        semesters[semester].push(item);
    });

    const sortedSemesters = Object.keys(semesters).sort((a, b) => {
        const seasonOrder = { SP: 0, SU: 1, FA: 2 };
        const yearA = parseInt(a.slice(2));
        const yearB = parseInt(b.slice(2));
        const seasonA = a.slice(0, 2);
        const seasonB = b.slice(0, 2);
        
        if (yearA !== yearB) {
            return yearB - yearA;
        } else {
            return seasonOrder[seasonB] - seasonOrder[seasonA];
        }
    });

    sortedSemesters.forEach(semester => {
        const section = document.createElement('div');
        section.className = 'semester-section';

        const header = document.createElement('h2');
        header.textContent = semester;
        section.appendChild(header);

        semesters[semester].forEach(classData => {
            const button = document.createElement('button');
            button.className = 'class-button main-button';
            button.textContent = `${classData.dept_name} ${classData.class_num}`;
            button.onclick = () => showModal(classData, semester);
            section.appendChild(button);
        });

        content.appendChild(section);
    });
}

function showModal(classData, semester) {
    currentCourse = classData;
    currentCourse.semester = semester; 
    currentCourse.class_title;
    const modal = document.getElementById('myModal');
    modal.style.display = 'block';
    requestAnimationFrame(function() {
        drawChart(classData, semester);
    });
}

// Function to draw the pie chart
function drawChart(course, semester) {
    var chartContainer = document.getElementById('donutchart');
    chartContainer.style.width = '100%';
    var data = google.visualization.arrayToDataTable([
        ['Grades', 'Number'],
        ['A', course.A],
        ['B', course.B],
        ['C', course.C],
        ['D', course.D],
        ['F', course.F]
    ]);

    var options = {
        title: semester + ": " + course.class_title + " with " + course.instructor,
        pieHole: 0.4,
        chartArea: {
            width: '80%', 
            height: '80%' 
        },
        backgroundColor: 'transparent', 
    };
    var chart = new google.visualization.PieChart(document.getElementById('donutchart'));
    chart.draw(data, options);
}

window.addEventListener('resize', function() {
    if (currentCourse) {
        drawChart(currentCourse, currentCourse.semester);
    }
});

// close modal
function closeModal() {
    const modal = document.getElementById('myModal');
    modal.style.display = 'none';
}

// Close modal if user clicks outside of it
window.onclick = function(event) {
    const modal = document.getElementById('myModal');
    if (event.target == modal) {
        modal.style.display = 'none';
    }
}

function loadCSVData() {
    Papa.parse('../csv/uic_instructors.csv', {
        download: true,
        header: false,
        skipEmptyLines: true,
        complete: function(results) {
            names = results.data.map(row => row[0].replace(/(^"|"$)/g, ''));
        }
    });
}

window.onload = loadCSVData;

document.getElementById('goBack').addEventListener('click', function() {
    window.location.href = '/';
});

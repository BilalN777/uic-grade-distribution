let count = 0;
let countDBID = 1;
google.charts.load("current", {packages:["corechart"]});

function saveData(data1, data2, data3) {
    var dbPromise = indexedDB.open('my_database', 2);

    dbPromise.onupgradeneeded = function(event) {
        var db = event.target.result;
        if (!db.objectStoreNames.contains('data')) {
            var objectStore = db.createObjectStore('data', {keyPath: 'id'});
        }
    };

    dbPromise.onsuccess = function(event) {
        var db = event.target.result;
        var transaction = db.transaction(['data'], 'readwrite');
        var dataStore = transaction.objectStore('data');
        dataStore.add({id: countDBID, subject: data1, courseNumber: data2, semester: data3});
        countDBID++;
        transaction.oncomplete = function() {
            console.log("Data saved successfully.");
        };
    };
}

function clear() {
    const classListContainer = document.getElementById('class-list-container');
    while (classListContainer.firstChild) {
        classListContainer.removeChild(classListContainer.firstChild);
    }
}

function search() {
  let subj = document.getElementById("subject").value; 
  let courseNum = document.getElementById("course_num").value;
  let semester = document.getElementById("semester").value;
  let notValid = false;
  
  // Validation for Course Number
  if(courseNum.length != 3 || isNaN(courseNum)){
    notValid = true;
  }

  // Validation for Semester
  let validSemester = /^(F|S)(P|U|A)\d{2}$/i;  // Regex to match semester format like SP22, SU22, FA22, etc.
  if(!validSemester.test(semester)) {
    notValid = true;
  }

  if (notValid) {
    console.log("NOT A VALID SEARCH");
    displayInvalidSearchMessage();
    return;
  }

  if (!notValid) {
    saveData(subj, courseNum, semester);
    let link = 'https://grade-distribution-api-adamnimer1.replit.app/api/allGrades?' + 'semester=' + semester.toUpperCase() + "&subject=" + subj.toUpperCase() + "&class_num=" + courseNum;

    fetch(link)
      .then((response) => response.json())
      .then((data) => {
        clear();
        if (data.response.length > 0) {
          if (data.response.length == 1) {
            let selectMessage = document.createElement("div");
            selectMessage.textContent = "Select the Course Below.";
            selectMessage.className = "mdc-typography--headline6";
            document.getElementById('class-list-container').appendChild(selectMessage);
          }
          else if (data.response.length > 1) {
            // Display 'Select One of the Courses Below' when multiple courses are available
            let selectMessage = document.createElement("div");
            selectMessage.textContent = "Select One of the Courses Below.";
            selectMessage.className = "mdc-typography--headline6";
            document.getElementById('class-list-container').appendChild(selectMessage);
          }

          data.response.forEach((course, index) => {
            let courseContainer = document.createElement("div");
            courseContainer.id = "course-" + index;
            courseContainer.className = "instructor-container";
            let instructorInfo = document.createElement("div");
            instructorInfo.textContent = "Instructor: " + course.instructor;
            courseContainer.appendChild(instructorInfo);
            document.getElementById('class-list-container').appendChild(courseContainer);


            courseContainer.addEventListener("click", () => {
              drawChart(course);
              document.getElementById("donutchart").hidden = false;
              openModal(course);
            });
          });
        } else {
          displayNoMatchesMessage();
        }
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
        displayErrorMessage();
      });
  }
}

function displayInvalidSearchMessage() {
  let classListContainer = document.getElementById('class-list-container');
  classListContainer.textContent = "NOT A VALID SEARCH, TRY AGAIN.";
}


function drawChart(course) {
  var chartContainer = document.getElementById('donutchart');
  chartContainer.style.width = '100%';
  var data = google.visualization.arrayToDataTable([
    ['Grades', 'Number'],
    ['A',     course.A],
    ['B',      course.B],
    ['C',  course.C],
    ['D', course.D],
    ['F',  course.F]
  ]);

  var options = {
    title: course.class_title + " with " + course.instructor,
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
      drawChart(currentCourse); 
  }
});

function showDialog(message, buttonText) {
  const dialog = document.querySelector('.mdc-dialog');
  const content = dialog.querySelector('.mdc-dialog__content');
  const button = dialog.querySelector('.mdc-button');
  const scrim = dialog.querySelector('.mdc-dialog__scrim');

  content.innerHTML = message;
  button.querySelector('.mdc-button__label').innerHTML = buttonText;

  dialog.classList.add('mdc-dialog--open');

  button.addEventListener('click', () => {
    dialog.classList.remove('mdc-dialog--open');
  });

  scrim.addEventListener('click', () => {
    dialog.classList.remove('mdc-dialog--open');
  });
}

function grades(){
  console.log("grades");
  clearSelection();
  var button = document.querySelector(".dropDownButton").innerText = "Dropdown";
  var data = document.getElementById("easiestCourses").hidden = true;
  var grades = document.getElementById("grades").hidden= false;
}

function courseSelection(){
  console.log("easiestCourses");
  clear(); 
  const removeChart = document.getElementById("donutchart").hidden = true;
  var data = document.getElementById("grades").hidden = true;
  var courses = document.getElementById("easiestCourses").hidden= false;
}

// function openModal(course) {
//   document.getElementById("customModal").style.display = "block";
//   // Use setTimeout to wait until the modal is fully visible
//   setTimeout(function() {
//       drawChart(course); 
//   }, 300); // Adjust delay based on your CSS transitions
// }

function openModal(course) {
  document.getElementById("customModal").style.display = "block";
  requestAnimationFrame(function() {
    drawChart(course);
  });
}

function setUpModalClose() {
  var modal = document.getElementById("customModal");
  modal.addEventListener("click", function() {
    closeModal(); // Calls the function to close the modal
  });

  var modalContent = document.querySelector(".custom-modal-content");
  modalContent.addEventListener("click", function(event) {
    event.stopPropagation(); // Prevents the click from closing the modal when clicking inside the modal content
  });
}

setUpModalClose();

function closeModal() {
  var modal = document.getElementById("customModal");
  modal.style.display = "none";
}

function displayNoMatchesMessage() {
    let classListContainer = document.getElementById('class-list-container');
    classListContainer.textContent = "NO MATCHES, ARE YOU SURE THAT THIS IS A CLASS? OR MAYBE THIS CLASS WAS NOT OFFERED THIS SEMESTER.";
}

function displayErrorMessage() {
    let classListContainer = document.getElementById('class-list-container');
    classListContainer.textContent = "Error fetching data. Please try again later.";
}
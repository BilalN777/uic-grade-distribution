let count = 0;
let countDBID = 1;
google.charts.load("current", {packages:["corechart"]});

function saveData(data1, data2, data3) {
    var dbPromise = indexedDB.open('my_database', 2);

    dbPromise.onupgradeneeded = function(event) {
        var db = event.target.result;

        // Create the 'data' object store if it doesn't already exist.
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

function clear(){
    const removeDiv = document.querySelectorAll('.mdc-deprecated-list-item');
    const removeTitle = document.querySelectorAll('.mdc-typography--headline6')
    // const removeCurrClass = document.querySelectorAll('.currClass')
    
    removeDiv.forEach(element => {
      element.remove();
    });

    removeTitle.forEach(element => {
      element.remove();
    });
    
    // removeCurrClass.forEach(box => {
    //   box.remove();
    // });
  
}

function search() {

  //condition makes sure it is not first search (nothing to clear if there is no previous search)
  if (count > 0){
    clear();
    
  }
  count++; // searches counter

  
  let subj = document.getElementById("subject").value; 
  let courseNum = document.getElementById("course_num").value;
  let semester = document.getElementById("semester").value;
  let theSemester;
  let notValid = false;

  

  //checks whether course number is invalid
  if(courseNum.length != 3){
    notValid = true;
  }
  else if(isNaN(courseNum) == true){
    notValid = true;
  }
  

  //checks if semester is 4 characters.
  if(semester.length != 4){
    notValid = true;
  }
  //Get semester name to output for title
  else if(semester[0].toUpperCase() == "F") 
    theSemester = "Fall";
  else if(semester[0].toUpperCase() == "S" && semester[1].toUpperCase() == "P")
    theSemester = "Spring";
  else if(semester[0].toUpperCase() == "S" && semester[1].toUpperCase() == "U") {
    theSemester = "Summer";
  }
  else{
    notValid = true;
  }


  if(notValid == true){
    console.log("NOT A VALID SEARCH");
    let notValidMessage = document.createElement("div");
    notValidMessage.setAttribute("class", "mdc-typography--headline6");
    notValidMessage.setAttribute("id", "notValid");
    document.body.append(notValidMessage);
    notValidMessage.innerHTML += "NOT A VALID SEARCH, TRY AGAIN.";
    const removeChart = document.getElementById("donutchart").hidden = true;
    return;
  }
  
  saveData(subj, courseNum, semester);
  //Get year for title
  let theYear = "20" + semester[2] + semester[3];

  //Connects correct link for API call that returns data that user wants.
  let link = 'https://Test-for-GD.adamnimer1.repl.co/api/allGrades?' + 'semester=' + 
  semester.toUpperCase() + "&subject=" + subj.toUpperCase() + "&class_num=" + courseNum;
  let idCounter = 0;

   fetch(link)
     .then((response) => {
       return response.json()
           })
     .then ((data) => {

       
    if (data.response.length > 1){
        let selectClass = document.createElement("div");
            selectClass.setAttribute("class", "mdc-typography--headline6");
            selectClass.setAttribute("id", "selectClass");
            document.body.append(selectClass);
            selectClass.innerHTML += "Select One of the Classes Below.";
            selectClass.innerHTML += "</br>";
      
       }
       
       //Creates div element for title and sets it to its respective class title.
       let title = document.createElement("div");
       title.setAttribute("class", "mdc-typography--headline6");
       title.setAttribute("id", "title");
       document.body.append(title);

       let doesntExist = false;
       
      if (data.response.length == 0){
        doesntExist = true;
       }
        
       else if(courseNum != "294"){ 
         title.innerHTML += data.response[0].subject + 
         data.response[0].class_num + ": " + data.response[0].class_title 
         + " Courses in " + theSemester + " " + theYear;  
       }
       else { //Handles edge case for 294 courses (since they have different titles)
         title.innerHTML += data.response[0].subject + 
         data.response[0].class_num + ": " + "Special Topics" 
         + " Courses in " + theSemester + " " + theYear;  
       }
       
         if(doesntExist == true){
            console.log("NO MATCHES, ARE YOU SURE THAT THIS IS A CLASS?");
            let notValidMessage = document.createElement("div");
            notValidMessage.setAttribute("class", "mdc-typography--headline6");
            notValidMessage.setAttribute("id", "notValid");
            document.body.append(notValidMessage);
            notValidMessage.innerHTML += "NO MATCHES, ARE YOU SURE THAT THIS IS A CLASS?";

            const removeChart = document.getElementById("donutchart").hidden = true;
            return;
          }

       
       
  
      if (data.response.length == 1){
        let oneCourse = data.response[0];
        drawChart(oneCourse);
       }

       
        //Goes through each variant of the course for that semester and will output
        //the teacher in its own div.
        data.response.forEach((course) => {
          
          let oneInstance = document.createElement("div");
          document.body.append(oneInstance);
          oneInstance.setAttribute("id",idCounter);
          oneInstance.setAttribute("class", "mdc-deprecated-list-item");
          if(idCounter % 3 +1 == 0){
            oneInstance += '<br/>'
          }

          //If a div is clicked on, it will call the drawChart function which will output
          //the data for that specific course
          oneInstance.addEventListener("click", (event) => {
            removeChart = document.getElementById("donutchart").hidden = false;
            event.preventDefault();
            let idNum = event.target.getAttribute("id");
            // console.log(idNum);


            google.charts.load("current", {packages:["corechart"]});
            
            drawChart(course);
            
          })
          //Sets text for each div.
          oneInstance.innerHTML += "<br />" + "Instructor: " + course.instructor;
          idCounter+=1; //increments counter so next div has unique id.
        //   console.log(data)
        })
    })   
}


function drawChart(course) {
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
    };

    var chart = new google.visualization.PieChart(document.getElementById('donutchart'));
    chart.draw(data, options);

    // let withdrawsTotalStudents = document.createElement("div");
    // document.body.append(withdrawsTotalStudents);
    // withdrawsTotalStudents.setAttribute("class", "withdrawsTotalStudents");
    // withdrawsTotalStudents.innerText +=  "Total Students: " + course.total_students + " Withdrawn: " + course.withdrawn;
}   


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


function clear(){
    const removeDiv = document.querySelectorAll('.mdc-deprecated-list-item');
    const removeTitle = document.querySelectorAll('.mdc-typography--headline6')
    
    removeDiv.forEach(element => {
      element.remove();
    });

    removeTitle.forEach(element => {
      element.remove();
    });
  
}




function grades(){
  console.log("grades")
  // clearStoredData();
  clearSelection();
  var button = document.querySelector(".dropDownButton").innerText = "Dropdown";
  // var button2 = document.querySelector(".courseSelection").innerText = "Course Level";
  var data = document.getElementById("easiestCourses").hidden = true;
  var grades = document.getElementById("grades").hidden= false;
}


function courseSelection(){
  console.log("easiestCourses")
  clear(); //clears any grade data
  const removeChart = document.getElementById("donutchart").hidden = true;
  var data = document.getElementById("grades").hidden = true;
  var courses = document.getElementById("easiestCourses").hidden= false;
}
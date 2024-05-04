document.getElementById('goBack').addEventListener('click', function() {
  // Redirect to the find easy courses page
  window.location.href = '/';
});

let buttonValue = "NULL";
let idGlobal = null;

const options = ['ACTG', 'ANAT', 'ANTH', 'AHS', 'ARAB', 'ARCH', 'ART', 'AH', 'BCMG', 'BIOS', 'BHIS', 
                'BME', 'BPS', 'BSTT', 'BLST', 'BA', 'CC', 'CST', 'CEES', 'CHE', 'CHEM', 'CHIN', 'CME', 'CL', 'COMM', 'CHSC', 'CS', 'CLJ', 
                 'CI', 'DES', 'DLG', 'DHD', 'EAES', 'ECON', 'ED', 'EDPS', 'EPSY', 'ECE', 'ENGR', 'ENGL', 'ELSI', 'ENTR', 'FIN', 'FR', 'GWS', 
                 'GEOG', 'GER', 'GLAS', 'GKA', 'GKM', 'GAMD', 'HIM', 'HEB', 'HNUR', 'HIST', 'HON', 'HN', 'HUM', 'IE', 'IDS', 'IT', 'IDEA', 
                 'IPHS', 'ISA', 'INST', 'ITAL', 'JPN', 'JST', 'KN', 'KOR', 'LAT', 'LALS', 'LAS', 'LIB', 'LING', 'LCSL', 'LITH', 'MGMT', 
                 'MKTG', 'MENG', 'MCS', 'MATH', 'MTHT', 'ME', 'PMMP', 'MIM', 'MILS', 'MOVI', 'MUSE', 'MUS', 'NAST', 'NATS', 'NS', 'NEUS', 
                 'NURS', 'NUEL', 'OT', 'PATH', 'PSCI', 'PCOL', 'PHAR', 'PMPR', 'PSOP', 'PHIL', 'PT', 'PHYS', 'PHYB', 'POL', 'POLS', 'PORT', 
                 'PSCH', 'PA', 'PUBH', 'PPOL', 'PPA', 'RES', 'RELS', 'RUSS', 'SLAV', 'SJ', 'SOC', 'SPAN', 'SPED', 'STAT', 'SABR', 'THTR', 
                 'UPA', 'UPP', 'US'];
const dropdown = document.querySelector('.dropdown-content');
dropdown.style.display = 'none';

options.forEach(option => {
  const link = document.createElement('a');
  link.href = '#';
  link.textContent = option;
  link.setAttribute('data-option', option);
  dropdown.appendChild(link);
});


const button = document.querySelector('.dropDownButton');
const dropdownItems = document.querySelectorAll('.dropdown-content a');

dropdownItems.forEach(item => {
  item.addEventListener('click', event => {
    event.preventDefault();
    button.textContent = event.target.textContent;
  });
});


dropdownItems.forEach(item => {
  item.addEventListener('click', event => {
    event.preventDefault();
    idGlobal = null;
    if (Array.prototype.indexOf.call(dropdownItems, event.target) !== 0) {
      let option = event.target.getAttribute('data-option');
      button.textContent = option;
    }
    dropdown.style.display = 'none';
    buttonValue = event.target.getAttribute('data-option');
    clearSelection();

    

    let messageForUser = document.createElement('div');
    messageForUser.classList.add('theList');
    messageForUser.innerText = `List for ${buttonValue} Courses`;
    document.getElementById('class-list-container').appendChild(messageForUser);


    if (idGlobal != null){
    filterByLevel(idGlobal);

    }
    else {
    
    let link = 'https://grade-distribution-api-adamnimer1.replit.app/api/easiestCourses?subject=' + buttonValue;
    fetch(link)
    .then(response => response.json())
    .then(data => {

      const list = document.createElement('ul');
      list.setAttribute("class", "theList");
      list.classList.add('mdc-list');
    
      data.response.forEach(item => {
        const listItem = document.createElement('div');
        listItem.classList.add('theList');
        const listItemText = document.createElement('div');
        listItemText.classList.add('theList');
        listItemText.style.color = '#880720';
        listItemText.style.fontWeight = 'bold';
        if (item.MEAN == '0' || item.MEAN == null){
          listItemText.textContent = `${item.subject} ${item.class_num} Mean: No grades given`;
        }
        else {
          listItemText.textContent = `${item.subject} ${item.class_num} Mean: ${item.MEAN.toFixed(2)}`;
        }
        listItem.appendChild(listItemText);
        list.appendChild(listItem);
      });
      document.getElementById('class-list-container').append(list);
    });
    }


    
  });
});


button.addEventListener('click', event => {
  if (dropdown.style.display === 'block') {
    event.preventDefault();
  }
  dropdown.style.display = 'block';
});
document.body.addEventListener('click', event => {
  if (!event.target.matches('.dropDownButton, .dropdown-content a')) {
    dropdown.style.display = 'none';
  }
});



function clearSelection(){
    const theList = document.querySelectorAll('.theList');

    theList.forEach(element => {
      element.remove();
    });

}


function filterByLevel(id){
  idGlobal = id;
    let link = "NULL";

  if(buttonValue == "NULL" && id == "NULL"){
    link = "https://grade-distribution-api-adamnimer1.replit.app/api/easiestCoursesAll";
  }
  else if (buttonValue == "NULL"){
    link = "https://grade-distribution-api-adamnimer1.replit.app/api/easiestCoursesWithOnlyLevel?class_num=" + id;
  }
  else if (id != "NULL") {
    link = 'https://grade-distribution-api-adamnimer1.replit.app/api/easiestCoursesWithLevel?subject=' + buttonValue + "&class_num=" + id;
  }
  else {
    link = 'https://grade-distribution-api-adamnimer1.replit.app/api/easiestCourses?subject=' + buttonValue;
  }
  
  clearSelection()

  if(buttonValue == "NULL" && id == "NULL"){
  let messageForUser = document.createElement('div');
      messageForUser.classList.add('theList');
      messageForUser.innerText = `Use the filter options to get a more concise list.`;
      document.getElementById('class-list-container').append(messageForUser);
  }
  else if(buttonValue != "NULL" && id == "NULL"){
      let messageForUser = document.createElement('div');
      messageForUser.classList.add('theList');
      messageForUser.innerText = `Use the filter options to get a more concise list.`;
      document.getElementById('class-list-container').append(messageForUser);
  }
  else if(buttonValue != "NULL" && id != "NULL") {
  let messageForUser = document.createElement('div');
      messageForUser.classList.add('theList');
      messageForUser.innerText = `List for ${buttonValue} ${id}00 Level Courses`;
      document.getElementById('class-list-container').append(messageForUser);

  }
  else if(buttonValue == "NULL" && id != "NULL"){
      let messageForUser = document.createElement('div');
      messageForUser.classList.add('theList');
      messageForUser.innerText = `List for ${id}00 Level Courses
      (specify a subject for a more concise list).`;
      document.getElementById('class-list-container').append(messageForUser);
  }

  
    fetch(link)
    .then(response => response.json())
    .then(data => {
      const list = document.createElement('ul');
      list.setAttribute("class", "theList");
      list.classList.add('mdc-list');
      if (data.response.length == 0){
        let doesntExist = document.createElement('div');
        doesntExist.classList.add('theList');
        doesntExist.innerText = `
        No classes found for this filter.`;
        document.getElementById('class-list-container').append(doesntExist);
      }
      
      data.response.forEach(item => {
        const listItem = document.createElement('div');
        listItem.classList.add('theList');
        const listItemText = document.createElement('div');
        listItemText.classList.add('theList');
        listItemText.style.color = '#880720';
        listItemText.style.fontWeight = 'bold';
        if (item.MEAN == '0' || item.MEAN == null){
          listItemText.textContent = `${item.subject} ${item.class_num} Mean: No grades given`;
        }
        else {
          listItemText.textContent = `${item.subject} ${item.class_num} Mean: ${item.MEAN.toFixed(2)}`;
        }
        listItem.appendChild(listItemText);
        list.appendChild(listItem);
      });
      document.getElementById('class-list-container').append(list);
    });
  
}
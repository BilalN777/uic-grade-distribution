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
    // Check if the event target is not the first dropdown item
    if (Array.prototype.indexOf.call(dropdownItems, event.target) !== 0) {
      let option = event.target.getAttribute('data-option');
      button.textContent = option;
    }
    // Hide the menu
    dropdown.style.display = 'none';
    // let storeButton = document.querySelector('.dropDownButton');
    buttonValue = event.target.getAttribute('data-option');
    console.log(buttonValue);
    clearSelection();

    let messageForUser = document.createElement('div');
    messageForUser.classList.add('theList');
    messageForUser.innerText = `List for ${buttonValue} Courses`;
    document.body.append(messageForUser);

    if (idGlobal != null){
    filterByLevel(idGlobal);

    }
    else {
    
    let link = 'https://Grade-Distribution-API.adamnimer1.repl.co/api/easiestCourses?subject=' + buttonValue;
    fetch(link)
    .then(response => response.json())
    .then(data => {

      
      // Create a list element
      const list = document.createElement('ul');
      list.setAttribute("class", "theList");
      list.classList.add('mdc-list');
      
      // Iterate through the data and create list items
      data.response.forEach(item => {
        const listItem = document.createElement('div');
        listItem.classList.add('theList');
        const listItemText = document.createElement('div');
        listItemText.classList.add('theList');
        listItemText.style.color = '#09adc3';
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

      // Append the list to the page
      document.body.append(list);
    });
    }


    
  });
});


button.addEventListener('click', event => {
  // Only prevent the default action if the dropdown menu is already visible
  if (dropdown.style.display === 'block') {
    event.preventDefault();
  }
  // Display the dropdown menu
  dropdown.style.display = 'block';
});


//will allow user to click outside of menu and close dropdown
document.body.addEventListener('click', event => {
  // Check if the target of the event is not the dropdown button or any of the dropdown items
  if (!event.target.matches('.dropDownButton, .dropdown-content a')) {
    // Hide the dropdown menu
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
    link = "https://Grade-Distribution-API.adamnimer1.repl.co/api/easiestCoursesAll";
  }
  else if (buttonValue == "NULL"){
    link = "https://Grade-Distribution-API.adamnimer1.repl.co/api/easiestCoursesWithOnlyLevel?class_num=" + id;
  }
  else if (id != "NULL") {
    link = 'https://Grade-Distribution-API.adamnimer1.repl.co/api/easiestCoursesWithLevel?subject=' + buttonValue + "&class_num=" + id;
  }
  else {
    link = 'https://Grade-Distribution-API.adamnimer1.repl.co/api/easiestCourses?subject=' + buttonValue;
  }
  
  clearSelection()

  if(buttonValue == "NULL" && id == "NULL"){
  let messageForUser = document.createElement('div');
      messageForUser.classList.add('theList');
      messageForUser.innerText = `Use the filter options to get a more concise list.`;
      document.body.append(messageForUser);
  }
  else if(buttonValue != "NULL" && id == "NULL"){
      let messageForUser = document.createElement('div');
      messageForUser.classList.add('theList');
      messageForUser.innerText = `Use the filter options to get a more concise list.`;
      document.body.append(messageForUser);
  }
  else if(buttonValue != "NULL" && id != "NULL") {
  let messageForUser = document.createElement('div');
      messageForUser.classList.add('theList');
      messageForUser.innerText = `List for ${buttonValue} ${id}00 Level Courses`;
      document.body.append(messageForUser);
  }
  else if(buttonValue == "NULL" && id != "NULL"){
      let messageForUser = document.createElement('div');
      messageForUser.classList.add('theList');
      messageForUser.innerText = `List for ${id}00 Level Courses
      (specify a subject for a more concise list).`;
      document.body.append(messageForUser);
  }

  
  console.log(link);
    fetch(link)
    .then(response => response.json())
    .then(data => {
      // Create a list element
      const list = document.createElement('ul');
      list.setAttribute("class", "theList");
      list.classList.add('mdc-list');
      console.log(data);


      if (data.response.length == 0){
        let doesntExist = document.createElement('div');
        doesntExist.classList.add('theList');
        doesntExist.innerText = `No classes found for this filter.`;
        document.body.append(doesntExist);
      }
      
      // Iterate through the data and create list items
      data.response.forEach(item => {
        const listItem = document.createElement('div');
        listItem.classList.add('theList');
        const listItemText = document.createElement('div');
        listItemText.classList.add('theList');
        listItemText.style.color = '#09adc3';
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

      // Append the list to the page
      document.body.append(list);
    });
  
}
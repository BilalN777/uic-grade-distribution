const semesterOptions = [];

 // Loop through the years
 for (let year = 2023; year >= 2006; year--) {
    // Add the spring semester for the current year
    semesterOptions.push(`sp${year.toString().substr(-2)}`);
    // Add the fall semester for the current year
    semesterOptions.push(`fa${year.toString().substr(-2)}`);
    // Add the summer semester for the current year
    semesterOptions.push(`su${year.toString().substr(-2)}`);
 }
console.log(semesterOptions)

 // Get the datalist element
 const datalistSemester = document.getElementById('semester-list');

 // Loop through the options array
 for (const option of semesterOptions) {
    // Create a new option element
    const opt = document.createElement('option');
    // Set the value and text of the option
    opt.value = option;
    opt.text = option;
    // Append the option to the datalist
    datalistSemester.appendChild(opt);
 }
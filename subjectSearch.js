const subjectOptions = ['ACTG', 'ANAT', 'ANTH', 'AHS', 'ARAB', 'ARCH', 'ART', 'AH', 'BCMG', 'BIOS', 'BHIS', 
                'BME', 'BPS', 'BSTT', 'BLST', 'BA', 'CC', 'CST', 'CEES', 'CHE', 'CHEM', 'CHIN', 'CME', 'CL', 'COMM', 'CHSC', 'CS', 'CLJ', 
                 'CI', 'DES', 'DLG', 'DHD', 'EAES', 'ECON', 'ED', 'EDPS', 'EPSY', 'ECE', 'ENGR', 'ENGL', 'ELSI', 'ENTR', 'FIN', 'FR', 'GWS', 
                 'GEOG', 'GER', 'GLAS', 'GKA', 'GKM', 'GAMD', 'HIM', 'HEB', 'HNUR', 'HIST', 'HON', 'HN', 'HUM', 'IE', 'IDS', 'IT', 'IDEA', 
                 'IPHS', 'ISA', 'INST', 'ITAL', 'JPN', 'JST', 'KN', 'KOR', 'LAT', 'LALS', 'LAS', 'LIB', 'LING', 'LCSL', 'LITH', 'MGMT', 
                 'MKTG', 'MENG', 'MCS', 'MATH', 'MTHT', 'ME', 'PMMP', 'MIM', 'MILS', 'MOVI', 'MUSE', 'MUS', 'NAST', 'NATS', 'NS', 'NEUS', 
                 'NURS', 'NUEL', 'OT', 'PATH', 'PSCI', 'PCOL', 'PHAR', 'PMPR', 'PSOP', 'PHIL', 'PT', 'PHYS', 'PHYB', 'POL', 'POLS', 'PORT', 
                 'PSCH', 'PA', 'PUBH', 'PPOL', 'PPA', 'RES', 'RELS', 'RUSS', 'SLAV', 'SJ', 'SOC', 'SPAN', 'SPED', 'STAT', 'SABR', 'THTR', 
                 'UPA', 'UPP', 'US'];
          
             // Get the datalist element
             const datalist = document.getElementById('subject-list');
          
             // Loop through the options array
             for (const option of subjectOptions) {
                // Create a new option element
                const opt = document.createElement('option');
                // Set the value and text of the option
                opt.value = option;
                opt.text = option;
                // Append the option to the datalist
                datalist.appendChild(opt);
             }
const clientId = "UMPIoFc8iQoJ2eKS6GsJbCGSmMb4s1PY";
const clientSecret = "3VP1GrzLLvOUoEzu";

const hub_id = "b.24d2d632-e01b-4ca0-b988-385be827cb04"
const account_id = "24d2d632-e01b-4ca0-b988-385be827cb04"

let outputLog =[]
let userUploadArray =[]
let projectID
let projectData
let userID
let totalUsers
let completedAddedUsers

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('submitButton').addEventListener('click', async function(event) {
        event.preventDefault(); // Prevent the default form submission behavior
                const progressBarMain = document.querySelector('.progress-bar-Main');
        totalUsers = userUploadArray.length
        for (var i = 0;i < userUploadArray.length; i++){
            await addNewUser(clientId, clientSecret,userUploadArray[i].email,userUploadArray[i].roles,totalUsers);
            displayMessages();
        }
        const progressBarContainer = document.querySelector('.progress-bar__container');
        const progressBar = document.querySelector('.progress-bar-Main');
        const progressBarText = document.querySelector('.progress-bar-Main__text');
        progress = 100

        if(progress == 100){
            gsap.to(progressBar, {
              x: `${progress}%`,
              duration: 0.5,
              backgroundColor: '#4895ef',
              onComplete: () => {
                progressBarText.style.display = "initial";
                progressBarContainer.style.boxShadow = '0 0 5px #4895ef';
                alert("Batch Permissions Applied");
              }
            })};


    });
});


async function addNewUser(clientId, clientSecret,userEmail,roles,totalUsers_local){
    const progressBarMain = document.querySelector('.progress-bar-Main');
        try {
            access_token_create = await generateTokenAccountCreate(clientId, clientSecret);
        } catch {
            console.log("Error: Getting Create Access Token");
        }
        try {
            access_token_read = await generateTokenAccountRead(clientId, clientSecret);
        } catch {
            console.log("Error: Getting Create Access Token");
        }

        createUserReturn = await postUserToAccount(access_token_create,userEmail)
        //console.log(createUserReturn)
        if(createUserReturn.code === 1002){
            searchReturn = await searchUserInAccount(access_token_read,userEmail)
            //console.log(searchReturn[0])
            console.log("User already exists on account",userEmail)
            outputLog.push("User already exists on account: "+userEmail)
            userID = searchReturn[0].id
        }else {
            console.log("User Created",userEmail)
            outputLog.push("User Created: "+userEmail)
            userID = createUserReturn.id
        }
        console.log("User ID: ",userID )
        addedUserToProjectReturn = await postUserToProject(access_token_create,userEmail,roles)
        if(addedUserToProjectReturn.status === 409){
            console.log(userEmail+" is already a member of the project")
            outputLog.push(userEmail + " is already a member of the project");
        }else if(createUserReturn.code === 1002){
            console.log(userEmail+" has been added to project, and has been sent a email invite")
            outputLog.push(userEmail + " has been added to project, and has been sent a email invite");
        }else{
            console.log(userEmail+" has been added to project, and has been sent a email invite to create an account")
            outputLog.push(userEmail + " has been added to project, and has been sent a email invite to create an account");
        }
        completedAddedUsers++;
        progress = (completedAddedUsers / totalUsers_local) * 100;
        console.log(progress)
        gsap.to(progressBarMain, {
            x: `${progress}%`,
            duration: 0.5,
          });

    }

async function generateTokenAccountCreate(clientId,clientSecret){
    const bodyData = {
    client_id: clientId,
    client_secret: clientSecret,
    grant_type:'client_credentials',
    scope:'account:write'
    };

    var formBody = [];
    for (var property in bodyData) {
        var encodedKey = encodeURIComponent(property);
        var encodedValue = encodeURIComponent(bodyData[property]);
        formBody.push(encodedKey + "=" + encodedValue);
    };
    formBody = formBody.join("&")

    const headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
    };

    const requestOptions = {
        method: 'POST',
        headers: headers,
        body: formBody,
    };
    const apiUrl = 'https://developer.api.autodesk.com/authentication/v1/authenticate';
    //console.log(requestOptions)
    AccessToken_Local = await fetch(apiUrl,requestOptions)
        .then(response => response.json())
        .then(data => {
        //console.log(data)
        console.log(data.access_token)
        return data.access_token
        })
        .catch(error => console.error('Error fetching data:', error));
        return AccessToken_Local
    }

async function generateTokenAccountRead(clientId,clientSecret){
    const bodyData = {
    client_id: clientId,
    client_secret: clientSecret,
    grant_type:'client_credentials',
    scope:'account:read'
    };

    var formBody = [];
    for (var property in bodyData) {
        var encodedKey = encodeURIComponent(property);
        var encodedValue = encodeURIComponent(bodyData[property]);
        formBody.push(encodedKey + "=" + encodedValue);
    };
    formBody = formBody.join("&")

    const headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
    };

    const requestOptions = {
        method: 'POST',
        headers: headers,
        body: formBody,
    };
    const apiUrl = 'https://developer.api.autodesk.com/authentication/v1/authenticate';
    //console.log(requestOptions)
    AccessToken_Local = await fetch(apiUrl,requestOptions)
        .then(response => response.json())
        .then(data => {
        //console.log(data)
        console.log(data.access_token)
        return data.access_token
        })
        .catch(error => console.error('Error fetching data:', error));
        return AccessToken_Local
    }

async function generateTokenDataRead(clientId,clientSecret){
    const bodyData = {
    client_id: clientId,
    client_secret: clientSecret,
    grant_type:'client_credentials',
    scope:'data:read'
    };

    var formBody = [];
    for (var property in bodyData) {
        var encodedKey = encodeURIComponent(property);
        var encodedValue = encodeURIComponent(bodyData[property]);
        formBody.push(encodedKey + "=" + encodedValue);
    };
    formBody = formBody.join("&")

    const headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
    };

    const requestOptions = {
        method: 'POST',
        headers: headers,
        body: formBody,
    };
    const apiUrl = 'https://developer.api.autodesk.com/authentication/v1/authenticate';
    //console.log(requestOptions)
    AccessToken_Local = await fetch(apiUrl,requestOptions)
        .then(response => response.json())
        .then(data => {
        //console.log(data)
        console.log(data.access_token)
        return data.access_token
        })
        .catch(error => console.error('Error fetching data:', error));
        return AccessToken_Local
    }

async function postUserToAccount(AccessToken,userEmail,firstName,lastName,usersCompany){

    const bodyData = {
        email: userEmail,
        first_name: firstName,
        last_name: lastName,
        company: usersCompany
        };

    const headers = {
        'Authorization':"Bearer "+AccessToken,
        'Content-Type':'application/json'
    };

    const requestOptions = {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(bodyData)
    };

    const apiUrl = "https://developer.api.autodesk.com/hq/v1/regions/eu/accounts/"+account_id+"/users";
    //console.log(apiUrl)
    console.log(requestOptions)
    signedURLData = await fetch(apiUrl,requestOptions)
        .then(response => response.json())
        .then(data => {
            const JSONdata = data

        //console.log(JSONdata)

        return JSONdata
        })
        .catch(error => console.error('Error fetching data:', error));


    return signedURLData
    }

async function searchUserInAccount(AccessToken,userEmail){
    //Email = userEmail.replace(/@/g, "2%40");
        const bodyData = {

            };

        const headers = {
            'Authorization':"Bearer "+AccessToken,
            'Content-Type':'application/json'
        };

        const requestOptions = {
            method: 'GET',
            headers: headers,
            //body: JSON.stringify(bodyData)
        };

        const apiUrl = "https://developer.api.autodesk.com/hq/v1/regions/eu/accounts/"+account_id+"/users/search?email="+userEmail;
        //console.log(apiUrl)
        //console.log(requestOptions)
        signedURLData = await fetch(apiUrl,requestOptions)
            .then(response => response.json())
            .then(data => {
                const JSONdata = data

            //console.log(JSONdata)

            return JSONdata
            })
            .catch(error => console.error('Error fetching data:', error));

        return signedURLData
    }

async function postUserToProject(AccessToken,userEmail,userID,roles){

    const bodyData = {
        email: userEmail,
        roleIds: roles,
        products: [
            {
                "key": "build",
                "access": "member"
            },
            {
                "key": "docs",
                "access": "member"
            }],
        };

    const headers = {
        'Authorization':"Bearer "+AccessToken,
        'Content-Type':'application/json',
        'User-ID': "116300ed-53f9-48ad-a525-ae928297620e"
    };

    const requestOptions = {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(bodyData)
    };

    const apiUrl = "https://developer.api.autodesk.com/construction/admin/v1/projects/"+projectID+"/users";
    //console.log(apiUrl)
    //console.log(requestOptions)
    signedURLData = await fetch(apiUrl,requestOptions)
        .then(response => response.json())
        .then(data => {
            const JSONdata = data
        //console.log(JSONdata)
        return JSONdata
        })
        .catch(error => console.error('Error fetching data:', error));


    return signedURLData
    }

    // Utility function to introduce a delay
function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

async function getProjectDetails(AccessToken,project_id){

        const headers = {
            'Authorization':"Bearer "+AccessToken,
        };

        const requestOptions = {
            method: 'GET',
            headers: headers,
        };

        const apiUrl = "https://developer.api.autodesk.com/project/v1/hubs/"+hub_id+"/projects/b."+project_id;
        console.log(apiUrl)
        console.log(requestOptions)
        projectData = await fetch(apiUrl,requestOptions)
            .then(response => response.json())
            .then(data => {
                const JSONdata = data
            console.log(JSONdata)
            //console.log(JSONdata.uploadKey)
            //console.log(JSONdata.urls)
            return JSONdata
            })
            .catch(error => console.error('Error fetching data:', error));

        return projectData
    }

async function getFolderDetails(AccessToken,project_id,folder_id){

        const headers = {
            'Authorization':"Bearer "+AccessToken,
        };

        const requestOptions = {
            method: 'GET',
            headers: headers,
        };

        const apiUrl = "https://developer.api.autodesk.com/data/v1/projects/b."+project_id+"/folders/"+folder_id;
        //console.log(apiUrl)
        //console.log(requestOptions)
        signedURLData = await fetch(apiUrl,requestOptions)
            .then(response => response.json())
            .then(data => {
                const JSONdata = data
            //console.log(JSONdata)
            //console.log(JSONdata.uploadKey)
            //console.log(JSONdata.urls)
            return JSONdata
            })
            .catch(error => console.error('Error fetching data:', error));
            getRate++
            console.log(getRate)
        return signedURLData
    }

// Function to create HTML structure for folder permissions
function createPermissionsHTML(data,permissions) {
    const container = document.getElementById('permissions-container');
    if (!container) {
        console.error('Container element not found.');
        return;
    }
    
    data.forEach(folder => {
        const folderDiv = document.createElement('div');
        folderDiv.classList.add('folder');

        const folderNameDiv = document.createElement('div');
        folderNameDiv.classList.add('folder-name');
        folderNameDiv.textContent = folder.folderName;
        folderDiv.appendChild(folderNameDiv);

        const permissionsTable = document.createElement('table');
        permissionsTable.classList.add('permissions-table');

        // Create table header
        const headerRow = permissionsTable.insertRow();
        const th1 = document.createElement('th');
        th1.textContent = 'Permission Name';
        const th2 = document.createElement('th');
        th2.textContent = 'Actions';
        headerRow.appendChild(th1);
        headerRow.appendChild(th2);

        folder.folderPermissions.forEach(permission => {
            const permissionRow = permissionsTable.insertRow();
            const cell1 = permissionRow.insertCell();
            cell1.textContent = permission.name;
            const cell2 = permissionRow.insertCell();
            const perm = permissions.find(perm => perm.level === permission.actions);
            if (perm) {
                cell2.textContent = perm.actions.join(', ');
            } else {
                cell2.textContent = 'Unknown Permission Level';
            }
        });

        folderDiv.appendChild(permissionsTable);
        container.appendChild(folderDiv);

        // Toggle visibility of permissions table on click
        folderNameDiv.addEventListener('click', function() {
            permissionsTable.style.display = permissionsTable.style.display === 'none' ? 'table' : 'none';
        });
    });
    }

    // Load the CSV file
function handleDragOver(event) {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'copy';
    }
    function handleDrop(event) {
    event.preventDefault();
    var file = event.dataTransfer.files[0];
    handleFile(file);
    }

    function handleDragEnter(event) {
    event.preventDefault();
    document.getElementById('drop-area').classList.add('hover');
    }

    function handleDragLeave(event) {
    event.preventDefault();
    document.getElementById('drop-area').classList.remove('hover');
    }

    function handleFileSelect(event) {
    var file = event.target.files[0];
    handleFile(file);
    }

    function handleFile(file) {
    if (file.type !== 'text/csv') {
        alert('Please drop a CSV file.');
        return;
    }

    var reader = new FileReader();
    reader.onload = function(event) {
        var csvData = event.target.result;
        processData(csvData);
    };
    reader.readAsText(file);

    // Display file name
    document.getElementById('file-info').innerHTML = `<p>File: ${file.name}</p>`;
    // Add 'uploaded' class to indicate file upload
    document.getElementById('drop-area').classList.add('uploaded');
    }

    function processData(csvData) {
    var lines = csvData.split('\n');
    var headers = lines[0].split(',').map(header => header.trim());
    var data = [];

    // Skip the first line (header row) and iterate over remaining lines
    for (var i = 1; i < lines.length; i++) {
        // Ensure line is not empty
        if (lines[i].trim() === '') {
        continue; // Skip empty lines
        }

        var values = lines[i].split(',');

        // Ensure the number of values matches the number of headers
        if (values.length !== headers.length) {
        console.error('Error parsing line ' + (i + 1) + ': Number of values does not match number of headers.');
        continue; // Skip this line
        }

        var row = {};
        for (var j = 0; j < headers.length; j++) {
        row[headers[j]] = values[j].trim();
        }
        data.push(row);
    }
    // Update file info with the array length
    document.getElementById('file-info').innerHTML += `<p>Number of users to add: ${data.length}</p>`;
    userUploadArray = data

    console.log(data);
    }

    async function extractIds(urlInputValue) {
        try {
            const url = new URL(urlInputValue);
            const projectId = url.pathname.split('/')[4];
            const accesstoken = await generateTokenDataRead(clientId, clientSecret)
            const projectName = await getProjectDetails(accesstoken,projectId)

            // Update extracted IDs in the HTML
            document.getElementById('project-id').textContent = projectId;
            document.getElementById('project-name').textContent = projectName.data.attributes.name;
            projectID = projectId

            // Show extracted IDs
            document.getElementById('extracted-ids').style.display = 'block';

        } catch (error) {
            console.error('Invalid URL:', error.message);
            // Reset extracted IDs if URL is invalid
            document.getElementById('project-id').textContent = '';
            document.getElementById('project-name').textContent = '';

            // Hide extracted IDs
            document.getElementById('extracted-ids').style.display = 'none';
        }
    }

    // Add event listener to input field for pasting URL
    document.addEventListener('DOMContentLoaded', function() {
    const urlInput = document.getElementById('start-folder-url');
    urlInput.addEventListener('paste', (event) => {
        const pastedText = (event.clipboardData || window.clipboardData).getData('text');
        extractIds(pastedText);
    });
    })

function displayMessages() {
    // Get the container element
    var outputLogContainer = document.getElementById('outputLog-list');

    // Clear previous content
    outputLogContainer.innerHTML = '';

    // Loop through the messages array and create list items
    outputLog.forEach(function(outputLog) {
        var listItem = document.createElement('li');
        listItem.textContent = outputLog;
        outputLogContainer.appendChild(listItem);
    });
}
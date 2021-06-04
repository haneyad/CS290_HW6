
function postData(){
    var xhr = new XMLHttpRequest();
    
    // Target correct form
    var form = document.getElementById("addEntryForm");

    // create new formData object and seed it with target HTML form
    var fd = new FormData(form);

    // Once response has finished, callback 
    xhr.onload = function (){
        displayData();
    };

    // On error callback
    xhr.onerror = function(){
        console.log("XMLHttpRequest Post: ERROR");
    };

    // parameterize request
    xhr.open("POST", "http://localhost:4502/", true);

    // send request
    xhr.send(fd);
}

function displayData(){
    let xhr = new XMLHttpRequest();
    let url= '/select';
    xhr.timeout = 5000;
    xhr.responseType = 'json';

    // Call back to be executed once SELECT GET request returns
    xhr.onload = function() {
        if (xhr.status != 200) {
            console.log(xhr.statusText);
        } else {
            console.log(xhr.status);
            console.log("XHR RESPONSE: ", xhr.reponse);
            console.log("XHR Status ", xhr.readyState)

            console.log("Response type: ", xhr.responseType);
            console.log("Response object: ", xhr.response);
            
            let lastEntry = xhr.response[0];

            // Iterate over key/value pairs of last workout object in response
            let addedData = [];
            for (let key in lastEntry) {
                let value = lastEntry[key];
                addedData.push(value);
            }
            
            // Properly format returned string to Date
            let date = new Date(addedData[4]);
            addedData[4] = date;
            console.log(addedData);

            // Create a new row and append to tableBody
            let tableObject = document.getElementById('tableBody');
            let insertRow = document.createElement('tr');
            tableObject.appendChild(insertRow);
            
            // Get last row after insert of a new "empty" row
            let allRows = tableObject.getElementsByTagName('tr');
            let lastRow = allRows[allRows.length - 1];

            // Interate over elements in the data added by POST to
            // create cells with values 
            for (let i=1; i<addedData.length; i++){
                tempTd = document.createElement('td');
                tempTd.innerHTML = addedData[i];
                lastRow.appendChild(tempTd);
            }
            
            // Add edit and delete buttons for the new row
            tableObject = document.getElementById('tableBody');
            var rows = tableObject.getElementsByTagName('tr');
            
            for (let i = rows.length-1; i < rows.length; i++) {
                var btn = document.createElement("td");
                var tempStr = "<input type='button' class='edit' value='edit' id=" + 'btnEdit' + (i+1) + ' />'; 
                btn.innerHTML = tempStr;
                rows[i].appendChild(btn);
            
                var btn1 = document.createElement("td");
                tempStr = "<input type='button' class='delete' value='delete' id=" + 'btnDelete' + (i+1) + ' />';
                btn1.innerHTML = tempStr;
                rows[i].appendChild(btn1);
        };
    };
}

    // Parameterize GET request
    xhr.open('GET', url, true);

    // Send GET request
    xhr.send();

    // Callback on timeout
    xhr.ontimeout = function(){
        console.log("XMLHttpRequest Timeout");
    }

    // Callback on error
    xhr.onerror = function() {
        console.log("ONERROR: XMLHttpReset error")
    };
}

function deleteData() {
    // this keyword exposes object associated with eventListener

    console.log("delete button clicked ", this.id);
}

function editData() {
    // this keyword exposes object associated with eventListener
    console.log("edit button clicked", this.id);
}



// Call postData() when "Add" HTML button pressed
document.getElementById("submit").addEventListener("click", postData);

// Get collections of the buttons and place event listeners on them
deleteBtnsCollect = document.getElementsByClassName("delete");

for (let i=0; i < deleteBtnsCollect.length; i++) {
    deleteBtnsCollect[i].addEventListener("click", deleteData);
};

editBtnsCollect = document.getElementsByClassName("edit");

for (let i=0; i < editBtnsCollect.length; i++) {
    editBtnsCollect[i].addEventListener("click", editData);
}

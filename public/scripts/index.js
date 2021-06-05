
function postData(){
    var xhr = new XMLHttpRequest();
    xhr.timeout = 2000;
    // Target correct form
    var form = document.getElementById("addEntryForm");

    // create new formData object and seed it with target HTML form
    var fd = new FormData(form);

    // Once response has finished, callback 
    xhr.onload = function (){
        displayDataOnAdd();
    };

    // On error callback
    xhr.onerror = function(){
        console.log("XMLHttpRequest Post: ERROR");
    };

    // parameterize request
    xhr.open("POST", "/", true);

    // send request
    xhr.send(fd);

    // on timeout
    xhr.ontimeout = function() {
        alert("POST ADD DATA TIMED OUT");
    }
}


function displayDataOnAdd(){
    let xhr = new XMLHttpRequest();
    let url= '/selectOnAdd';
    xhr.timeout = 5000;
    xhr.responseType = 'json';

    // Call back to be executed once SELECT GET request returns
    xhr.onload = function() {
        if (xhr.status != 200) {
            console.log(xhr.statusText);
        } else {
            
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

            // Create a new row and append to tableBody 
            let tableObject = document.getElementById('tableBody');
            let insertRow = document.createElement('tr');
            tableObject.appendChild(insertRow);
            
            // Get last row after insert of a new "empty" row
            let allRows = tableObject.getElementsByTagName('tr');
            let lastRow = allRows[allRows.length - 1];

            // Give unique ID to NEW last row
            lastRow.id = 'row_' + addedData[0];

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
                var tempStr = "<input type='button' class='edit' value='edit' id=" + 'btnEdit_' + addedData[0] + ' />'; 
                btn.innerHTML = tempStr;
                rows[i].appendChild(btn);

                //Add edit event listener to new button
                document.getElementById('btnEdit_'+ addedData[0]).addEventListener("click", selectEditData);
            
                var btn1 = document.createElement("td");
                tempStr = "<input type='button' class='delete' value='delete' id=" + 'btnDelete_' + addedData[0] + ' />';
                btn1.innerHTML = tempStr;
                rows[i].appendChild(btn1);

                // Add delete event listener to new button
                document.getElementById('btnDelete_' + addedData[0]).addEventListener("click", deleteData);
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
    let xhr = new XMLHttpRequest();
    let url= '/delete';
    xhr.timeout = 5000;

    xhr.onload = function(){
        let deletedRow = document.getElementById('row_' + idNum);
        deletedRow.remove();
    }

    // Parameterize DELETE request
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

    // Delete Btn unique key to delete from table
    // THIS COULD COME FROM CODE AT BOTTOM THAT ADDS EVENT LISTENERS ON S/U
    // OR COULD COME AFTER ADDING ROW
    let idStr =  this.id;
    let strArr = idStr.split('_');
    
    let idNum = Number(strArr[1]);
    // Send DELETE request
    xhr.send('id='+ idNum);

    // Callback on timeout
    xhr.ontimeout = function(){
        console.log("XMLHttpRequest DELETE Timeout");
    }

    // Callback on error
    xhr.onerror = function() {
        console.log("DELETE: XMLHttpRequest error");
    }
}


function selectEditData() {
    // Get unique ID from edit button that was clicked
    let idStr =  this.id;
    let strArr = idStr.split('_');
    let idNum = Number(strArr[1]);

    // create unique key signature
    let rowId = "row_" + idNum;

    let rowEle = document.getElementById(rowId);

    let editTableBody = document.getElementById('editTableBody');
    
    //append new row element to edit table body with unique ID
    let newRow = document.createElement("tr");
    newRow.id = "editRow";
    editTableBody.appendChild(newRow);

    // target the new row just added; we need to insert five input fields
    newRow = document.getElementById("editRow");
    for (let i=0; i <5; i++) {
        let td = document.createElement("td");
        let tempStr = "<input type='text' name=" + i + "id=" + i + 'value=' + "required />";
        td.innerHTML = tempStr;
        newRow.appendChild(td);
    }
    
    // create save button and append to row
    let btnEditSave = document.createElement("td");
    tempStr = "<input type='button' class='editSave' value='Save' id=" + 'btnEditSave/>';
    btnEditSave.innerHTML = tempStr;
    newRow.appendChild(btnEditSave);

    let editDataObj = queryEditData(idNum);
    console.log(editDataObj);
   


}

function queryEditData(id) {
    let xhr = new XMLHttpRequest();
    let url= '/edit';
    xhr.timeout = 5000;

    xhr.onload = function (){
        return xhr.response;

    }

    // Parameterize GET request
    xhr.open('POST', url, true);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    
    // Send GET request
    xhr.send("id="+id);

    // Callback on timeout
    xhr.ontimeout = function(){
        console.log("XMLHttpRequest Timeout");
    }

    // Callback on error
    xhr.onerror = function() {
        console.log("ONERROR: XMLHttpReset error")
    };
}


// Call postData() when "Add" HTML button pressed
document.getElementById("submit").addEventListener("click", postData);

// ON NEW PAGE RENDER ONLY
// Futher event listeners are handled in ADD and DELETE functions
// Get collections of the buttons and place event listeners on them
deleteBtnsCollect = document.getElementsByClassName("delete");

for (let i=0; i < deleteBtnsCollect.length; i++) {
    deleteBtnsCollect[i].addEventListener("click", deleteData);
};

editBtnsCollect = document.getElementsByClassName("edit");

for (let i=0; i < editBtnsCollect.length; i++) {
    let cell = editBtnsCollect[i].addEventListener("click", selectEditData);
}

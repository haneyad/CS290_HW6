function displayData(){
    let xhr = new XMLHttpRequest();
    let url= '/select';
    
    xhr.timeout = 2000;
    xhr.responseType = 'json';
    xhr.onload = function() {
        if (xhr.status != 200) {
            console.log(xhr.statusText);
        } else {
            console.log(xhr.status);
            console.log("XHR RESPONSE: ", xhr.reponse);
            console.log("XHR Status ", xhr.readyState)

            let tableObject = document.getElementById('tableBody');
            let insertRow = document.createElement('tr');
            tableObject.appendChild(insertRow);

            let lastRow = tableObject.getElementsByTagName('tr');
            for (let i=0; i<5; i++){
            tempTd = document.createElement('td');
            tempTd.innerHTML = xhr.response[i];
            lastRow[lastRow.length - 1].appendChild(tempTd);
            }
        }
    }
xhr.open('GET', url, true);
xhr.send();
xhr.timeout = console.log("XMLHttpRequest Timeout");

    xhr.onerror = function() {
        console.log("ONERROR: XMLHttpReset error")
    };
}



var tableObject = document.getElementById('tableBody');
var rows = tableObject.getElementsByTagName('tr');

for (let i = 0; i < rows.length; i++) {
    var btn = document.createElement("td");
    var tempStr = "<input type='button' value='edit' id=" + 'editBtn' + (i+1) + ' />'; 
    btn.innerHTML = tempStr;
    rows[i].appendChild(btn);

    var btn1 = document.createElement("td");
    tempStr = "<input type='button' value='delete' id=" + 'deleteBtn' + (i+1) + ' />';
    btn1.innerHTML = tempStr;
    rows[i].appendChild(btn1);
}

document.getElementById("submit").addEventListener("click", displayData);
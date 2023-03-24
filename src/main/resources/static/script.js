var tableDiv;
var DBresponse;
var adminTable;
var userTable;


function init(DBresponseTemp, user) {
DBresponse = DBresponseTemp;
tableDiv = document.getElementById("tableDiv");

if(user == 'user' ) {
    generateBlankUserTable();
}else {
    generateBlankAdminTable();
}


    document.getElementById("saveToDbButton").addEventListener("click", function(){
        updateDB();
    });

/*
    document.getElementById("categorySelect").addEventListener("change", function(e){
        fillTableFromCategory(e.target.value);
    }); */



}

function generateBlankAdminTable() {
    adminTable = document.createElement('table');
    adminTable.id = 'adminTable';
    tableDiv.appendChild(adminTable);

    var row = adminTable.insertRow(0);
    for(var i = 0; i < 15; i++) {
        var th = document.createElement('th');
        row.appendChild(th);
    }

    for(var i = 0; i < 15; i++) {
         var row = adminTable.insertRow(adminTable.length);
         var hiddenID = document.createElement('td');
         hiddenID.classList.add('hiddenID');
         row.appendChild(hiddenID);


          for(var j = 0; j < 15; j++) {
                 var cell = row.insertCell(j);
                 cell.contentEditable = true;

                 cell.addEventListener("blur", function(e){
                     updateDB();
                 });
             }

    }

adminTable.rows[0].getElementsByTagName("th")[0].innerHTML = "Namn";
adminTable.rows[0].getElementsByTagName("th")[1].innerHTML = "Artist";
adminTable.rows[0].getElementsByTagName("th")[2].innerHTML = "Kategori";
adminTable.rows[0].getElementsByTagName("th")[3].innerHTML = "År";

for(let i = 0; i < 4; i++) {
adminTable.rows[0].getElementsByTagName("th")[i].addEventListener("click", function(){
            sortTable(i, adminTable);
        });
}

fillTable(DBresponse, adminTable);

}
function generateBlankUserTable() {
    userTable = document.createElement('table');
    userTable.id = 'userTable';
    tableDiv.appendChild(userTable);

    var row = userTable.insertRow(0);
    for(var i = 0; i < 15; i++) {
        var th = document.createElement('th');
        row.appendChild(th);
    }

    for(var i = 0; i < 15; i++) {
         var row = userTable.insertRow(userTable.length);
         var hiddenID = document.createElement('td');
         hiddenID.classList.add('hiddenID');
         row.appendChild(hiddenID);


          for(var j = 0; j < 15; j++) {

                 var cell = row.insertCell(j);

                 cell.addEventListener("blur", function(e){

                     });

                 if(j == 4) {
                    cell.contentEditable = true;
                 }
             }

    }

userTable.rows[0].getElementsByTagName("th")[0].innerHTML = "Namn";
userTable.rows[0].getElementsByTagName("th")[1].innerHTML = "Artist";
userTable.rows[0].getElementsByTagName("th")[2].innerHTML = "Kategori";
userTable.rows[0].getElementsByTagName("th")[3].innerHTML = "År";
userTable.rows[0].getElementsByTagName("th")[4].innerHTML = "Poäng";

for(let i = 0; i < 5; i++) {
userTable.rows[0].getElementsByTagName("th")[i].addEventListener("click", function(){
            sortTable(i, userTable);
        });
}

fillTable(DBresponse, userTable);

}

function fillTable(tableData, targetTable) {
    clearTable(targetTable);

        for(var row = 1; row < tableData.length; row++) {


                targetTable.rows[row].getElementsByTagName("td")[0].innerHTML = tableData[row].name;

                targetTable.rows[row].getElementsByTagName("td")[1].innerHTML = tableData[row].artist;

                targetTable.rows[row].getElementsByTagName("td")[2].innerHTML = tableData[row].category;

                targetTable.rows[row].getElementsByTagName("td")[3].innerHTML = tableData[row].year;

                targetTable.rows[row].getElementsByClassName("hiddenID")[0].innerHTML = tableData[row].songID;
        }
}
function fillTableFromCategory(value){
          var xhttp;

          xhttp = new XMLHttpRequest();

          xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
            var jsonResponse = JSON.parse(xhttp.responseText);

              fillTable(jsonResponse, adminTable);
            }
          };
          xhttp.open("POST", "selectFromCategory", true);
          xhttp.send(value);
}

function updateDB() {

    var rows = adminTable.rows;
    let httpText = "";
    for(var i = 1; i < getAmountOfNonEmptyRows(adminTable, 0); i++) {


        var name = sanitizeUserInput(rows[i].getElementsByTagName("td")[0].innerHTML);
        var artist = sanitizeUserInput(rows[i].getElementsByTagName("td")[1].innerHTML);
        var category = sanitizeUserInput(rows[i].getElementsByTagName("td")[2].innerHTML);
        var year = sanitizeUserInput(rows[i].getElementsByTagName("td")[3].innerHTML);
        var songID = sanitizeUserInput(rows[i].getElementsByClassName("hiddenID")[0].innerHTML);

        httpText += '{"name": "' + name +  '", "artist": "' + artist +  '", "category": "' + category +  '", "year": "' + year +  '", "songID": "' + songID +  '"}, ';
    }

      var xhttp;

      xhttp = new XMLHttpRequest();

      xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
         var jsonResponse = JSON.parse(xhttp.responseText);
        fillTable(jsonResponse,adminTable)

        }
      };
      xhttp.open("POST", "updateDB", true);
      xhttp.send(httpText);
}

function attemptLogin() {
          var xhttp;
          let data = "";
          data += document.getElementById("usernameInput").value;
          data += "§";
          data += document.getElementById("passwordInput").value;

          xhttp = new XMLHttpRequest();

          xhttp.onreadystatechange = function() {
          if (this.readyState == 4 && this.status == 200) {
            if (xhttp.responseText === "true") {
             window.location.replace(
               "/user"
             );
            }else if(xhttp.responseText === "false") {
             alert("login failed");
            }
            }
          };
          xhttp.open("POST", "login", true);
          xhttp.send(data);
}

//stops the program from breaking when { or } is input
function sanitizeUserInput(input) {

    return input.replace('{', '§').replace('}', '§');
}

//sort an html table either alphabetically or numerically. n = index of clicked element. (stole this from the internet)
function sortTable(n,targetTable ) {
    var rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
    switching = true;
    // Set the sorting direction to ascending:
    dir = "asc";
    /* Make a loop that will continue until
    no switching has been done: */

    //only want to sort non empty rows
    var nonEmptyRows = getAmountOfNonEmptyRows(targetTable, n);

    while (switching) {
      // Start by saying: no switching is done:
      switching = false;
      rows = targetTable.rows;
      /* Loop through all table rows (except the
      first, which contains table headers): */


      for (i = 1; i < nonEmptyRows-1; i++) {
        // Start by saying there should be no switching:
        shouldSwitch = false;
        /* Get the two elements you want to compare,
        one from current row and one from the next: */
        x = rows[i].getElementsByTagName("TD")[n];
        y = rows[i + 1].getElementsByTagName("TD")[n];
        /* Check if the two rows should switch place,
        based on the direction, asc or desc: */
        if (dir == "asc") {
          if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
            // If so, mark as a switch and break the loop:
            shouldSwitch = true;
            break;
          }
        } else if (dir == "desc") {
          if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
            // If so, mark as a switch and break the loop:
            shouldSwitch = true;
            break;
          }
        }
      }
      if (shouldSwitch) {
        /* If a switch has been marked, make the switch
        and mark that a switch has been done: */
        rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
        switching = true;
        // Each time a switch is done, increase this count by 1:
        switchcount ++;
      } else {
        /* If no switching has been done AND the direction is "asc",
        set the direction to "desc" and run the while loop again. */
        if (switchcount == 0 && dir == "asc") {
          dir = "desc";
          switching = true;
        }
      }
    }
  }

function clearTable(targetTable) {

        for(var row = 1; row < targetTable.rows.length; row++) {
                targetTable.rows[row].getElementsByTagName("td")[0].innerHTML = "";

                targetTable.rows[row].getElementsByTagName("td")[1].innerHTML = "";

                targetTable.rows[row].getElementsByTagName("td")[2].innerHTML = "";

                targetTable.rows[row].getElementsByTagName("td")[3].innerHTML = "";

                targetTable.rows[row].getElementsByClassName("hiddenID")[0].innerHTML = "";
        }
}

function getAmountOfNonEmptyRows(table_, n){
    var rows = table_.rows;
    for (i = 1; i < (rows.length - 1); i++) {
        if(rows[i].getElementsByTagName("td")[0].innerHTML.trim() == "" &&
            rows[i].getElementsByTagName("td")[1].innerHTML.trim() == "" &&
            rows[i].getElementsByTagName("td")[2].innerHTML.trim() == "" &&
            rows[i].getElementsByTagName("td")[3].innerHTML.trim() == "" &&
            rows[i].getElementsByClassName("hiddenID")[0].innerHTML.trim() == ""){
            return i;
        }
    }
}

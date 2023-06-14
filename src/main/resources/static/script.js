var tableDiv;
var DBresponse;
var adminTable;
var userTable;
var isAdmin;


function init(DBresponseTemp, user) { //fix this pls
DBresponse = DBresponseTemp;
tableDiv = document.getElementById("tableDiv");

if(user == 'user' ) {
isAdmin = false;
    generateBlankUserTable();
     document.getElementById("confirmVotesBtn").addEventListener("click", function(){
                confirmVotes();
            });
}else {
isAdmin = true;
    generateBlankAdminTable();


}
 document.getElementById("yearSelect").addEventListener("change", function(e){
            fillTableFromYear(e.target.value);
        });


}


function generateBlankAdminTable() {
    adminTable = document.createElement('table');
    adminTable.id = 'adminTable';
    tableDiv.appendChild(adminTable);

    var row = adminTable.insertRow(0);
    for(var i = 0; i < 3; i++) {
        var th = document.createElement('th');
        row.appendChild(th);
    }

    for(var i = 0; i < 15; i++) {
         var row = adminTable.insertRow(adminTable.length);
         var hiddenID = document.createElement('td');
         hiddenID.classList.add('hiddenID');
         row.appendChild(hiddenID);


          for(var j = 0; j < 3; j++) {
                 var cell = row.insertCell(j);
                 cell.contentEditable = true;

               /*  cell.addEventListener("blur", function(e){
                     updateDB();
                 }); */
          }
          var updateBtn = document.createElement('button');
          updateBtn.innerHTML = '<img src="update.png"  width="100" height="50"> '
            updateBtn.addEventListener("click", function(e){
                               updateDB();
                               console.log("updated");
                           });
        //  updateCell.src = "update.png";
         // updateCell.id = "updateImg";
          row.appendChild(updateBtn);

    }

    adminTable.rows[0].getElementsByTagName("th")[0].innerHTML = "Låt";
    adminTable.rows[0].getElementsByTagName("th")[1].innerHTML = "Artist";
    adminTable.rows[0].getElementsByTagName("th")[2].innerHTML = "Kategori";

    for(let i = 0; i < 3; i++) {
        adminTable.rows[0].getElementsByTagName("th")[i].addEventListener("click", function(){
            sortTable(i, adminTable);
        });
    }

    fillTableFromYear(document.getElementById("yearSelect").value);

}
function generateBlankUserTable() {
    userTable = document.createElement('table');
    userTable.id = 'userTable';
    tableDiv.appendChild(userTable);

    var row = userTable.insertRow(0);
    for(var i = 0; i < 10; i++) {
        var th = document.createElement('th');
        row.appendChild(th);
    }

    for(var i = 0; i < 30; i++) {
         var row = userTable.insertRow(userTable.length);
         var hiddenID = document.createElement('td');
         hiddenID.classList.add('hiddenID');
         row.appendChild(hiddenID);


          for(var j = 0; j < 10; j++) {

                 var cell = row.insertCell(j);

                 cell.addEventListener("blur", function(e){

                     });

                 if(j == 3) {
                    cell.contentEditable = true;
                 }
             }

    }

    userTable.rows[0].getElementsByTagName("th")[0].innerHTML = "Låt";
    userTable.rows[0].getElementsByTagName("th")[1].innerHTML = "Artist";
    userTable.rows[0].getElementsByTagName("th")[2].innerHTML = "Kategori";
    userTable.rows[0].getElementsByTagName("th")[3].innerHTML = "Poäng";

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

                targetTable.rows[row].getElementsByClassName("hiddenID")[0].innerHTML = tableData[row].songID;

        }
}


function initVotePage() {

 document.getElementById("yearSelect").addEventListener("change", function(e){
                getVoteList(document.getElementById("userSelect").value, e.target.value);
            });
 document.getElementById("userSelect").addEventListener("change", function(e){
                 getVoteList(e.target.value, document.getElementById("yearSelect").value);
             });

 getVoteList("userID", "year");


}


function fillVoteTable(data) {
var tableDiv = document.getElementById("tableDiv");
   tableDiv.innerHTML = "";
     var table = document.createElement('table');
     table.id = 'mediaTable';
     tableDiv.appendChild(table);

     var tr = document.createElement('tr');
      //the first tableRow has the headers which include an onclick event which sorts the columns
     tr.innerHTML = '   <th onclick="sortTable(0)">Låt</th> <th onclick="sortTable(1)">Anändare</th>  <th onclick="sortTable(2)">Röstning</th>';
     table.appendChild(tr);

     for(var row = 0; row < data.length; row++) {
                 var tr = document.createElement('tr');

                 var song = document.createElement('td');
                 song.innerHTML = data[row].name;
                 tr.appendChild(song);

                 var user = document.createElement('td');
                 user.innerHTML = data[row].username;
                 tr.appendChild(user);

                 var vote = document.createElement('td');
                 vote.innerHTML = data[row].rating;
                 tr.appendChild(vote);

                 table.appendChild(tr)
         }


}

//http request functions

function getVoteList(user, year) {
       var xhttp;
       var data = user + "," + year;

              xhttp = new XMLHttpRequest();

              xhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                var jsonResponse = JSON.parse(xhttp.responseText);
                fillVoteTable(jsonResponse);

                   console.log(jsonResponse);

                }
              };
              xhttp.open("POST", "getVotes", true);
              xhttp.send(data);
}

function fillTableFromYear(value){
          var xhttp;

          xhttp = new XMLHttpRequest();

          xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
            var jsonResponse = JSON.parse(xhttp.responseText);

                if(isAdmin) {
                    fillTable(jsonResponse, adminTable);
                } else {
                    fillTable(jsonResponse, userTable);
                }

            }
          };
          xhttp.open("POST", "selectFromYear", true);
          xhttp.send(value);
}



function updateDB() {

    var rows = adminTable.rows;
    let httpText = "";
    for(var i = 1; i < getIndexOfFirstEmptyRowInColumn(adminTable, 0); i++) {


        var name = sanitizeUserInput(rows[i].getElementsByTagName("td")[0].innerHTML);
        var artist = sanitizeUserInput(rows[i].getElementsByTagName("td")[1].innerHTML);
        var category = sanitizeUserInput(rows[i].getElementsByTagName("td")[2].innerHTML);
        var year = document.getElementById("yearSelect").value;
        var songID = sanitizeUserInput(rows[i].getElementsByClassName("hiddenID")[0].innerHTML);

        httpText += '{"name": "' + name +  '", "artist": "' + artist +  '", "category": "' + category +  '", "year": "' + year +  '", "songID": "' + songID +  '"}, ';
    }

      var xhttp;

      xhttp = new XMLHttpRequest();

      xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
         var jsonResponse = JSON.parse(xhttp.responseText);
        fillTable(jsonResponse,adminTable)
        console.log(jsonResponse);

        }
      };
      xhttp.open("POST", "updateDB", true);
      xhttp.send(httpText);
}

function confirmVotes() {
  // Get the rows of the user table
  const rows = userTable.rows;

  // Initialize an empty data array
  const data = [];

  // Loop through the rows of the table and build the data array
  for (let i = 1; i < getIndexOfFirstEmptyRowInColumn(userTable, 0); i++) {
    // Get the rating, song ID, and user ID from the table row
    const rating = sanitizeUserInput(rows[i].getElementsByTagName("td")[3].innerHTML);
    const songID = sanitizeUserInput(rows[i].getElementsByClassName("hiddenID")[0].innerHTML);
    const userID = getCookie("userID");

    // Add the data to the data array in JSON format
    data.push({ rating, songID, userID });
  }

  // Send the data to the server via a POST request using fetch
  fetch("confirmVotes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  })
  .then(response => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    // Handle the server response here if needed
  })
  .catch(error => {
    console.error("There was a problem with the fetch operation:", error);
  });
}

//helper functions

function getCookie(cname) {
  const name = cname + "=";
  const decodedCookie = decodeURIComponent(document.cookie);
  const cookie = decodedCookie.split(';').find(c => c.trim().startsWith(name));
  if (cookie) {
    return cookie.substring(name.length);
  }
  throw new Error(`Cookie "${cname}" not found.`);
}

function initLoginPage() {
  const loginButton = document.querySelector("#loginButton");
  loginButton.addEventListener("click", () => {
    console.log("loginButton clicked");
    attemptLogin();
  });
}

function attemptLogin() {
  const usernameInput = document.querySelector("#usernameInput");
  const passwordInput = document.querySelector("#passwordInput");

  const data = {
    username: usernameInput.value,
    password: passwordInput.value
  };

  fetch("login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  }).then(response => {
    if (response.ok) {
      return response.json();
    } else {
      throw new Error("Network response was not ok. Status: " + response.status);
    }
  }).then(data => {
    if (data !== -1) {
      document.cookie = "userID=" + data;
      window.location.replace("/user");
    } else {
      alert("Login failed");
    }
  }).catch(error => {
    console.error("Error during login:", error);
    alert("Login failed");
  });
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
    var nonEmptyRows = getIndexOfFirstEmptyRowInColumn(targetTable, n);

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
  // Loop over all rows in the table
  for (var row = 1; row < targetTable.rows.length; row++) {
    // Loop over all cells in the current row
    var cells = targetTable.rows[row].querySelectorAll("td");
    for (var col = 0; col < cells.length; col++) {
      // Clear the text content of the current cell
      cells[col].textContent = "";
    }
    // Clear the text content of the hidden ID cell
    targetTable.rows[row].querySelector(".hiddenID").textContent = "";
  }
}

function getIndexOfFirstEmptyRowInColumn(tableElement, columnIndex) {
  const rows = tableElement.rows;
  const numRows = rows.length;

  for (let i = 1; i < numRows - 1; i++) {
    const cellValue = rows[i].cells[columnIndex].textContent.trim();

    if (cellValue === "") {
      return i;
    }
  }

  console.error(`No empty rows found in column ${columnIndex}`);
  return -1; // or return null, depending on your use case
}


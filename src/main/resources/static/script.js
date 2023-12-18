var tableDiv;
var adminTable;
var userTable;
var resultTable;
var isAdmin;
var modifiedRowsList = [];


///
///user.html functions
///

//initalizes the user.html page
function initUserPage() {
    tableDiv = document.getElementById("tableDiv");
    userTable = document.createElement('table');

    getUsername()
      .then(function(response) {
        var username = response;
        console.log("in initUserPage function, username = " + username)
        document.getElementById("userLoggedIn").innerHTML = "Logged in as: " + username;
      })
      .catch(function(error) {
        // Handle any errors that occur during the getUsername function
        console.error("Error:", error);
      });

    generateBlankUserTable();
     document.getElementById("confirmVotesBtn").addEventListener("click", function() {
            if (confirm("Are you sure you want to confirm the votes?")) {
                confirmVotes();
            }
        });
    document.getElementById("yearSelect").addEventListener("change", function(e){
        GetSongsFromYear(e.target.value, userTable);
    });
}

function generateBlankUserTable() {
    userTable.id = 'userTable';
    tableDiv.appendChild(userTable);

    var row = userTable.insertRow(0);
    for(var i = 0; i < 4; i++) {
        var th = document.createElement('th');
        row.appendChild(th);
    }

    for(var i = 0; i < 15; i++) {
         var row = userTable.insertRow(userTable.length);

          for(var j = 0; j < 4; j++) {
                 var cell = row.insertCell(j);
                 if(j == 3) {
                    cell.contentEditable = true;
                 }
             }

    }

    userTable.rows[0].getElementsByTagName("th")[0].innerHTML = "Låt";
    userTable.rows[0].getElementsByTagName("th")[1].innerHTML = "Artist";
    userTable.rows[0].getElementsByTagName("th")[2].innerHTML = "Kategori";
    userTable.rows[0].getElementsByTagName("th")[3].innerHTML = "Poäng";

    for(let i = 0; i < 4; i++) {
        userTable.rows[0].getElementsByTagName("th")[i].addEventListener("click", function(){
            sortTable(i, userTable);
        });
    }

    GetSongsFromYear(document.getElementById("yearSelect").value, userTable);

}


///
///admin.html functions
///

//initalizes the admin.html page
 function initAdminPage() {
 tableDiv = document.getElementById("tableDiv");
 adminTable = document.createElement('table');

 generateBlankAdminTable();

    document.getElementById("yearSelect").addEventListener("change", function(e){
        GetSongsFromYear(e.target.value, adminTable);
    });
 }

function generateBlankAdminTable() {
  adminTable.id = 'adminTable';
  tableDiv.appendChild(adminTable);

  var row = adminTable.insertRow(0);
  for (var i = 0; i < 3; i++) {
    var th = document.createElement('th');
    row.appendChild(th);
  }

  for (var i = 0; i < 15; i++) {
    var row = adminTable.insertRow(adminTable.length);

    for (var j = 0; j < 3; j++) {
      var cell = row.insertCell(j);
      cell.contentEditable = true;
      cell.addEventListener("input", markRowAsModified);
    }
    }

    var confirmBtn = document.getElementById("confirmButton");
   confirmBtn.addEventListener("click", function(e){
   updateAdminTableInDatabase(modifiedRowsList);
           for(var i = 0; i < modifiedRowsList.length; i++) {
            modifiedRowsList[i].style.backgroundColor = "";
           }
    });

  adminTable.rows[0].getElementsByTagName("th")[0].innerHTML = "Låt";
  adminTable.rows[0].getElementsByTagName("th")[1].innerHTML = "Artist";
  adminTable.rows[0].getElementsByTagName("th")[2].innerHTML = "Kategori";

  for (let i = 0; i < 3; i++) {
    adminTable.rows[0].getElementsByTagName("th")[i].addEventListener("click", function () {
      sortTable(i, adminTable);
    });
  }

  GetSongsFromYear(document.getElementById("yearSelect").value, adminTable);
}

function markRowAsModified(event) {
  var cell = event.target;
  var row = cell.parentNode;
  if(!modifiedRowsList.includes(row)) {
    modifiedRowsList.push(row);
  }


  // Change the color of the modified row
  row.style.backgroundColor = "red";
}

//fills either user or admin table with DB data
function fillTable(tableData, targetTable) {
    clearTable(targetTable);
    if (targetTable == userTable) {
        fetchUserVotesByYear(getCookie("userID"), document.getElementById("yearSelect").value)
            .then(function(jsonResponse) {
                var ratingArray = jsonResponse;
                for (var row = 1; row < tableData.length; row++) {
                    targetTable.rows[row].getElementsByTagName("td")[0].innerHTML = tableData[row].name;
                    targetTable.rows[row].getElementsByTagName("td")[1].innerHTML = tableData[row].artist;
                    targetTable.rows[row].getElementsByTagName("td")[2].innerHTML = tableData[row].category;
                    targetTable.rows[row].setAttribute('data-id', tableData[row].songID);

                    if(ratingArray[row - 1] === undefined) {
                        targetTable.rows[row].getElementsByTagName("td")[3].innerHTML = "";
                    }else {
                        targetTable.rows[row].getElementsByTagName("td")[3].innerHTML = ratingArray[row - 1];
                    }
                }
            })
            .catch(function(error) {
                console.error(error);
            });
    } else {
        for (var row = 1; row < tableData.length; row++) {
            targetTable.rows[row].getElementsByTagName("td")[0].innerHTML = tableData[row].name;
            targetTable.rows[row].getElementsByTagName("td")[1].innerHTML = tableData[row].artist;
            targetTable.rows[row].getElementsByTagName("td")[2].innerHTML = tableData[row].category;
            targetTable.rows[row].setAttribute('data-id', tableData[row].songID);
        }
    }
}



///
///votes.html functions
///
function initVotePage() {
document.getElementById("userSelect").value = "1";

 document.getElementById("yearSelect").addEventListener("change", function(e){
    fetchVoteTable(document.getElementById("userSelect").value, e.target.value);
 });
 document.getElementById("userSelect").addEventListener("change", function(e){
    fetchVoteTable(e.target.value, document.getElementById("yearSelect").value);
 });

 fetchVoteTable(document.getElementById("userSelect").value, document.getElementById("yearSelect").value);


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
    console.log("data: " + data)
     for(var row = 0; row < data.length; row++) {
    // console.log("row" + data[row]);
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

///
///Results.html functions
///
function initResultsPage() {
 tableDiv = document.getElementById("tableDiv");
 resultTable = document.createElement('table');

 generateBlankResultTable();

    document.getElementById("yearSelect").addEventListener("change", function(e){
        GetSongsFromYear(e.target.value, resultTable);
    });
 }

function generateBlankResultTable() {

    tableDiv.appendChild(resultTable);

    var row = resultTable.insertRow(0);
    for(var i = 0; i < 5; i++) {
        var th = document.createElement('th');
        row.appendChild(th);
    }

    for(var i = 0; i < 15; i++) {
         var row = resultTable.insertRow(resultTable.length);

          for(var j = 0; j < 5; j++) {
                 var cell = row.insertCell(j);
             }

    }

    resultTable.rows[0].getElementsByTagName("th")[0].innerHTML = "Låt";
    resultTable.rows[0].getElementsByTagName("th")[1].innerHTML = "Artist";
    resultTable.rows[0].getElementsByTagName("th")[2].innerHTML = "Kategori";
    resultTable.rows[0].getElementsByTagName("th")[3].innerHTML = "Poäng";
    resultTable.rows[0].getElementsByTagName("th")[4].innerHTML = "Resultat";

    for(let i = 0; i < 4; i++) {
        resultTable.rows[0].getElementsByTagName("th")[i].addEventListener("click", function(){
            sortTable(i, resultTable);
        });
    }

    //GetSongsFromYear(document.getElementById("yearSelect").value, resultTable);

}
function fillResultsTable(data) {
/*THIS FUNCTION IS NEXT, FIX IT, BELOW IS NOT RIGHT
     for(var row = 0; row < data.length; row++) {
    // console.log("row" + data[row]);
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
         } */
}



///
///http request functions
///
function fetchUserVotesByYear(userID, year) {
  return new Promise(function(resolve, reject) {
    var xhttp;
    var data = userID + "," + year;

    xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function() {
      if (this.readyState == 4) {
        if (this.status == 200) {
          var jsonResponse = JSON.parse(xhttp.responseText);
          resolve(jsonResponse);
        } else {
          reject("Error: " + xhttp.status);
        }
      }
    };

    xhttp.open("POST", "getVotes", true);
    xhttp.send(data);
  });
}

function fetchVoteTable(userID, year) {
       var xhttp;
       var data = userID + "," + year;

              xhttp = new XMLHttpRequest();

              xhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                var jsonResponse = JSON.parse(xhttp.responseText);

                   fillVoteTable(jsonResponse);

                }
              };
              xhttp.open("POST", "getVoteTable", true);
              xhttp.send(data);
}

function GetSongsFromYear(year, targetTable){
          var xhttp;

          xhttp = new XMLHttpRequest();

          xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
            var jsonResponse = JSON.parse(xhttp.responseText);
                    fillTable(jsonResponse, targetTable);
            }
          };
          xhttp.open("POST", "selectFromYear", true);
          xhttp.send(year);
}

function updateAdminTableInDatabase(modifiedTable) {

    let httpText = "";

    for(var i = 0; i < modifiedTable.length; i++ ) {
    var row = modifiedTable[i];

            var name = sanitizeUserInput(row.getElementsByTagName("td")[0].innerHTML);
            var artist = sanitizeUserInput(row.getElementsByTagName("td")[1].innerHTML);
            var category = sanitizeUserInput(row.getElementsByTagName("td")[2].innerHTML);
            var year = document.getElementById("yearSelect").value;
            var songID = row.getAttribute('data-id')

            httpText += '{"name": "' + name +  '", "artist": "' + artist +  '", "category": "' + category +  '", "year": "' + year +  '", "songID": "' + songID +  '"}, ';
    }

      var xhttp;

      xhttp = new XMLHttpRequest();

      xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
         var jsonResponse = JSON.parse(xhttp.responseText);
        GetSongsFromYear(document.getElementById("yearSelect").value,adminTable)

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
    const songID = sanitizeUserInput(rows[i].getAttribute('data-id'));
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

function getUsername() {
  return new Promise(function(resolve, reject) {
    var userID = getCookie("userID");
    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function() {
      if (this.readyState == 4) {
        if (this.status == 200) {
        console.log("in getUsername function, responseText = " + xhttp.responseText);
          resolve(xhttp.responseText);
        } else {
          reject("Error: " + xhttp.status);
        }
      }
    };

    xhttp.open("POST", "getUsername", true);
    xhttp.send(userID);
  });
}


function GetResultsFromYear(year){
          var xhttp;

          xhttp = new XMLHttpRequest();

          xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
            var jsonResponse = JSON.parse(xhttp.responseText);
                    fillResultsTable(jsonResponse);
            }
          };
          xhttp.open("POST", "getResults", true);
          xhttp.send(year);
}



///
///helper functions
///



function getCookie(cname) {
  const name = cname + "=";
  const decodedCookie = decodeURIComponent(document.cookie);
  const cookie = decodedCookie.split(';').find(c => c.trim().startsWith(name));
  if (cookie) {
    return cookie.substring(name.length);
  }
  throw new Error(`Cookie "${cname}" not found.`);
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
      if(getCookie("userID") == 3) {//THIS IS A PROBLEM BECAUE 3 IS JUST THE USERID FOR ADMIN ON MY COMPUTER
        window.location.replace("/admin");
      }else {
        window.location.replace("/user");
      }

    } else {
      alert("Login failed");
    }
  }).catch(error => {
    console.error("Error during login:", error);
    alert("Login failed");
  }).finally(() => {
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
    targetTable.rows[row].setAttribute('data-id', "");
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


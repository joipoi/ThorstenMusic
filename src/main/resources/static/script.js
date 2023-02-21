var tableDiv;
var DBresponse;
var table;

function init(DBresponseTemp) {
DBresponse = DBresponseTemp;
tableDiv = document.getElementById("tableDiv");

generateBlankTable();



    document.getElementById("saveToDbButton").addEventListener("click", function(){
        getAllSongsDB();
    });

    document.getElementById("categorySelect").addEventListener("change", function(e){
        fillTableFromCategory(e.target.value);
    });



}

//simple media list with table view
function generateBlankTable() {
    table = document.createElement('table');
    table.id = 'mediaTable';
    tableDiv.appendChild(table);

    var row = table.insertRow(0);
    for(var i = 0; i < 15; i++) {
        var th = document.createElement('th');
        row.appendChild(th);
    }

    for(var i = 0; i < 15; i++) {
         var row = table.insertRow(table.length);
         var hiddenID = document.createElement('td');
         hiddenID.classList.add('hiddenID');
         row.appendChild(hiddenID);


          for(var j = 0; j < 15; j++) {
                 var cell = row.insertCell(j);
                 cell.contentEditable = true;
             }

    }

table.rows[0].getElementsByTagName("th")[0].innerHTML = "Namn";
table.rows[0].getElementsByTagName("th")[1].innerHTML = "Artist";
table.rows[0].getElementsByTagName("th")[2].innerHTML = "Kategori";
table.rows[0].getElementsByTagName("th")[3].innerHTML = "År";

for(let i = 0; i < 4; i++) {
table.rows[0].getElementsByTagName("th")[i].addEventListener("click", function(){
            sortTable(i);
        });
}

fillTable(DBresponse);

}
function fillTable(tableData) {
    clearTable();

      //loops throught mediaList, shows media if it matches the 'type' and 'haveTried' attributes
        for(var row = 0; row < tableData.length; row++) {

                table.rows[row+1].getElementsByTagName("td")[0].innerHTML = tableData[row].name;

                table.rows[row+1].getElementsByTagName("td")[1].innerHTML = tableData[row].artist;

                table.rows[row+1].getElementsByTagName("td")[2].innerHTML = tableData[row].category;

                table.rows[row+1].getElementsByTagName("td")[3].innerHTML = tableData[row].year;

                table.rows[row+1].getElementsByClassName("hiddenID")[0].innerHTML = tableData[row].songID;
        }
}
function fillTableFromCategory(value){
          var xhttp;

          xhttp = new XMLHttpRequest();

          xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
            var jsonResponse = JSON.parse(xhttp.responseText);

              fillTable(jsonResponse);
            }
          };
          xhttp.open("POST", "selectFromCategory", true);
          xhttp.send(value);
}

function getAllSongsDB() {

    var rows = table.rows;
    let httpText = "";
    for(var i = 1; i < getAmountOfNonEmptyRows(table, 0); i++) {


        var name = rows[i].getElementsByTagName("td")[0].innerHTML;
        var artist = rows[i].getElementsByTagName("td")[1].innerHTML;
        var category = rows[i].getElementsByTagName("td")[2].innerHTML;
        var year = rows[i].getElementsByTagName("td")[3].innerHTML;
        var songID = rows[i].getElementsByClassName("hiddenID")[0].innerHTML;

        httpText += '{"name": "' + name +  '", "artist": "' + artist +  '", "category": "' + category +  '", "year": "' + year +  '", "songID": "' + songID +  '"}, ';
    }

      var xhttp;

      xhttp = new XMLHttpRequest();

      xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
        //console.log(this.responseText);
        }
      };
      xhttp.open("POST", "updateDB", true);
      xhttp.send(httpText);
}

//sort an html table either alphabetically or numerically. n = index of clicked element. (stole this from the internet)
function sortTable(n) {
console.log(n + "hey");
    var rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
    switching = true;
    // Set the sorting direction to ascending:
    dir = "asc";
    /* Make a loop that will continue until
    no switching has been done: */

    //only want to sort non empty rows
    var nonEmptyRows = getAmountOfNonEmptyRows(table, n);

    while (switching) {
      // Start by saying: no switching is done:
      switching = false;
      rows = table.rows;
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

function clearTable() {

        for(var row = 1; row < table.rows.length; row++) {
                table.rows[row].getElementsByTagName("td")[0].innerHTML = "";

                table.rows[row].getElementsByTagName("td")[1].innerHTML = "";

                table.rows[row].getElementsByTagName("td")[2].innerHTML = "";

                table.rows[row].getElementsByTagName("td")[3].innerHTML = "";

                table.rows[row].getElementsByClassName("hiddenID")[0].innerHTML = "";
        }
}

function getAmountOfNonEmptyRows(table_, n){
    var rows = table_.rows;
    for (i = 1; i < (rows.length - 1); i++) {
        if(rows[i].getElementsByTagName("td")[n].innerHTML.trim() == ""){
            return i;
        }
    }
}

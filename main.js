var FILE_MODE = "none";
$(document).ready(function () {
  $("#options").on("click", "button", function() {
    var selection = $(this).attr("id");
    if (String(selection) == "g-sheets") {
      // g-sheets input
      FILE_MODE = "gsheets";
    } else if (String(selection) == "csv-file") {
      // csv-input
      FILE_MODE = "csv";
      $('#pre-file').trigger('click');
    } else if (String(selection) == "xlsx-file") {
      // xlsx-input
      FILE_MODE = "excel";
      $('#pre-file').trigger('click');
    }
  });
});

var present_list = [];
var absent_list = [];
var data_of_data = [];
var export_data = [];
var TOTAL_STUDENTS = 0;

function fileInput() {
  if (FILE_MODE === "gsheets") {
    console.log('yo man, cant have that');
  } else if (FILE_MODE === "csv") {
    csvInput();
  } else if (FILE_MODE === "excel") {
    excelUpload();
  }
}

function csvInput() {
  var fileUpload = document.getElementById("pre-file");
  var regex = /(\,|\r?\n|\r|^)(?:"([^"]*(?:""[^"]*)*)"|([^"\,\r\n]*))/;
  if (regex.test(fileUpload.value.toLowerCase())) {
    if (typeof (FileReader) != "undefined") {
      var reader = new FileReader();
      reader.onload = function (e) {
        var table = document.createElement("table");
        table.className = "table";

        var rows = e.target.result.split("\n");
        TOTAL_STUDENTS = rows.length;
        for (var i = 0; i < rows.length; i++) {
          var row = table.insertRow(-1);
          var cells = rows[i].split(",");
          row.id = cells[1];
          data_of_data.push(cells);

          for (var j = 0; j < cells.length; j++) {
            var cell = row.insertCell(-1);
            if (i === 0) {
              cell.innerHTML = "<b>" + String(cells[j]) + "</b>";
            } else {
              cell.innerHTML = cells[j];

            }
          }
          if (i === 0) {
            var cell = row.insertCell(-1);
            continue;
          }
          var butt1 = document.createElement("button");
          butt1.innerHTML = "P";
          var butt2 = document.createElement("button");
          butt2.innerHTML = "A";
          butt1.className = "btn btn-success";
          butt2.className = "btn btn-danger";
          var cell = row.insertCell(-1);
          cell.appendChild(butt1);
          cell.appendChild(butt2);
        }

        var dvCSV = document.getElementById("dvCSV");
        dvCSV.innerHTML = "";
        dvCSV.appendChild(table);

      }
      generateAttendance();
      if ($("#export").hasClass("display-block")) {
        $("#export").removeClass("display-block");
      }

      reader.readAsText(fileUpload.files[0]);

    } else {
        alert("This browser does not support HTML5.");
      }
  } else {
    alert("Please upload a valid CSV file.");
  }
}


function generateAttendance() {
  $(document).ready(function(){
    $('#dvCSV').on('click', 'button', function() {
      var classList = $(this).attr('class').split(' ');
      var butt_clck = $(this);
      $.each(classList, function(index, item) {
        var roll_no = butt_clck.parent().parent().attr('id')
        if (item === 'btn-success' && checkRepeat(roll_no, present_list)) {
          present_list.push(roll_no);
          if (!checkRepeat(roll_no, absent_list)) {
            var index = absent_list.indexOf(roll_no);
            absent_list.splice(index, 1);
            butt_clck.parent().parent().removeClass("text-danger")
          }
          butt_clck.parent().parent().addClass("text-success");
          console.log("Present");
          console.log(present_list);
            //do something
        } else if (item === 'btn-danger' && checkRepeat(roll_no, absent_list)) {
          absent_list.push(roll_no);
          if (!checkRepeat(roll_no, present_list)) {
            var index = present_list.indexOf(roll_no);
            present_list.splice(index, 1);
            console.log('removed present');
            butt_clck.parent().parent().removeClass("text-success")
          }
          butt_clck.parent().parent().addClass("text-danger");

          console.log("Absentees");
          console.log(absent_list);

        }
      });
    });
  });
}

$(function() {
  $("#export").on('click', 'button', function() {
    if (present_list.length + absent_list.length === TOTAL_STUDENTS) {
      console.log("OK, DOWNLOADING YOUR ATTENDANCE CSV");
      console.log("ALL PRESENT: " + String(present_list));
      console.log("ALL ABSENT: " + String(absent_list));
    } else {
      alert("Fill out all everyone's attendance first");
    }
    var butt_id = $(this).attr('id');
    if(butt_id === 'export-csv') {
      exportToCsv();
    } else if (butt_id === 'export-pdf') {
      // export to pdf (function yet to be implemented)
    } else if (butt_id === 'export-xlsx') {
      // export to xlsx (function yet to be implemented)
    }
  });
});

function exportToCsv(){
  var temp_present_list = present_list;
  export_data.push(data_of_data[0]);
  console.log("all people PRESENT:");
  console.log(present_list);
  for (var i = 0; i < data_of_data.length; i++) {
    for (var j = 0; j < temp_present_list.length; j++) {
      if (String(temp_present_list[j]) === String(data_of_data[i][1])) {
        export_data.push(data_of_data[i]);
      }
    }
  }
  console.log("Final LIST: ");
  console.log(export_data);
  let csvContent = "data:text/csv;charset=utf-8,";
  export_data.forEach(function(rowArray) {
      let row = rowArray.join(",");
      csvContent += row + "\r\n";
  });
  var encodedUri = encodeURI(csvContent);
  var link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "my_data.csv");
  document.body.appendChild(link);

  link.click();
}



function checkRepeat(roll_no, list) {
  for (i = 0; i < list.length; i++) {
    if (String(roll_no) === String(list[i])){
      console.log("found em at " + roll_no);
      return false;
    }
  }
  console.log("next time bois at " + roll_no);
  return true;
}

function excelUpload() {
  console.log('haha');
  //Reference the FileUpload element.
  var fileUpload = document.getElementById("pre-file");

  //Validate whether File is valid Excel file.
  var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.xls|.xlsx)$/;
  if (regex.test(fileUpload.value.toLowerCase())) {
    if (typeof (FileReader) != "undefined") {
      var reader = new FileReader();

      //For Browsers other than IE.
      if (reader.readAsBinaryString) {
          reader.onload = function (e) {
            ProcessExcel(e.target.result);
          };
          generateAttendance();
          if ($("#export").hasClass("display-block")) {
            $("#export").removeClass("display-block");
          }
          reader.readAsBinaryString(fileUpload.files[0]);
      } else {
        //For IE Browser.
        reader.onload = function (e) {
          var data = "";
          var bytes = new Uint8Array(e.target.result);
          for (var i = 0; i < bytes.byteLength; i++) {
            data += String.fromCharCode(bytes[i]);
          }
          ProcessExcel(data);
        };
        generateAttendance();
        if ($("#export").hasClass("display-block")) {
          $("#export").removeClass("display-block");
        }
        reader.readAsArrayBuffer(fileUpload.files[0]);
      }
    } else {
        alert("This browser does not support HTML5.");
    }
  } else {
      alert("Please upload a valid Excel file.");
  }
};

function ProcessExcel(data) {
  //Read the Excel File data.
  var workbook = XLSX.read(data, {
    type: 'binary'
  });

  //Fetch the name of First Sheet.
  var firstSheet = workbook.SheetNames[0];

  //Read all rows from First Sheet into an JSON array.
  var excelRows = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[firstSheet]);
  console.log(excelRows);
  var keys = Object.keys(excelRows[0]);

  //Create a HTML Table element.
  var table = document.createElement("table");
  table.className = "table";


  var row = table.insertRow(-1);
  for (var i = 0; i < keys.length; i++) {
    var headerCell = document.createElement("TH");
    headerCell.innerHTML = keys[i];
    row.appendChild(headerCell);
  }
  row.insertCell(-1);



  //Add the data rows from Excel file.
  for (var i = 0; i < excelRows.length; i++) {
    var row = table.insertRow(-1);
    $(row).attr('id', String(excelRows[i][keys[1]]));
    // console.log($(row).attr('id'));
    var smol_list = []
    // console.log(smol_list);
    for (var j = 0; j < keys.length; j++) {
      var cell = row.insertCell(-1);
      // console.log(keys);
      cell.innerHTML = excelRows[i][keys[j]];
      var elmnt = excelRows[i][keys[j]];
      smol_list.push(elmnt);
    }
    data_of_data.push(smol_list);
    var butt1 = document.createElement("button");
    butt1.innerHTML = "P";
    var butt2 = document.createElement("button");
    butt2.innerHTML = "A";
    butt1.className = "btn btn-success";
    butt2.className = "btn btn-danger";
    var cell = row.insertCell(-1);
    cell.appendChild(butt1);
    cell.appendChild(butt2);
  }
  // console.log(data_of_data);

  var dvExcel = document.getElementById("dvCSV");
  dvExcel.innerHTML = "";
  dvExcel.appendChild(table);
};

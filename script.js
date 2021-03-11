// npm install jquery
let $ = require("jquery");
let dialog = require("electron").remote.dialog;
let fs = require("fs");

$(document).ready(function () {
//   let allSheets = [];
  let db;
//   let currentDb;
  let lsc;
  let allSheets = [];
  let sheetNumber = 1;

  $(".add-sheets").on("click" , function(){
    
    console.log("clicked on add sheets !");
    sheetNumber++;
    let li = document.createElement("li");
    li.classList.add("sheets-item");
    li.setAttribute("id" , sheetNumber);
    li.innerHTML = `Sheet${sheetNumber}`;
    $(".sheets-nav").append(li);
    
    init();
    $(li).on("click" , function(){
      let id = $(this).attr("id");
      console.log(id);
      db = allSheets[id-1];
      console.log(db);
      initializeDBandUI();
    })
    // add new db to allSheets;
  })

  $(".sheets-item").on("click" , function(){
    let id = $(this).attr("id");
    console.log(id);
    db = allSheets[id-1];
    console.log(db);
    initializeDBandUI();
  })

  function initializeDBandUI(){
    for (let i = 0; i < 100; i++) {
      for (let j = 0; j < 26; j++) {
        let cellObject = db[i][j];
        $(`.cell[rid = '${i}'][cid='${j}']`).text(cellObject.value);
        $(`.cell[rid = '${i}'][cid='${j}']`).css(
          "font-style",
          cellObject.fontStyle.italic ? "italic" : "normal"
        );
        $(`.cell[rid = '${i}'][cid='${j}']`).css(
          "font-weight",
          cellObject.fontStyle.bold ? "bold" : "normal"
        );
        $(`.cell[rid = '${i}'][cid='${j}']`).css(
          "text-decoration",
          cellObject.fontStyle.underline ? "underline" : "none"
        );
        $(`.cell[rid = '${i}'][cid='${j}']`).css(
          "font-size",
          cellObject.fontSize + "px"
        );
        $(`.cell[rid = '${i}'][cid='${j}']`).css(
          "color",
          cellObject.cellTextColor
        );
        $(`.cell[rid = '${i}'][cid='${j}']`).css(
          "background",
          cellObject.cellBackground
        );
      }
    }
  }


  $(".file").on("click", function () {
    // remove active class from home menu options
    $(".home-menu-options").removeClass("active");
    // add active class to file menu options
    $(".file-menu-options").addClass("active");
  });

  $(".home").on("click", function () {
    // remove active class from file menu options
    $(".file-menu-options").removeClass("active");
    // add active class to home menu options
    $(".home-menu-options").addClass("active");
  });

  // new // open // save

  $(".new").on("click", function () {
    // initialize empty db
    let localdb = [];
    let rows = $(".row");
    for (let i = 0; i < rows.length; i++) {
      let row = [];
      let entries = $(rows[i]).find(".cell");
      // 26 times
      for (let j = 0; j < entries.length; j++) {
        // i=0 ; j =0 => A1
        let name = String.fromCharCode(65 + j) + Number(i + 1);
        let cellObject = {
          name: name,
          value: "",
          formula: "",
          parents: [],
          children: [],
          fontStyle: { bold: false, underline: false, italic: false },
          fontSize: "16",
          cellTextColor: "black",
          cellBackground: "white",
        };
        row.push(cellObject);
        $(`.cell[rid = '${i}'][cid='${j}']`).html("");
        $(`.cell[rid = '${i}'][cid='${j}']`).removeAttr("style");
      }
      localdb.push(row);
    }
    db = localdb;    
  });

  $(".open").on("click", function () {
    // read db
    let files = dialog.showOpenDialogSync();
    // console.log(files[0]);
    let data = fs.readFileSync(files[0]);
    // update local db
    db = JSON.parse(data); // "" => original form
    for (let i = 0; i < 100; i++) {
      for (let j = 0; j < 26; j++) {
        let cellObject = db[i][j];
        $(`.cell[rid = '${i}'][cid='${j}']`).text(cellObject.value);
        $(`.cell[rid = '${i}'][cid='${j}']`).css("font-style" , cellObject.fontStyle.italic ? "italic" : "normal" );
        $(`.cell[rid = '${i}'][cid='${j}']`).css("font-weight" , cellObject.fontStyle.bold ? "bold" : "normal");
        $(`.cell[rid = '${i}'][cid='${j}']`).css("text-decoration" , cellObject.fontStyle.underline ? "underline" : "none");
        $(`.cell[rid = '${i}'][cid='${j}']`).css("font-size" , cellObject.fontSize+"px");
        $(`.cell[rid = '${i}'][cid='${j}']`).css("font-family" , cellObject.fontFamily);
        $(`.cell[rid = '${i}'][cid='${j}']`).css("color" , cellObject.cellTextColor);
        $(`.cell[rid = '${i}'][cid='${j}']`).css("background" , cellObject.cellBackground);
      }
    }
    // update UI
  });
  
  $(".save").on("click", function () {
    // dialog box open
    // db save in a file
    let files = dialog.showSaveDialogSync();
    // console.log(files);
    let data = JSON.stringify(db); // original form =>"original form"
    fs.writeFileSync(files, data);
    alert("File Saved !!");
  });

  // text alignment => left , center , right

  $(".left").on("click", function () {
    $(lsc).css("text-align", "left");
  });
  
  $(".center").on("click", function () {
    $(lsc).css("text-align", "center");
  });
  
  $(".right").on("click", function () {
    $(lsc).css("text-align", "right");
  });

  //   $(".font-alignment div").on("click" , function(){
  //       let alignment = $(this).text();
  //       if(alignment == "L")
  //       $(lsc).css("text-align" , "left");
  //       else if(alignment == "C")
  //       $(lsc).css("text-align" , "center");
  //       else
  //       $(lsc).css("text-align" , "right");
  //   })

  $(".bold").on("click", function () {
      let address =  getAddress(lsc);
      let {rowId , colId} = getRowIdColId(address);
      let cellObject = db[rowId][colId];
    $(lsc).css("font-weight", cellObject.fontStyle.bold ? "normal" : "bold");
    cellObject.fontStyle.bold = !cellObject.fontStyle.bold;
  });
 
  $(".underline").on("click", function () {
    let address =  getAddress(lsc);
    let {rowId , colId} = getRowIdColId(address);
    let cellObject = db[rowId][colId];
    $(lsc).css("text-decoration", cellObject.fontStyle.underline ? "none" : "underline");
    cellObject.fontStyle.underline = !cellObject.fontStyle.underline;

  });
 
  $(".italic").on("click", function () {
    let address =  getAddress(lsc);
    let {rowId , colId} = getRowIdColId(address);
    let cellObject = db[rowId][colId];
    $(lsc).css("font-style", cellObject.fontStyle.italic ? "normal" : "italic");
    cellObject.fontStyle.italic = !cellObject.fontStyle.italic;
  });


  // font-size
  $("#font-size").on("change" , function(){
    let address =  getAddress(lsc);
    let {rowId , colId} = getRowIdColId(address);
    let cellObject = db[rowId][colId];  
    let value = $(this).val();
      $(lsc).css("font-size" , value+"px");
      cellObject.fontSize = value;
      // height

      let height = $(lsc).height();
      let rId = $(lsc).attr("rid");
      let allLeftDivs = $(".left-col div");
      $(allLeftDivs[rId]).height(height);
      $(lsc).text();


  })
  //  font-text heigt
  $("#font").on("change" , function(){
    let address =  getAddress(lsc);
    let {rowId , colId} = getRowIdColId(address);
    let cellObject = db[rowId][colId];  
    let value = $(this).val();
      $(lsc).css("font-family" , value);
      cellObject.fontFamily = value;

    //height
      let height = $(lsc).height();
      let rId = $(lsc).attr("rid");
      let allLeftDivs = $(".left-col div");
      $(allLeftDivs[rId]).height(height);
  })

  // height set
  $(".cell").on("keyup" , function(){
      let height = $(this).height();
      let rowId = $(this).attr("rid");
      let allLeftDivs = $(".left-col div");
      $(allLeftDivs[rowId]).height(height);
  })


  // cell text color and cell color
 
  $("#cell-text-color").on("change" , function(){
    let address =  getAddress(lsc);
    let {rowId , colId} = getRowIdColId(address);
    let cellObject = db[rowId][colId];  
    let cellTextColor = $(this).val();
    $(lsc).css("color" , cellTextColor);
    cellObject.cellTextColor = cellTextColor;
  });
 
  $("#cell-color").on("change" , function(){
    let address =  getAddress(lsc);
    let {rowId , colId} = getRowIdColId(address);
    let cellObject = db[rowId][colId];  
    let cellColor = $(this).val();
    $(lsc).css("background" , cellColor);
    cellObject.cellBackground = cellColor;
  });
 
  // click event attached on .cell
 
  $(".cell").on("click", function () {
    let address = getAddress(this);
    let { rowId, colId } = getRowIdColId(address);
    let cellObject = db[rowId][colId];

    // console.log(address);
    $("#formula").val(cellObject.formula);
    $("#address").val(address);
  });

  $(".cell").on("blur", function () {
    lsc = this;
    // value in cell => local db cell object ?
    let value = $(this).text();
    // console.log("value", value);
    // console.log(value);
    // get rowId , colId from Address
    let address = getAddress(this);
    // console.log(address);
    let { rowId, colId } = getRowIdColId(address);
    let cellObject = db[rowId][colId];
    // console.log(cellObject);
    if (value != cellObject.value) {
      removeFormula(cellObject);
      cellObject.value = value;
      console.log(cellObject);
      updateChildrens(cellObject);
    }
  });

  $("#formula").on("blur", function () {
    let formula = $(this).val();
    let address = getAddress(lsc); // A1
    let { rowId, colId } = getRowIdColId(address); // rowId , colId
    let cellObject = db[rowId][colId];

    if (formula != cellObject.formula) {
      removeFormula(cellObject);
      cellObject.formula = formula;
      solveFormula(cellObject);
      // update childrens ??
      updateChildrens(cellObject);
    }
  });

  // scroll
  $(".content").on("scroll", function () {
    let top = $(this).scrollTop(); // content top se kitna neeche hai
    let left = $(this).scrollLeft(); // content left se kitna aage hai
    $(".top-row").css("top", top + "px");
    $(".top-left-cell").css("top", top + "px");
    // console.log(top,left);
    $(".top-left-cell").css("left", left + "px");
    $(".left-col").css("left", left + "px");
  });

  function removeFormula(cellObject) {
    cellObject.formula = "";
    // console.log("inside remove formula");
    for (let i = 0; i < cellObject.parents.length; i++) {
      // console.log("inside loop of remove formula");
      let parentName = cellObject.parents[i];
      // A1
      let { rowId, colId } = getRowIdColId(parentName);
      let parentCellObject = db[rowId][colId];
      let newChildrens = parentCellObject.children.filter(function (elem) {
        return elem != cellObject.name;
      });
      parentCellObject.children = newChildrens;
    }
    cellObject.parents = [];
  }

  function updateChildrens(cellObject) {
    // console.log("inside update childrens !");
    let childrens = cellObject.children;
    // console.log("childrens", childrens);
    for (let i = 0; i < childrens.length; i++) {
      let childName = childrens[i];
      // console.log(childName);
      // B1
      let { rowId, colId } = getRowIdColId(childName);
      let childCellObject = db[rowId][colId];
      solveFormula(childCellObject);
      updateChildrens(childCellObject);
    }
  }

  function solveFormula(cellObject) {
    // get formula
    // goto components of formula i.e A1 and A2
    // solve (10 + 20);
    // update db value;
    // update ui value;
    let formula = cellObject.formula; // "( A1 + A2 )";  =>  "( 10 + A2 )";
    // console.log(formula);
    let formulaComps = formula.split(" ");
    // [ "(" , "A1" , "+" , "A2" , ")"  ];
    for (let i = 0; i < formulaComps.length; i++) {
      let fComps = formulaComps[i]; // A1
      let comp = fComps[0]; // A
      if (comp >= "A" && comp <= "Z") {
        // fcomps = "A1"
        // console.log(fComps);
        let { rowId, colId } = getRowIdColId(fComps);
        // console.log(rowId, colId);
        let parentCellObject = db[rowId][colId];
        addSelfToChildrenOfParents(parentCellObject, cellObject);
        addParentsToCellObject(parentCellObject, cellObject);
        // // add self to children of parents !
        // parentCellObject.children.push(cellObject.name);
        // // update parents of cellObject
        // cellObject.parents.push(fComps);
        let value = parentCellObject.value;
        formula = formula.replace(fComps, value);
      }
    }
    // console.log(formula);
    let value = eval(formula); // stack infix evaluation
    // console.log(value);
    cellObject.value = value; // DB update
    // $(lsc).text(value); // UI update
    let { rowId, colId } = getRowIdColId(cellObject.name);

    // .cell[rid="1"][cid="1"]
    // $(".cell[rid=" +rowId+"][cid=" + colId + "]").text(value);
    $(`.cell[rid='${rowId}'][cid='${colId}']`).text(value);
    // console.log(db);
  }

  function addSelfToChildrenOfParents(parentCellObject, cellObject) {
    // if i am not present is parentCellobject.children to add
    let filteredChildrens = parentCellObject.children.filter(function (elem) {
      return elem == cellObject.name;
    });
    if (filteredChildrens.length) {
      return;
    }
    parentCellObject.children.push(cellObject.name);
  }

  function addParentsToCellObject(parentCellObject, cellObject) {
    // if parent is not present in parents object then add
    let filteredParents = cellObject.parents.filter(function (elem) {
      return elem == parentCellObject.name;
    });
    if (filteredParents.length) {
      return;
    }
    cellObject.parents.push(parentCellObject.name);
  }

  function init() {
    $(".new").trigger("click");
  }
  init();

  // utility functions
  function getAddress(elem) {
    let rowId = Number($(elem).attr("rid")) + 1;
    let colId = Number($(elem).attr("cId"));
    // console.log(rowId,colId);
    // rowId = 1 => +1 , colId = 0=> A , 1 => B , 2=>C
    let address = String.fromCharCode(65 + colId) + rowId;
    return address;
  }

  function getRowIdColId(address) {
    // address = B2 => rowId => 2 => 1  colId => B => 1
    let colId = address.charCodeAt(0) - 65;
    let rowId = Number(address.substring(1)) - 1;
    return {
      rowId: rowId,
      colId: colId,
    };
  }
});
// complete
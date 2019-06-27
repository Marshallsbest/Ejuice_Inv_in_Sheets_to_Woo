/**
 * Global Variables 
 */
 var ADMINTEMPLATE = "https://docs.google.com/spreadsheets/d/1gX236QOcP1gZI8uC3g44np_WhjAOtJV2IevCqGOXJcs/edit#gid=2146362657";
 var ss = SpreadsheetApp.getActiveSpreadsheet();
 var FILE_TEMPLATE_ID = "1C9g1vAI9_PiGTPi2i0jhW6OnppebNBhTzPn396MGOjs";
 var ADMIN_ID = ss.getId();


/**
 * Plugin install Code
*/
function onInstall(){
  onOpen()
}

/**
 * Create Custom menu 
 */

function onOpen() {
  SpreadsheetApp.getUi()
  .createMenu("County Vape")
  .addItem('New Supplier', 'showSidebar2')
  .addItem('New Brand', 'showSidebar1')
  .addItem('New Item', 'showSidebar3')
  .addItem('New API Credentials', 'showSidebar4')
  .addToUi();
} 

/**
 * Copy the Named Ranges from template to new Supplier Sheet 
 */

function copyRanges(){
  
  var source = ss.getSheetByName("Template");
  var sheets = ss.getSheets()
  for(var i=0;i<sheets.length;i++){
    console.log();
    var name = sheets[i].getSheetName();
    var namedRanges = source.getNamedRanges();
    for(j=0;j<namedRanges.length;j++){
      var rangeName = namedRanges[j].getName();
      var target = ss.getSheetName(name);
      var rangeArea = namedRanges[j].getRange();
    }
  }
}

  /**
   *  Add New Suppliers
   *
   */
   
  function supplierUpdate(SupplierData){
    var ui = SpreadsheetApp.getUi(); // Same variations.
    var template = ss.getSheetByName('Template');
    var adminSheet = ss.getSheetByName('ADMIN_INFO');
    var lastLine = adminSheet.getLastRow();
    adminSheet.insertRowsAfter(lastLine,5);
    var newLine = lastLine + 1;
    var infoLine = newLine + 1;
    console.log("New Line Numbers: ", newLine);
    console.log("Info Line Numbers: ", infoLine);
    var newRange = adminSheet.getRange(newLine, 1, 5, 22);
    var supNameRange = "Supplier_Names";
    var supSkuCode = "Supplier_Sku_Code";
    var callName = SupplierData.company;  
    var banner = SupplierData.logo;
    var bannerUrl = banner.replace(/\s/g, "");
    var contactName = SupplierData.contact; 
    var supCode  = SupplierData.supCode;
    var skuCode  = SupplierData.skuCode;
    var sheetName = callName.replace(/\s/g, "_");
    var email  = SupplierData.email;
    var website  = SupplierData.website ;
//    ss.getRangeByName("Supplier_Admin").copyTo(newRange);
    adminSheet.getRange(infoLine,2).setValue(callName); 
    adminSheet.getRange(infoLine,3).setValue(supCode);
    adminSheet.getRange(infoLine,4).setValue(skuCode);
    adminSheet.getRange(infoLine,5).setValue(contactName);
    adminSheet.getRange(infoLine,6).setValue(email);
    adminSheet.getRange(infoLine,7).setValue(website);
    ss.setActiveSheet(template);
    ss.duplicateActiveSheet().setName(sheetName).activate();
    var newSS = DriveApp.getFileById(FILE_TEMPLATE_ID)
    .makeCopy(DriveApp.getFoldersByName('Supplier Data')
    .next()
    .createFolder(callName)
    ).setName(callName)
    .getId();
    SpreadsheetApp.openById(newSS).getRangeByName('SUPPLIER').setValue(sheetName);
    SpreadsheetApp.openById(newSS).getRange('COVER!A5').setValue(bannerUrl);
    SpreadsheetApp.openById(newSS).getRange('MAIN_ID').setValue(ADMIN_ID);
//    saveInfo(supNameRange, callName,supCode ,skuCode);
    ui.alert('Congratulations! You have successfully added '+ callName +
             ' to the Admin Sheet and created a new folder and supplier Sheeet in the Ejuice suppliers folder')
  };
 /**
  * Sends a pop up to ask for a new name
  *
  */
  
function checkSheetName(name){
  var sheetName = name.replace(/\s/g, "_");
  var supNames = ss.getSheets();
  for(var i=0; i<supNames.length; i++){
    if(supNames[i].getName() == sheetName){
      redoSupplierName()
    }else{
      return sheetName;
    }
  }
}
  /**
  * Alert to choose another Supplier Name
  */
  function redoSupplierName(){
    var result = ui.prompt(
      'That name has benn used already:',
      'Please enter a different Company Name:',
      ui.ButtonSet.OK_CANCEL);
    var button = result.getSelectedButton();
    var name = result.getResponseText();
    if (button == ui.Button.OK) {
      checkSheetName(name)
      return(name)
    }else if(button == ui.Button.CANCEL){
      ui.alert('Ok sheet will not be made please restart the script');
      return;
    }else if(button == ui.Button.CLOSE){
      ui.alert('You closed the dialog, the sheet will not be made. Please restart the script');
      return};
  }
  
  /**
  * Iterate through the named ranges to add the new values in the spread sheet
  */
  
  function saveInfo(range, name, code, sku){
    var ss = SpreadsheetApp.getActiveSpreadsheet()
    var s = ss.getSheetByName('DATA_MASTER');
    var count = 1;
    var curRange = ss.getRangeByName(range);
    var dataRange = ss.getRangeByName('Supplier_Codes');
    var col = curRange.getColumn();
    var newRange = s.getRange(2, col).getDataRegion();
    var lastRow = newRange.getLastRow()+1;
    Logger.log(lastRow);
    console.log(lastRow);
    s.getRange(lastRow,col).setValue(name);
    s.getRange(lastRow,col-1).setValue(code);
    s.getRange(lastRow,col-2).setValue(sku);
    if(!dataRange.getFilter()){
      dataRange.createFilter()}
    dataRange.getFilter().sort(col,true);
    console.log(dataRange);
    ss.toast("Value has been set to row "+ lastRow+1 +' and Column '+ col)
  }

  /**
  * Opens a sidebar. The sidebar structure is described in the Sidebar.html
  * project file.
  */
  
  function showSidebar1() {
    showSidebar('Brand', 'New Brand');
  }
  function showSidebar2(){
    showSidebar('Supplier', 'New Supplier');
  }
  function showSidebar3(){
    showSidebar('Item', 'New item');
  }
  function showSidebar4(){
    showSidebar('Credentials', 'New Creds');
  }

  function showSidebar(page,title) {
    var ui = HtmlService.createTemplateFromFile(page)
    .evaluate()
    .setTitle(title);
    SpreadsheetApp.getUi().showSidebar(ui);
  }

    /**
     * Add a new item
     */
//    
//    function onEdit(e){
//      var ui = SpreadsheetApp.getUi(); // Same variations.
//      var r = ss.getActiveRange()
//      var c = e.range;
//      Logger.log(r);
//      var v = r.getValue();
//      if(v === "Variable"){
//        var result = ui.prompt(
//          'You\'ve selected a Variable product, ',
//          'How many variations are you expecting to have?',
//          ui.ButtonSet.OK_CANCEL);
//        var button = result.getSelectedButton();
//        var text = result.getResponseText();
//        if (button == ui.Button.OK){
//          Logger.log(text);
//          if(text != NaN){
//            for(var i=1; i<text; i++){
//              var d = r.offset(i,0).setValue("Variation");
//              Logger.log(i);
//            }
//          }else if(button == ui.Button.CANCEL){
//            ui.alert('Number not Added or calculated');
//            return;
//          }else if(button == ui.Button.CLOSE){
//            ui.alert('Number not Added or calculated');
//            return};
//        }
//      }
//    }
    
  /**
   * Create a new brand
   */
  
  function createBrand(){
    var html = HtmlService.createHtmlOutputFromFile('dialog')
    .setWidth(400)
    .setHeight(300);
    SpreadsheetApp.getUi() // Or DocumentApp or SlidesApp or FormApp.
    .showModalDialog(html, 'New Brand');
  }

  /**
   *  Add a new Brand and associate it to the supplier code 
   */
  function test(){
    var testObj = new Object;
    testObj.brand = "test";
    testObj.skuCode = "TS";
    testObj.supplierCodeList = "TST";
    brandUpdate(testObj);
    }
  
  function brandUpdate(newObject) {
  
    var cs = ss.getActiveSheet().getSheetName();
    var s = ss.getSheetByName("DATA_MASTER");
    s.activate();
    Logger.log(newObject);
    var brand = newObject.brand;
    var skuCode = newObject.skuCode;
    var supplierCode = newObject.supplierCodeList; 
    var bndCol = ss.getRangeByName("brand").getColumn();
    var bndSku = ss.getRangeByName("brand_Sku").getColumn();
    var skuRange = ss.getRangeByName("brand_Sku").getValues();
    var supCol = ss.getRangeByName("Brand_Sup").getColumn();
    var bRange = ss.getRangeByName("Supplier_Brand");
    var brandRange = bRange.getDataRegion();
    var lastRow = ss.getRangeByName("Brand_Count").getValue()+2;
    Logger.log("last Row",lastRow);
    console.log("last Row",lastRow);
    s.getRange(lastRow,supCol).setValue(supplierCode);
    s.getRange(lastRow,bndCol).setValue(brand);
    s.getRange(lastRow,bndSku).setValue(skuCode);
//    if(!bRange.getFilter()){
//      bRange.createFilter()}
//      console.log("The Else Statement has been activated");
//      bRange.getFilter().sort(supCol,true);
      console.log("Brand Range",brandRange);
     ss.getSheetByName("ADMIN_INFO").activate();
     addToAdmin(newObject);
   return "Success"
  }

  /**
  * Callback to dynamically populate the supplier Options drop down list
  */
  
  function getInfo(namedRange){
    var range = ss.getRangeByName(namedRange);  
    var info = [];
    var data = range.getValues();
    for(var i =0;i<data.length;i++){
      var newData = data[i].pop()
      if(newData){
        info.push(newData)
      }
    }
    Logger.log(info);
    return info
  }
  
  /**
   * Check for duplicates  
   *
   */

function checkSku(userData){
console.log("checkSku Called");
  var skuCode = userData;
  var skuObj = [];
  var skuRange = ss.getRangeByName("brand_Sku").getValues();
  for(var y = 0; y < skuRange.length; y++){
    var sku = skuRange[y].pop()
    skuObj.push(sku)
     console.log("sku Pushed ", sku);
  }
  for(var z = 0; skuObj.length; z++){
    if(skuCode == skuObj[z]){
      messageUser("Please choose another sku code as this one is taken", "Bad SKU");
      var error = "That sku ID has already been used please use another " + skuCode;
      return error
    }
  }
  return "The Sku is free to use!"
}

/*+
* chekc and verify brand name for duplicates before accepting a new entry
*
*/

function checkBrand(userData){
  var brand = userData;
  console.log(userData);
  var brandRange = ss.getRangeByName("brand").getValues();
  var brandObj = [];
  for(var i = 0; i<brandRange.length; i++){
    var branded = brandRange[i].pop();
//    console.log("Brand Name Pushed ", branded);
    brandObj.push(branded);
  };
//  console.log("brand pushed ", branded)
  for( var j = 0; j<brandObj.length; j++){
    if(brand === brandObj[j]){
      var error = "That Brand has already been used please dont use: "+ brand;
      //      Logger.log("Return error Log", error);
      //      console.log("Return error Log", error);
//      console.log("error returned ", error);
      return error
    } 
  } 
//  console.log("The Brand is free to use!", brand);
  return "The Brand is free to use!"
  
}

/**
/ Gets the column to be searched with the coilumns header
/ Returns Column position 
*/
function getColumn(sheet,name){
  var curSheet = ss.getSheetByName(sheet);
  var headers = curSheet.getRange(1,1,1,curSheet.getLastColumn()).getValues();
  var column = headers.indexOf(name)+1;
  return column
}

/*
/ Searches a Given SHeet for a given header then the column of that header for a given name
/ returns the row index of the given name 
//*/
function getRow(sheet, column, name){
  var curSheet = ss.getSheetByName(sheet);
  var headers = curSheet.getRange(1,1,1,curSheet.getLastColumn()).getValues();
  console.log(headers);
  var column = headers[0].map().indexOf(name)+1;
    console.log(headers);
  var newRow = 0;
  console.log(column);
  if(column >= 1){
    var searchRange = curSheet.getRange(1,column,curSheet.getLastRow(),1).getValues();
    for(var i = 0; i<searchRange.length ; i++){
      if (searchRange[i][0] == name){
        console.log(searchRange[i][0]);
        newRow = i + 1;
        return newRow
      }
    }
    
  }else{
    messageUser("Supplier Code not indexed","Supplier Code")
    return curSheet.getLastRow()
  }
}

/**
/ Insert and Copy first row Formulas to new inserted rows
/
*/
function addNewRows(sheet, rowNum, numberOfRows, content){
  var curSheet = ss.getSheetByName(sheet);
  var formulaRow = curSheet.getRange(rowNum, 8, 1,curSheet.getLastColumn());
  curSheet.insertRowsAfter(rowNum, numberOfRows).activate().getActiveRange();
  var brandRow = rowNum +1;
  var newRows = curSheet.getRange(brandRow, 8, 1,curSheet.getLastColumn())
  formulaRow.copyTo(newRows);
  var brandLine = curSheet.getRange(brandRow, 9, 1, 1).setValue(content.Brand)
  var brandLine = curSheet.getRange(brandRow, 10, 1,1).setValue(content.skuCode)
  var brandLine = curSheet.getRange(brandRow, 11, 1,1).setValue(content.attribute)
  var brandLine = curSheet.getRange(brandRow, 12, 1,1).setValue(content.attributeCount)
  var brandLine = curSheet.getRange(brandRow, 13, 1,1).setValue(content.ohmies)
  var brandLine = curSheet.getRange(brandRow, 14, 1,1).setValue(content.wholesale)
  var brandLine = curSheet.getRange(brandRow, 15, 1,1).setValue(content.msrp)
  }
/**
/ Insert and Copy first row Formulas to new inserted rows
/
*/
function addToAdmin(newObject){
    var line = {};
    line.Brand = newObject.brand;
    line.skuCode = newObject.skuCode;
    var supplierCode = newObject.supplierCodeList; 
    line.attribute = newObject.attribute;
    line.attributeCount = newObject.attributeCount;
    line.ohmies = newObject.ohmies;
    line.wholesale = newObject.wholesale;
    line.msrp = newObject.msrp;
    var supplierRow = searchString(supplierCode);
    addNewRows("ADMIN_INFO", supplierRow, 1, line)
     
}


/**
/
/ User message dialog that is not script stopping 
/ param
/
*/
function messageUser(message, title){
var htmlApp = HtmlService
    .createHtmlOutput('<p>'+message+'</p>')
    .setTitle(title)
    .setWidth(250)
    .setHeight(300);

SpreadsheetApp.getActiveSpreadsheet().show(htmlApp);
}

function searchString(text){
  var sheet = SpreadsheetApp.getActiveSheet()
  var search_string = text
  var textFinder = sheet.createTextFinder(search_string)
  var search_row = textFinder.findNext().getRow()
  return search_row 
//  var ui = SpreadsheetApp.getUi();
//  ui.alert("search row: " + search_row)
}

 function makeSimple(sheet,row){
 
 
[
      {
        "src": "http://demo.woothemes.com/woocommerce/wp-content/uploads/sites/56/2013/06/T_2_front.jpg"
      },
      {
        "src": "http://demo.woothemes.com/woocommerce/wp-content/uploads/sites/56/2013/06/T_2_back.jpg"
      }
    ]
 
 }
 
   /**
   * Add API Credential Data
   */
  
  function addCredentials(){
    var html = HtmlService.createHtmlOutputFromFile('Credentials')
    .setWidth(400)
    .setHeight(300);
    SpreadsheetApp.getUi() // Or DocumentApp or SlidesApp or FormApp.
    .showModalDialog(html, 'API Credentials')
  }

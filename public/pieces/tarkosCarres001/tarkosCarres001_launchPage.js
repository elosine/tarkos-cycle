//#ef VARS

let w = 305;
let h = 472;
let center = w / 2;
let btnW = w - 40;
let btnPosX = center - (btnW / 2) - 7;
let launchBtnIsActive = false;
//URL Args
let partsToRunAsString = "";
let pieceIdString = "";
let scoreDataFileNameToLoad = "";
let scoreControlsString = "";

//##ef SOCKET IO
let ioConnection;

if (window.location.hostname == 'localhost') {
  ioConnection = io();
} else {
  ioConnection = io.connect(window.location.hostname);
}
const SOCKET = ioConnection;
//##endef > END SOCKET IO

//#endef VARS

//#ef Main Panel
let panel = mkPanel({
  title: 'Soundflow #4 - Launch',
  onwindowresize: true,
  w: w,
  h: h
});
let canvas = panel.content;
//#endef  Main Panel

//#ef Title Text
let title = mkSpan({
  canvas: canvas,
  w: w,
  h: 24,
  top: 8,
  text: 'Soundflow #4 - Justin Yang',
  fontSize: 17,
  color: 'rgb(153,255,0)'
});
//Center in panel
let titleW = title.getBoundingClientRect().width;
let titlePosX = center - (titleW / 2);
title.style.left = titlePosX.toString() + 'px';
//#endef Title Text

//#ef Piece ID Caption
let pieceIDinstructions = mkSpan({
  canvas: canvas,
  top: 38,
  left: 15,
  text: 'Please enter an ID for this performance:',
  fontSize: 16,
  color: 'white'
});
//#endef Piece ID Caption

//#ef PieceID Input Field
let pieceIDinput = mkInputField({
  canvas: canvas,
  id: 'pieceIDinput',
  w: 90,
  h: 20,
  top: 64,
  left: 15,
  color: 'black',
  fontSize: 18,
});
//#endef PieceID Input Field

//#ef Select Parts Caption
let selectPartsCaption = mkSpan({
  canvas: canvas,
  top: 98,
  left: 15,
  text: 'Please select the parts to display:',
  fontSize: 16,
  color: 'white'
});
// #endef END Select Parts Caption

//#ef Select Parts Checkboxes
let selectPartsCBs = mkCheckboxesHoriz({
  canvas: canvas,
  numBoxes: 5,
  boxSz: 25,
  gap: 20,
  top: 120,
  left: 20,
  lblArray: ['1', '2', '3', '4', '5'],
  lblClr: 'rgb(153,255,0)'
});
//#endef Select Parts Checkboxes

//#ef Score Controls CB
let scoreCtlCb = mkCheckboxesVert({
  canvas: canvas,
  numBoxes: 1,
  boxSz: 25,
  gap: 0,
  top: 180,
  left: 20,
  lblArray: ['Score Controls?'],
  lblClr: 'rgb(153,255,0)',
  lblFontSz: 16
});
scoreCtlCb[0].cb.checked = true;
//#endef Score Controls CB

//#ef Load Score Data from Server Button
let loadScoreDataTop = 210;

//Make Load Score Data Button
let loadScoreDataFromServerButton = mkButton({
  canvas: canvas,
  w: w - 40,
  h: 45,
  top: loadScoreDataTop,
  left: 12,
  label: 'Load Score Data',
  fontSize: 20,
  action: function() { // Step 1: send msg to server to request list of names of score data files stored on the server
    if (launchBtnIsActive) { //only activates after a pieceID is entered and a part is checked
      SOCKET.emit('sf004_loadPieceFromServer', {
        pieceId: pieceIDinput.value //send piece id
      });
    }
  }
}); //let loadScoreDataFromServerButton = mkButton
loadScoreDataFromServerButton.style.left = btnPosX.toString() + 'px'; //centered
loadScoreDataFromServerButton.className = 'btn btn-1_inactive'; //starts as unactive state

//Message received from server with list of available score data files on server
SOCKET.on('sf004_loadPieceFromServerBroadcast', function(data) {
  let requestingId = data.pieceId;
  if (requestingId == pieceIDinput.value) { //match piece id

    let arrayOfFileNamesFromServer = data.availableScoreDataFiles; // data from SOCKET msg
    let arrayOfMenuItems_lbl_action = [];

    //For each of the available score data file names, create a label for the menu and which string to send as URL arg
    arrayOfFileNamesFromServer.forEach((scoreDataFileNameFromServer) => {
      let temp_label_func_Obj = {};
      if (scoreDataFileNameFromServer != '.DS_Store') { //eliminate the ever present Macintosh hidden file .DS_Store

        temp_label_func_Obj['label'] = scoreDataFileNameFromServer; //.label and .action are built into the mkMenu function, see functionLibrary.js

        // Function for when a menu item is selected; When menu item is chosen, this func loads score data to scoreData variable
        temp_label_func_Obj['action'] = function() {
          scoreDataFileNameToLoad = scoreDataFileNameFromServer;
        } //temp_label_func_Obj['action'] = function() END

        arrayOfMenuItems_lbl_action.push(temp_label_func_Obj);

      } //if (scoreDataFileNameFromServer != '.DS_Store') end
    }); // arrayOfFileNamesFromServer.forEach((scoreDataFileNameFromServer) END

    // Make Drop Down Menu
    let loadScoreDataFromServerMenu = mkMenu({
      canvas: canvas,
      w: w - 48,
      h: 127,
      top: loadScoreDataTop + 63,
      left: 25,
      menuLbl_ActionArray: arrayOfMenuItems_lbl_action //menuLbl_ActionArray.label will become the display name in the menu, and menuLbl_ActionArray.action will be the function that runs, see functionLibrary.js
    });
    loadScoreDataFromServerMenu.classList.toggle("show");

  } //if (requestingId == PIECE_ID) end
}); // SOCKET.on('sf004_loadPieceFromServerBroadcast', function(data) end
//#endef END Load Score Data from Server Button

//#ef Launch Button
let launchBtn = mkButton({
  canvas: canvas,
  w: btnW,
  h: 45,
  top: 402,
  left: 12,
  label: 'Launch Score',
  fontSize: 20,
  action: function() {
    if (launchBtnIsActive) {
      location.href = "/pieces/sf004/sf004.html?parts=" + partsToRunAsString + "&id=" + pieceIdString + "&sdfile=" + scoreDataFileNameToLoad + "&ctls=" + scoreControlsString; //this is the string that will be sent as URL arg
    }
  }
});
launchBtn.style.left = btnPosX.toString() + 'px';
launchBtn.className = 'btn btn-1_inactive';
//#endef Launch Button

//#ef checkInputs Func
//Only activate launch score button if there are inputs to id and parts to display cbs
//This function is run every time the mouse is clicked or a key is pressed while in this window/page
let checkInputs = function() {

  let pieceIDisEntered = false;
  let partsCbsAreChecked = false;

  if (pieceIDinput.value.length != 0) pieceIDisEntered = true; // check to see if something is entered into pieceID field

  selectPartsCBs.forEach((cbDic, cbix) => { //see if any checkboxes are checked
    if (cbDic.cb.checked) partsCbsAreChecked = true;
  });

  //if both piece id is entered and some checkboxes are checked then activate the load score button and the launch button
  //if no score data file is chosen, there is a default file that will load in the main page
  if (pieceIDisEntered && partsCbsAreChecked) {
    //activate launch button and loadScoreDataFromServerButton
    launchBtn.className = 'btn btn-1';
    loadScoreDataFromServerButton.className = 'btn btn-1';
    launchBtnIsActive = true; //gate for both button's actions

    //assemble the URL args string
    pieceIdString = pieceIDinput.value;
    partsToRunAsString = "";
    selectPartsCBs.forEach((cbDic, cbix) => { //poll checkboxes to see which parts to run. ';' between each part number
      if (cbDic.cb.checked) partsToRunAsString = partsToRunAsString + cbix + ';';
    });
    partsToRunAsString = partsToRunAsString.slice(0, -1); //remove final semi-colon

    //Use Score Controls?
    scoreControlsString = scoreCtlCb[0].cb.checked == true ? 'yes' : 'no';
  }
  //
  else { //required data is not entered, do not activate launch and load data buttons
    launchBtnIsActive = false;
    launchBtn.className = 'btn btn-1_inactive';
    loadScoreDataFromServerButton.className = 'btn btn-1_inactive';
  } //else { //required data is not entered, do not activate launch and load data buttons

} //let checkInputs = function()
//#endef checkInputs Func

//#ef Window Event Listeners
//run checkInputs each time anywhere on the window is clicked or any key is pressed
window.onclick = function(event) {
  checkInputs();
}
window.onkeyup = function(event) {
  checkInputs();
}
//#endef Window Event Listeners

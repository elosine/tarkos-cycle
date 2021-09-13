//#ef GLOBAL VARIABLES



//#ef SOCKET IO
let ioConnection;

if (window.location.hostname == 'localhost') {
  ioConnection = io();
} else {
  ioConnection = io.connect(window.location.hostname);
}
const SOCKET = ioConnection;
//#endef > END SOCKET IO

//#ef TIMESYNC
const TS = timesync.create({
  server: '/timesync',
  interval: 1000
});
//#endef TIMESYNC


//#endef GLOBAL VARIABLES

//#ef INIT


function init() {
} // function init() END


//#endef INIT









/*


//#ef GLOBAL VARIABLES


//##ef General Variables
let scoreData;
let NUM_TEMPOS = 5;
let NUM_PLAYERS = 5;
const TEMPO_COLORS = [clr_brightOrange, clr_brightGreen, clr_brightBlue, clr_lavander, clr_darkRed2];
//##endef General Variables

//##ef URL Args
let PIECE_ID;
let partsToRun = [];
let TOTAL_NUM_PARTS_TO_RUN;
let SCORE_DATA_FILE_TO_LOAD = "";
let scoreControlsAreOn = true;
//##endef URL Args

//##ef Timing
const FRAMERATE = 60;
let FRAMECOUNT = 0;
const PX_PER_SEC = 100;
const PX_PER_FRAME = PX_PER_SEC / FRAMERATE;
const MS_PER_FRAME = 1000.0 / FRAMERATE;
const LEAD_IN_TIME_SEC = 2;
const LEAD_IN_TIME_MS = LEAD_IN_TIME_SEC * 1000;
const LEAD_IN_FRAMES = LEAD_IN_TIME_SEC * FRAMERATE;
let startTime_epochTime_MS = 0;

let pauseState = 0;
let timePaused = 0;
let pieceClockAdjustment = 0;
let displayClock;
//##endef Timing

//##ef World Canvas Variables
let worldPanel;
const CANVAS_MARGIN = 4;
// let CANVAS_W = 590;
// let CANVAS_H = 515;
let CANVAS_W = 441;
let CANVAS_H = 474;
let CANVAS_CENTER = CANVAS_W / 2;
//##endef END World Canvas Variables

//##ef ThreeJS Scene Variables
const RENDERER_W = 340;
const RENDERER_H = 180;
const RENDERER_TOP = CANVAS_MARGIN;
const RENDERER_DIV_LEFT = CANVAS_CENTER - (RENDERER_W / 2);
let SCENE, CAMERA, SUN, SUN2, RENDERER_DIV, RENDERER;
let materialColors = [];
for (let matlClrIx = 0; matlClrIx < TEMPO_COLORS.length; matlClrIx++) {
  let tMatlClr = new THREE.MeshLambertMaterial({
    color: TEMPO_COLORS[matlClrIx]
  });
  materialColors.push(tMatlClr);
}
let matl_yellow = new THREE.MeshLambertMaterial({
  color: 'yellow'
});
// const CAM_Y = 216; // Up and down; lower number is closer to runway, zooming in
const CAM_Y = 150;
// const CAM_Z = -59; // z is along length of runway; higher number moves back, lower number moves forward
const CAM_Z = 21;
// const CAM_ROTATION_X = -68; // -90 directly above looking down
const CAM_ROTATION_X = -45; // -90 directly above looking down
//##endef END ThreeJS Scene Variables

//##ef Runway Variables
const RUNWAY_W = RENDERER_W;
const RUNWAY_H = RENDERER_H;
const RUNWAY_L = 1000;
const HALF_RUNWAY_W = RUNWAY_W / 2;
const HALF_RUNWAY_LENGTH = RUNWAY_L / 2;
const RUNWAY_LENGTH_FRAMES = Math.round(RUNWAY_L / PX_PER_FRAME);
//##endef END Runway Variables

//##ef Tracks Variables
const NUM_TRACKS = NUM_TEMPOS;
const TRACK_DIAMETER = 8;
const HALF_TRACK_DIAMETER = TRACK_DIAMETER / 2;
const TRACK_GAP = RUNWAY_W / NUM_TRACKS;
const HALF_TRACK_GAP = TRACK_GAP / 2;
let xPosOfTracks = [];
for (let trIx = 0; trIx < NUM_TRACKS; trIx++) {
  xPosOfTracks.push(-HALF_RUNWAY_W + (TRACK_GAP * trIx) + HALF_TRACK_GAP);
}
//##endef END Tracks Variables

//##ef Go Frets Variables
let goFrets = [];
let goFretsGo = [];
const GO_FRET_W = 54;
const GO_FRET_H = 11;
const HALF_GO_FRET_H = GO_FRET_H / 2;
const GO_FRET_L = 13;
const HALF_GO_FRET_L = GO_FRET_L / 2;
const GO_Z = -HALF_GO_FRET_L;
const GO_FRET_Y = HALF_TRACK_DIAMETER;
//##endef END Go Frets Variables

//#ef Tempo Frets Variables
let tempoFretsPerTrack = [];
const TEMPO_FRET_W = GO_FRET_W - 2;
const TEMPO_FRET_H = GO_FRET_H - 2;
const TEMPO_FRET_L = GO_FRET_L - 5;
const TEMPO_FRET_Y = HALF_TRACK_DIAMETER;
const NUM_TEMPO_FRETS_TO_FILL = RUNWAY_L / TEMPO_FRET_L; //Initially make enough tempo frets, which end to end would fill track length
//#endef Tempo Frets Variables

//##ef BBs Variables
let bbSet = [];
for (let trIx = 0; trIx < NUM_TRACKS; trIx++) bbSet.push({});
const BB_W = 51;
const BB_H = 90;
const BB_TOP = RENDERER_TOP + RENDERER_H;
const BB_CENTER = BB_W / 2;
const BB_PAD_LEFT = 10;
const BB_GAP = 16;
const BBCIRC_R = 13;
const BBCIRC_TOP_CY = BBCIRC_R + 3;
const BBCIRC_BOTTOM_CY = BB_H - BBCIRC_R;
const BB_TRAVEL_DIST = BBCIRC_BOTTOM_CY - BBCIRC_TOP_CY;
const BB_BOUNCE_WEIGHT = 6;
const HALF_BB_BOUNCE_WEIGHT = BB_BOUNCE_WEIGHT / 2;
//##endef BBs Variables

//##ef Staff Notation Variables
let rhythmicNotationObj = {};
let notationImageObjectSet = {};

const NOTES_PADDING = 6;
const BEAT_LENGTH_PX = 46;
const TOP_STAFF_LINE_Y = 49 + unisonTokenSize + NOTES_PADDING; //unisonTokenSize from functionLibrary.js
const VERT_DIST_BTWN_STAVES = 64 + unisonTokenSize + 4;
const FIRST_BEAT_L = NOTES_PADDING;
const NUM_BEATS_PER_STAFFLINE = 8;
const NUM_STAFFLINES = 2;
const TOTAL_NUM_BEATS = NUM_BEATS_PER_STAFFLINE * NUM_STAFFLINES;
const STAFF_BTM_MARGIN = 9 + NOTES_PADDING;
const NOTEHEAD_H = 6;
const HALF_NOTEHEAD_H = NOTEHEAD_H / 2;
const RHYTHMIC_NOTATION_CANVAS_W = NOTES_PADDING + (BEAT_LENGTH_PX * NUM_BEATS_PER_STAFFLINE) + NOTES_PADDING; //canvas longer to display notation but cursors will only travel duration of beat thus not to the end of the canvas
const RHYTHMIC_NOTATION_CANVAS_H = TOP_STAFF_LINE_Y + ((NUM_STAFFLINES - 1) * VERT_DIST_BTWN_STAVES) + STAFF_BTM_MARGIN;
const RHYTHMIC_NOTATION_CANVAS_TOP = CANVAS_MARGIN + RENDERER_H + BB_H + CANVAS_MARGIN;
const ADJ_FOR_PITCH_SETS_WIN = 26;
const RHYTHMIC_NOTATION_CANVAS_L = CANVAS_CENTER - (RHYTHMIC_NOTATION_CANVAS_W / 2) + ADJ_FOR_PITCH_SETS_WIN;

//###ef Beat Coordinates

let beatXLocations = [];
for (let beatLocIx = 0; beatLocIx < NUM_BEATS_PER_STAFFLINE; beatLocIx++) {
  beatXLocations.push(FIRST_BEAT_L + (beatLocIx * BEAT_LENGTH_PX));
}

let beatCoords = [];
for (let staffIx = 0; staffIx < NUM_STAFFLINES; staffIx++) {
  for (let beatPerStaffIx = 0; beatPerStaffIx < NUM_BEATS_PER_STAFFLINE; beatPerStaffIx++) {
    let tCoordObj = {};
    tCoordObj['x'] = FIRST_BEAT_L + (beatPerStaffIx * BEAT_LENGTH_PX);
    tCoordObj['y'] = TOP_STAFF_LINE_Y + (staffIx * VERT_DIST_BTWN_STAVES) + HALF_NOTEHEAD_H;
    beatCoords.push(tCoordObj);
  }
}
//###endef Beat Coordinates

//###ef Motive Dictionary
let motiveInfoSet = [{ // [{path:, lbl:, num:, w:, h:, numPartials:}]
    path: "/pieces/sf004/notationSVGs/motives/qtr_rest.svg",
    lbl: 'qtr_rest',
    num: -1,
    w: 7,
    h: 19,
    numPartials: 0
  },
  {
    path: "/pieces/sf004/notationSVGs/motives/quarter.svg",
    lbl: 'quarter',
    num: 0,
    w: 7,
    h: 39.4,
    numPartials: 1
  },
  {
    path: "/pieces/sf004/notationSVGs/motives/dot8thR_16th.svg",
    lbl: 'dot8thR_16th',
    num: 1,
    w: 42.6,
    h: 39,
    numPartials: 1
  },
  {
    path: "/pieces/sf004/notationSVGs/motives/eighthR_8th.svg",
    lbl: 'eighthR_8th',
    num: 2,
    w: 30,
    h: 39,
    numPartials: 1
  },
  {
    path: "/pieces/sf004/notationSVGs/motives/triplet.svg",
    lbl: 'triplet',
    num: 3,
    w: 39,
    h: 50.3,
    numPartials: 3
  },
  {
    path: "/pieces/sf004/notationSVGs/motives/quadruplet.svg",
    lbl: 'quadruplet',
    num: 4,
    w: 40.5,
    h: 39,
    numPartials: 4
  },
  {
    path: "/pieces/sf004/notationSVGs/motives/eighthR_two16ths.svg",
    lbl: 'eighthR_two16ths',
    num: 5,
    w: 41.5,
    h: 39,
    numPartials: 2
  },
  {
    path: "/pieces/sf004/notationSVGs/motives/two16th_8thR.svg",
    lbl: 'two16th_8thR',
    num: 6,
    w: 23,
    h: 39,
    numPartials: 2
  }

];
//###endef Motive Dictionary

let motivesByBeat = [];
for (let beatIx = 0; beatIx < TOTAL_NUM_BEATS; beatIx++) motivesByBeat.push({});
//##endef END Staff Notation Variables

//##ef Scrolling Tempo Cursors
let tempoCursors = [];
const NOTATION_CURSOR_H = 50;
const NOTATION_CURSOR_STROKE_W = 3;
//##endef Scrolling Tempo Cursors

//##ef Scrolling Cursor BBs Variables
let scrollingCsrBbsObjSet = [];
for (let trIx = 0; trIx < NUM_TEMPOS; trIx++) scrollingCsrBbsObjSet.push({});
const SCRBB_GAP = 3;
const SCRBB_W = 9;
const SCRBB_H = NOTATION_CURSOR_H + 2;
const SCRBB_TOP = HALF_NOTEHEAD_H - NOTATION_CURSOR_H - 1;
const SCRBB_CENTER = (-SCRBB_W / 2) - SCRBB_GAP;
const SCRBB_LEFT = -SCRBB_W - SCRBB_GAP;
const SCRBBCIRC_R = SCRBB_W - 4;
const SCRBBCIRC_TOP_CY = SCRBB_TOP + 5;
const SCRBBCIRC_BOTTOM_CY = -SCRBBCIRC_R;
const SCRBB_TRAVEL_DIST = SCRBBCIRC_BOTTOM_CY - SCRBBCIRC_TOP_CY;
const SCRBB_BOUNCE_WEIGHT = 3;
const SCRBB_BOUNCE_WEIGHT_HALF = SCRBB_BOUNCE_WEIGHT / 2;
//##endef Scrolling Cursor BBs Variables

//##ef Player Tokens
let playerTokens = []; //tempo[ player[ {:svg,:text} ] ]
//##endef Player Tokens

//##ef Signs Variables
const SIGN_W = TEMPO_FRET_W - 10;
const SIGN_H = 150;
const HALF_SIGN_H = SIGN_H / 2;
let signsByPlrByTrack = [];
const NUM_AVAILABLE_SIGN_MESHES_PER_TRACK = Math.round(NUM_TEMPO_FRETS_TO_FILL / 10);
//##endef Signs Variables

//##ef Unison Signs Variables
let unisonSignsByTrack = [];
let unisonOffSignsByTrack = [];
//##endef Unison Signs Variables

//##ef Unison Token Variables
let unisonToken;
//##endef Unison Token Variables

//##ef Pitch Sets Variables


//###ef Pitch Sets Dictionary
let pitchSetsPath = "/pieces/sf004/notationSVGs/pitchSets/";

let pitchSetsDictionary = [{ // {path:,lbl:,num:,w:,h:}
    path: pitchSetsPath + 'e4_e5.svg',
    lbl: 'e4_e5',
    num: 0,
    w: 42,
    h: 45
  },
  {
    path: pitchSetsPath + 'e4_e5_b4.svg',
    lbl: 'e4_e5_b4',
    num: 1,
    w: 42,
    h: 45
  },
  {
    path: pitchSetsPath + 'e4_e5_b4cluster.svg',
    lbl: 'e4_e5_b4cluster',
    num: 2,
    w: 42,
    h: 45
  },
  {
    path: pitchSetsPath + 'e4cluster_e5cluster_b4cluster.svg',
    lbl: 'e4cluster_e5cluster_b4cluster',
    num: 3,
    w: 45,
    h: 59
  }
];
//###endef Pitch Sets Dictionary

pitchSetsObj = {};
const NUM_PITCHSETS = Object.keys(pitchSetsDictionary).length;
pitchSetsObj['svgs'] = new Array(NUM_PITCHSETS);

let findPsContWidthHeight = function() {
  let whObj = {};
  let tw = 0;
  let th = 0;
  pitchSetsDictionary.forEach((psObj, i) => {
    if (psObj.w > tw) tw = psObj.w;
    if (psObj.h > th) th = psObj.h;
  });
  whObj['w'] = tw;
  whObj['h'] = th;
  return whObj;
}

const PITCH_SETS_W = 49;
const PITCH_SETS_H = 63;
const PITCH_SETS_GAP = 2;
const PITCH_SETS_TOP = RHYTHMIC_NOTATION_CANVAS_TOP;
const PITCH_SETS_LEFT = RHYTHMIC_NOTATION_CANVAS_L - PITCH_SETS_W - PITCH_SETS_GAP;
const PITCH_SETS_CENTER_W = PITCH_SETS_W / 2;
const PITCH_SETS_MIDDLE_H = PITCH_SETS_H / 2;


//##endef Pitch Sets Variables

//##ef Articulations Variables
let articulationsPath = "/pieces/sf004/notationSVGs/articulations/";
let articulationsObj = { //{path:,amt:,num:,w:,h:}
  marcato: {
    path: articulationsPath + 'marcato.svg',
    amt: (TOTAL_NUM_BEATS * 5),
    num: 0,
    w: 8.3,
    h: 9.13
  }
  // sf: { //Only use Marcato
  //   path: articulationsPath + 'sf.svg',
  //   amt: TOTAL_NUM_BEATS,
  //   num: 0,
  //   w: 16.46,
  //   h: 17.18
  // }
};
let articulationsSet = new Array(Object.keys(articulationsObj).length);
//Make Articulation Positioning Dictionary
// Make a set per motive, that has numPartials length; numPartials from motiveInfoSet
let articulationPosByMotive = [];
motiveInfoSet.forEach((motiveObj, motiveIx) => {
  let t_mNum = motiveObj.num;
  if (t_mNum > -1) { //do not include rest which has num -1
    articulationPosByMotive.push(new Array(motiveObj.numPartials)); //populate with array len = numPartials
  } //  if (t_mNum > -1) { //do not include rest which has num -1
});
articulationPosByMotive.forEach((partialSet, mNum) => {

  switch (mNum) {

    case 0: //quarter
      partialSet[0] = 0;
      break;

    case 1: //dot8thR_16th
      partialSet[0] = (BEAT_LENGTH_PX / 3.85) * 3;
      break;

    case 2: //eighthR_8th
      partialSet[0] = BEAT_LENGTH_PX / 2;
      break;

    case 3: //triplet
      for (let ix = 0; ix < partialSet.length; ix++) {
        partialSet[ix] = (BEAT_LENGTH_PX / 3) * ix;
      }
      break;

    case 4: //quadruplet
      for (let ix = 0; ix < partialSet.length; ix++) {
        partialSet[ix] = (BEAT_LENGTH_PX / 4.15) * ix;
      }
      break;

    case 5: //eighthR_two16ths
      for (let ix = 0; ix < partialSet.length; ix++) {
        partialSet[ix] = (BEAT_LENGTH_PX / 4) * (ix + 2);
      }
      break;

    case 6: //two16th_8thR
      for (let ix = 0; ix < partialSet.length; ix++) {
        partialSet[ix] = (BEAT_LENGTH_PX / 4) * ix;
      }
      break;

  } // switch t_mNum
});
//##endef END Articulations Variables

//#ef Animation Engine Variables
let cumulativeChangeBtwnFrames_MS = 0;
let epochTimeOfLastFrame_MS;
let animationEngineCanRun = true;
//#endef END Animation Engine Variables

//#ef Control Panel Vars
let scoreCtrlPanel;
const CTRLPANEL_W = 92;
const CTRLPANEL_H = CANVAS_H;
const CTRLPANEL_BTN_W = 63;
const CTRLPANEL_BTN_H = 35;
const CTRLPANEL_BTN_L = (CTRLPANEL_W / 2) - (CTRLPANEL_BTN_W / 2);
const CTRLPANEL_MARGIN = 7;
let piece_canStart = true;
let startBtn_isActive = true;
let stopBtn_isActive = false;
let pauseBtn_isActive = false;
let gotoBtn_isActive = false;
let joinBtn_isActive = true;
let joinGoBtn_isActive = false;
let restartBtn_isActive = true;
let makeRestartButton;
//#endef END Control Panel Vars

//#ef SOCKET IO
let ioConnection;

if (window.location.hostname == 'localhost') {
  ioConnection = io();
} else {
  ioConnection = io.connect(window.location.hostname);
}
const SOCKET = ioConnection;
//#endef > END SOCKET IO

//#ef TIMESYNC
const TS = timesync.create({
  server: '/timesync',
  interval: 1000
});
//#endef TIMESYNC


//#endef GLOBAL VARIABLES

//#ef INIT


function init() {

  processUrlArgs();

  //#ef Load Initial Score Data From Public Folder
  let tRequest = new XMLHttpRequest();
  let scoreDataFileNameToLoad = SCORE_DATA_FILE_TO_LOAD == "" ? '/scoreData/sf004-2021-9-10-20-1-48.txt' : '/scoreData/' + SCORE_DATA_FILE_TO_LOAD;
  tRequest.open('GET', scoreDataFileNameToLoad, true); //This is the default file for the score data. This is served with the public folder when the app is run
  tRequest.responseType = 'text';

  tRequest.onload = () => {
    scoreData = JSON.parse(tRequest.response);
    console.log('Score loaded: ' + scoreDataFileNameToLoad);
    console.log(scoreData);
    runAfterScoreDataIsLoaded();
  }
  tRequest.onerror = function() {
    console.log("** An error occurred");
  };

  tRequest.send();
  //#endef Load Initial Score Data From Public Folder //Run above in tRequest.onload = () => { function

  function runAfterScoreDataIsLoaded() {

    makeScoreDataManager();
    makeWorldPanel();
    makeThreeJsScene();
    makeRunway();
    makeTracks();
    makeGoFrets();
    makeTempoFrets();
    makeBouncingBalls();
    makeStaffNotation();
    makeScrollingTempoCursors();
    makeScrollingCursorBbs();
    makePlayerTokens();
    makeSigns();
    makeUnisonSigns();
    makeUnisonToken();
    makePitchSets();
    makeArticulations();

    RENDERER.render(SCENE, CAMERA);

    scoreCtrlPanel = makeControlPanel();
    makeClock();

  } //function runAfterScoreDataIsLoaded()

} // function init() END


//#endef INIT

//#ef PROCESS URL ARGS
function processUrlArgs() {

  let urlArgs = getUrlArgs();

  PIECE_ID = urlArgs.id;
  SCORE_DATA_FILE_TO_LOAD = urlArgs.sdfile;
  // partsToRun
  let partsToRunStrArray = urlArgs.parts.split(';');
  partsToRunStrArray.forEach((partNumAsStr) => {
    partsToRun.push(parseInt(partNumAsStr));
  });

  TOTAL_NUM_PARTS_TO_RUN = partsToRun.length;

  if (urlArgs.ctls == 'no') scoreControlsAreOn = false;

} // function processUrlArgs()
//#endef PROCESS URL ARGS

//#ef GENERATE SCORE DATA
function generateScoreData() {


  //##ef GENERATE SCORE DATA - VARIABLES
  let scoreDataObject = {};
  scoreDataObject['tempos'] = [];
  scoreDataObject['tempoFretsLoopLengthInFrames_perTempo'] = [];
  scoreDataObject['goFrames_perTempo'] = [];
  scoreDataObject['tempoFretLocations_perTempo'] = [];
  scoreDataObject['goFretsState_perTempo'] = [];
  scoreDataObject['leadIn_tempoFretLocations_perTempo'] = [];
  scoreDataObject['bbYpos_perTempo'] = [];
  scoreDataObject['leadIn_bbYpos_perTempo'] = [];
  scoreDataObject['scrollingCsrCoords_perTempo'] = [];
  scoreDataObject['tempoChanges_perPlayer'] = [];
  scoreDataObject['tempoFlagLocs_perPlayer'] = [];
  scoreDataObject['leadIn_tempoFlagLocs_perPlayer'] = [];
  scoreDataObject['playerTokenTempoNum_perPlayer'] = [];
  scoreDataObject['unisons'] = [];
  scoreDataObject['unisonFlagLocs'] = [];
  scoreDataObject['leadIn_unisonFlagLocs'] = [];
  scoreDataObject['unisonPlayerTokenTempoNum'] = [];
  scoreDataObject['motiveSet'] = [];
  scoreDataObject['pitchSets'] = [];
  scoreDataObject['psChgIndicator'] = [];
  //##endef GENERATE SCORE DATA - VARIABLES

  //##ef Generate Tempos

  // Generate 5 Tempos
  let baseTempo = choose([85, 91, 77]);
  let tempoRangeVarianceMin = 0.0045;
  let tempoRangeVarianceMax = 0.007;

  let tTempo = baseTempo;
  for (let tempoIx = 0; tempoIx < NUM_TEMPOS; tempoIx++) {
    tTempo += rrand(tempoRangeVarianceMin, tempoRangeVarianceMax) * tTempo;
    scoreDataObject.tempos.push(tTempo);
  }

  //##endef Generate Tempos

  //##ef CALCULATIONS PER TEMPO
  scoreDataObject.tempos.forEach((tempo) => {


    //##ef Calculate Loop Length & Go Frames
    // make about 9 minutes worth of beats divisible by 16(TOTAL_NUM_BEATS) for scrolling cursor coordination
    let framesPerBeat = FRAMERATE / (tempo / 60);
    let beatsPerCycle = Math.round(tempo * 9);
    while ((beatsPerCycle % TOTAL_NUM_BEATS) != 0) { //keep adding beats until the cycle is divisible by TOTAL_NUM_BEATS
      beatsPerCycle++;
      if (beatsPerCycle > 99999) break;
    }

    // MAKE A SET OF GO FRAMES FOR THIS CYCLE
    let goFrames_thisTempo = [];
    for (let beatIx = 0; beatIx < beatsPerCycle; beatIx++) {
      goFrames_thisTempo.push(Math.round(framesPerBeat * beatIx));
    }

    // CALCULATE LENGTH OF LOOP FOR THIS TEMPO IN FRAMES
    // The end of the loop will be the the last go frame in this cycle
    let tempoFretsLoopLengthInFrames_thisTempo = goFrames_thisTempo[goFrames_thisTempo.length - 1];
    scoreDataObject.tempoFretsLoopLengthInFrames_perTempo.push(tempoFretsLoopLengthInFrames_thisTempo); //store in object variable

    // Remove last frame to assure accurate loop; last frame should be a go frame, this makes 0 of the next cycle the actual next go frame
    // goFrames_thisTempo.pop();

    scoreDataObject.goFrames_perTempo.push(goFrames_thisTempo);
    //##endef Calculate Loop Length & Go Frames

    //##ef Calculate Tempo Fret Locations Per Frame

    //###ef Tempo Fret Main Cycle
    let tempoFretLocs_thisTempo = [];

    //Add RUNWAY_LENGTH_FRAMES worth of goframes to end of goframes set so that there is a smooth transition
    let goFrames_thisTempo_plus = deepCopy(goFrames_thisTempo);
    goFrames_thisTempo.forEach((goFrm) => {
      if (goFrm <= RUNWAY_LENGTH_FRAMES && goFrm > 0) { // Find set of go frames from first to the go frame at end of runway at the start of piece; add these to end so that you have a full runway of tempo frets before you loop; >0 because if you include first go frame you will double up
        goFrames_thisTempo_plus.push(goFrm + tempoFretsLoopLengthInFrames_thisTempo);
      }
    });

    //for every frame in this tempo's loop, look to see if a tf is on scene
    for (let currFrameNumber = 0; currFrameNumber < tempoFretsLoopLengthInFrames_thisTempo; currFrameNumber++) {

      let zlocOfFretsOnSceneSet = [];

      goFrames_thisTempo_plus.forEach((goFrame) => { //look at each go frame to see if it is on scene
        //Look at each go frame for every frame in cycle
        //only include go frames that are on scene
        if (goFrame >= (currFrameNumber - 1) && goFrame < (RUNWAY_LENGTH_FRAMES + currFrameNumber)) { //(currFrameNumber-30)-add a few frames so tf doesn't disappear too abruptly, it falls out of view anyway

          let framesUntilGo = goFrame - currFrameNumber; //Guarantee that each goFrame will have a 0/GO_Z fret location
          let pxUntilGo = framesUntilGo * PX_PER_FRAME;
          let fretLocation = GO_Z - pxUntilGo;
          zlocOfFretsOnSceneSet.push(fretLocation);

        } // if (goFrame >= (currFrameNumber - 30) && goFrame < (RUNWAY_LENGTH_FRAMES + currFrameNumber)) { //(currFrameNumber-30)-add a few frames so tf doesn't disappear too abruptly, it falls out of view anyway
      }); // goFrames_thisTempo_plus.forEach((goFrame) => { //look at each go frame to see if it is on scene END

      tempoFretLocs_thisTempo.push(zlocOfFretsOnSceneSet);

    } //for (let currFrameNumber = 0; currFrameNumber < tempoFretsLoopLengthInFrames_thisTempo; currFrameNumber++) END

    scoreDataObject.tempoFretLocations_perTempo.push(tempoFretLocs_thisTempo);

    //###endef Tempo Fret Main Cycle

    //###ef Tempo Fret Lead In
    let tempoFretLocs_leadIn_thisTempo = [];

    // Only Need Runway Length of Go Frames
    let goFramesForLeadIn = [];
    goFrames_thisTempo.forEach((goFrm) => {
      if (goFrm <= RUNWAY_LENGTH_FRAMES) {
        goFramesForLeadIn.push(goFrm);
      }
    });

    //for every frame in this tempo's loop, look to see if a tf is on scene
    for (let currFrameNumber = 0; currFrameNumber < RUNWAY_LENGTH_FRAMES; currFrameNumber++) {

      let zlocOfLeadInFretsSet = [];

      goFramesForLeadIn.forEach((goFrame) => {

        let framesUntilGo = goFrame - currFrameNumber + RUNWAY_LENGTH_FRAMES;
        let pxUntilGo = framesUntilGo * PX_PER_FRAME;
        let fretLocation = GO_Z - pxUntilGo;
        zlocOfLeadInFretsSet.push(fretLocation);

      }); // goFramesForLeadIn.forEach((goFrame) =>{ END

      tempoFretLocs_leadIn_thisTempo.push(zlocOfLeadInFretsSet);

    } // for (let currFrameNumber = 0; currFrameNumber < RUNWAY_LENGTH_FRAMES; currFrameNumber++) END

    scoreDataObject.leadIn_tempoFretLocations_perTempo.push(tempoFretLocs_leadIn_thisTempo);
    //###endef Tempo Fret Lead In

    //##endef Calculate Tempo Fret Locations Per Frame

    //##ef Calculate Go Frets Blink


    let goFretsState_thisTempo = [];
    for (let i = 0; i < tempoFretsLoopLengthInFrames_thisTempo; i++) { //populate initially with 0
      goFretsState_thisTempo.push(0);
    }
    let goFrmBlinkDurInFrames = 14; //num of frames to hold go frame go

    goFrames_thisTempo.forEach((goFrameNumber) => {

      let lastFrame = goFrameNumber + goFrmBlinkDurInFrames;

      for (let frmIx = goFrameNumber; frmIx < lastFrame; frmIx++) {
        goFretsState_thisTempo[frmIx] = 1;
      }

    }); // goFrames_thisTempo.forEach((goFrameNumber) => END

    scoreDataObject.goFretsState_perTempo.push(goFretsState_thisTempo);


    //##endef Calculate Go Frets Blink

    //##ef Calculate BBs


    //##ef Main Cycle
    let bbYpos_thisTempo = [];
    let bbLeadIn = [];

    goFrames_thisTempo.forEach((goFrm, goFrmIx) => { //goFrames_thisTempo contains the frame number of each go frame

      if (goFrmIx > 0) { //start on second goFrmIx so you can compare to previous index

        let previousGoFrame = goFrames_thisTempo[goFrmIx - 1];
        let thisBeatDurInFrames = goFrm - previousGoFrame; //because of necessary rounding beats last various amounts of frames usually with in 1 frame difference
        let ascentPct = 0.35; //looks best when descent is longer than ascent
        let descentPct = 1 - ascentPct;
        let numFramesUp = Math.floor(ascentPct * thisBeatDurInFrames);
        let numFramesDown = Math.ceil(descentPct * thisBeatDurInFrames);

        let ascentFactor = 0.2;
        let descentFactor = 2.8;

        let ascentPlot = plot(function(x) { //see Function library; exponential curve
          return Math.pow(x, ascentFactor);
        }, [0, 1, 0, 1], numFramesUp, BB_TRAVEL_DIST); //will create an object with numFramesUp length (x) .y is what you want

        ascentPlot.forEach((ascentPos) => {

          let tBbY = BBCIRC_TOP_CY + ascentPos.y; //calculate the absolute y position of bb
          bbYpos_thisTempo.push(Math.round(tBbY)); //populate bbYpos_thisTempo array with bby position for every frame

          //save first bounce for lead-in
          if (goFrmIx == 1) {
            bbLeadIn.push(tBbY);
          }

        }); // ascentPlot.forEach((ascentPos) => END

        let descentPlot = plot(function(x) {
          return Math.pow(x, descentFactor);
        }, [0, 1, 0, 1], numFramesDown, BB_TRAVEL_DIST);

        descentPlot.forEach((descentPos) => {

          let tBbY = BBCIRC_BOTTOM_CY - descentPos.y;
          bbYpos_thisTempo.push(Math.round(tBbY));

          //save first bounce for lead-in
          if (goFrmIx == 1) {
            bbLeadIn.push(tBbY);
          }

        }); // descentPlot.forEach((descentPos) => END

      } // if(goFrmIx>0) END

    }); // goFrames_thisTempo.forEach((goFrm, goFrmIx) => END

    scoreDataObject.bbYpos_perTempo.push(bbYpos_thisTempo);
    //##endef Main Cycle

    //##ef Lead In
    let leadIn_bbYpos_thisTempo = [];
    //make 1 ascent just before first beat
    bbLeadIn.forEach((bbYpos) => { //leadInAscent is already reversed so first index is lowest bbYpos
      leadIn_bbYpos_thisTempo.push(bbYpos);
    });

    scoreDataObject.leadIn_bbYpos_perTempo.push(leadIn_bbYpos_thisTempo);
    //##endef Lead In


    //##endef Calculate BBs

    //##ef Calculate Scrolling Cursors
    //look at every go frame, starting at 1; calc num frames since last go frame; map the distance between two beat coordinates
    let scrollingCsrCoords_thisTempo = []; //[obj:{x:,y1:,y2:}]
    let currBeatNum_InLoop = 0;
    goFrames_thisTempo.forEach((goFrameNumber, ix) => {
      if (ix > 0) { //start on ix=1 so you can compare to previous frame

        let distFrames = goFrameNumber - goFrames_thisTempo[ix - 1];
        let incInPx = BEAT_LENGTH_PX / distFrames;

        for (let i = 0; i < distFrames; i++) {
          let tCoordsObj = {}; //{x:,y1:,y2:}
          tCoordsObj['x'] = beatCoords[currBeatNum_InLoop].x + (i * incInPx); // increment x for each frame between downbeats
          tCoordsObj['y1'] = beatCoords[currBeatNum_InLoop].y + HALF_NOTEHEAD_H - NOTATION_CURSOR_H;
          tCoordsObj['y2'] = beatCoords[currBeatNum_InLoop].y + HALF_NOTEHEAD_H;
          scrollingCsrCoords_thisTempo.push(tCoordsObj);
        } // for (let i = 0; i < distFrames; i++) END

        currBeatNum_InLoop = (currBeatNum_InLoop + 1) % TOTAL_NUM_BEATS;

      } // if (ix > 0) { //start on ix=1 so you can look back END
    }); // goFrames_thisTempo.forEach((goFrameNumber, ix) => END

    scoreDataObject.scrollingCsrCoords_perTempo.push(scrollingCsrCoords_thisTempo);
    //##endef Calculate Scrolling Cursors


  }); // scoreDataObject.tempos.forEach((tempo) => { END
  //##endef CALCULATIONS PER TEMPO

  //##ef CALCULATIONS PER PLAYER
  for (let plrNum = 0; plrNum < NUM_PLAYERS; plrNum++) {


    //##ef Tempo Changes


    //##ef Calculate Which Frames to Change Tempo
    // 7 containers in a palindrome long-shorter-shorter-shorter-Mirror
    let tempoChgTimeCont = generatePalindromeTimeContainers({
      numContainersOneWay: 4,
      startCont_minMax: [90, 110],
      pctChg_minMax: [-0.25, -0.31]
    });
    // duration with tempo changes will be in this pattern: short - medium - long
    // in conjunction with time containers. so 1st tc from short array, next tc from medium array etc...
    let tempoChanges_thisPlayer = []; //{tempo:,frameNum}
    let shortTempoChgDursSec = [9, 9, 11, 13];
    let mediumTempoChgDursSec = [14, 14, 16, 18];
    let longTempoChgDursSec = [21, 23, 33, 28, 37];
    let tTempoSet = [0, 1, 2, 3, 4];

    let tTimeElapsed = 0;
    let firstLastTempoChange = choose(tTempoSet); //need first and last tempo in cycle to be the same so loop works
    tempoChanges_thisPlayer.push({
      frameNum: 0,
      tempo: firstLastTempoChange
    }); // so there is a starting tempo
    let chgDurSetNum = 0;
    let timeContainerRemainder = 0;

    tempoChgTimeCont.forEach((timeContDur) => { //each new time container

      chgDurSetNum = (chgDurSetNum + 1) % 3; //loop change duration sets
      let timeElapsed_thisTC = timeContainerRemainder; //this will be 0 or a negative number

      do { //loop through each time container; add time from the appropriate set of

        let tTimeInc = 99; //so while loop does not go on forever

        switch (chgDurSetNum) {

          case 0:
            tTimeInc = choose(shortTempoChgDursSec);
            break;

          case 1:
            tTimeInc = choose(mediumTempoChgDursSec);
            break;

          case 2:
            tTimeInc = choose(longTempoChgDursSec);
            break;

        }

        timeElapsed_thisTC += tTimeInc; //add time from the appropriate set until this time container is full
        tTimeElapsed += tTimeInc //add this increment to overall time
        let timeElapsedAsFrames = Math.round(tTimeElapsed * FRAMERATE); //convert to frames

        let tNewTempo_frmNum_obj = {};

        //decide which tempo; cycle through them all
        if (tTempoSet.length == 0) tTempoSet = [0, 1, 2, 3, 4]; //when all used up replenish
        let tTempoIx = chooseIndex(tTempoSet); //select the index number from the remaining tempo set
        let tNewTempo = tTempoSet[tTempoIx];
        tTempoSet.splice(tTempoIx, 1); //remove this tempo from set

        tNewTempo_frmNum_obj['tempo'] = tNewTempo;
        tNewTempo_frmNum_obj['frameNum'] = timeElapsedAsFrames;
        tempoChanges_thisPlayer.push(tNewTempo_frmNum_obj);

      } while (timeElapsed_thisTC <= timeContDur);

      timeContainerRemainder = timeElapsed_thisTC - timeContDur; //a negative number pass on remainder so pattern of tempo change durations remains consistant

    }); // tempoChgTimeCont.forEach((timeContDur) => { //each new time container END
    tempoChanges_thisPlayer[tempoChanges_thisPlayer.length - 1].tempo = firstLastTempoChange; //replace last tempo change in cycle with the same as first for looping consistancy
    scoreDataObject.tempoChanges_perPlayer.push(tempoChanges_thisPlayer);
    //##endef Calculate Which Frames to Change Tempo

    //##ef Tempo Change Flags


    let tempoFlagLocs_thisPlr = []; // 1 index per frame {tempo:,frameNum:}
    for (let i = 0; i < 100000; i++) tempoFlagLocs_thisPlr.push([]); // populate with -1 to replace later
    let leadIn_tempoFlagLocs_thisPlr = []; //make a set of lead in frames
    for (let i = 0; i < RUNWAY_LENGTH_FRAMES; i++) leadIn_tempoFlagLocs_thisPlr.push([]);

    let tempoChg_signPos_thisPlayer = [];

    // For each tempo change flag, calculating where it will be for each frame between end of runway and gofret
    tempoChanges_thisPlayer.forEach((tempoFrmNumObj, tempChgIx) => { //{tempo:,frameNum:}

      let tempoNum = tempoFrmNumObj.tempo;
      let goFrmNum = tempoFrmNumObj.frameNum; //this is the frame num where the sign is at the go fret

      for (let i = RUNWAY_LENGTH_FRAMES; i >= 0; i--) { //Need to add a zLocation for every frame the sign is on the runway; count backwards so the soonist frame is the furtherest back position on runway and the last frame is 0-zpos

        let tempoNum_zPos_obj = {};
        let frameNum = goFrmNum - i; //RUNWAY_LENGTH_FRAMES to 0

        if (frameNum >= 0) { //so you don't go to negative array index

          tempoNum_zPos_obj['tempoNum'] = tempoNum;
          let zLoc = Math.round(-PX_PER_FRAME * i) + GO_Z;
          tempoNum_zPos_obj['zLoc'] = zLoc;
          tempoFlagLocs_thisPlr[frameNum].push(tempoNum_zPos_obj); //replace the index in main array for this frame; there is a set of tempo flag locations for each frame cause there could be several tempo flags on scene that frame

          //pop off last frame for looping
          if (tempChgIx == (tempoChanges_thisPlayer.length - 1)) { //last tempo change with tempo num and frame num for this player
            if (i == 0) { // last frame of this cycle
              tempoFlagLocs_thisPlr.splice(frameNum); // truncate array to end of loop; was 100,000 long; frameNum instead of frameNum-1 will lob off last frame so it is clean loop, otherwise it goes to z=0 and the first frame of loop is also z=0
            }
          } //   if (tempChgIx == (tempoChanges_thisPlayer.length - 1)) END

        } // if (frameNum >= 0) END
        //
        else { //for lead-in

          tempoNum_zPos_obj['tempoNum'] = tempoNum;
          let zLoc = Math.round(-PX_PER_FRAME * i) + GO_Z;
          tempoNum_zPos_obj['zLoc'] = zLoc;
          leadIn_tempoFlagLocs_thisPlr[RUNWAY_LENGTH_FRAMES + frameNum].push(tempoNum_zPos_obj); //replace the index in lead in array for this frame; frameNum will be negative

        } //else END

      } // for (let i = RUNWAY_LENGTH_FRAMES; i >= 0; i--) END

      //MAKE ANOTHER LOOP HERE FOR DUR TO HOLD FLAG AT GO FRET
      if (tempChgIx < tempoChanges_thisPlayer.length - 1) { //because we are referencing the next frame
        let tDurFrames = tempoChanges_thisPlayer[tempChgIx + 1].frameNum - goFrmNum; //until the next tempo change flag reaches the go fret
        for (let i = 1; i < tDurFrames; i++) { //i=1 because flag is already there for 1 frame at gofret

          let tempoNum_zPos_obj = {};

          tempoNum_zPos_obj['tempoNum'] = tempoNum;
          tempoNum_zPos_obj['zLoc'] = GO_Z;
          let tFrameNum = goFrmNum + i;
          tempoFlagLocs_thisPlr[tFrameNum].push(tempoNum_zPos_obj);

        } // for (let i = 1; i < tDurFrames; i++) END
      }

    }); // tempoChanges_thisPlayer.forEach((tempoFrmNumObj) => END

    scoreDataObject.tempoFlagLocs_perPlayer.push(tempoFlagLocs_thisPlr);
    scoreDataObject.leadIn_tempoFlagLocs_perPlayer.push(leadIn_tempoFlagLocs_thisPlr);


    //##endef Tempo Change Flags

    //##ef Player Tokens


    //An Array length = to tempoFlagLocs_thisPlr, that contains the current tempo for this player for this frame
    //In Update look up that frame's scrolling cursor location for the right tempo listed here; incorporate toplevel let so player token can see all scrolling cursor locations for that frame
    let playerTokenTempoNum_thisPlr = new Array(tempoFlagLocs_thisPlr.length).fill(-1);

    tempoChanges_thisPlayer.forEach((tempoChgObj, tchgIx) => {
      if (tchgIx > 0) { //so we can use previous index

        let thisTempo = tempoChgObj.tempo;
        let thisFrameNum = tempoChgObj.frameNum;
        let lastTempo = tempoChanges_thisPlayer[tchgIx - 1].tempo;
        let lastFrameNum = tempoChanges_thisPlayer[tchgIx - 1].frameNum;
        let tNumToFill = thisFrameNum - lastFrameNum;

        for (let i = 0; i < tNumToFill; i++) {
          playerTokenTempoNum_thisPlr[lastFrameNum + i] = lastTempo;
        }

      } // if (tchgIx > 0) END
    }); // tempoChanges_thisPlayer.forEach((tempoChgObj, tchgIx) => END

    scoreDataObject.playerTokenTempoNum_perPlayer.push(playerTokenTempoNum_thisPlr);


    //##endef Player Tokens


    //##endef Tempo Changes


  } // for(let plrNum=0;plrNum<NUM_PLAYERS;plrNum++) => END
  //##endef CALCULATIONS PER PLAYER

  //##ef CALCULATIONS FOR UNISONS


  //##ef Calculate frame number and duration of unisons

  let unisonTempoChangeObjs = [];
  let unisonDurSet = [8, 8, 5, 5, 12, 15];
  let unisonTime = 0;
  // Choose a unison duration then a gap from obj below; Repeat gap ranges using numIter below
  let unison_gapRange_numIterations = [{
      gapRange: [38, 41],
      numIter: 2
    },
    {
      gapRange: [34, 36],
      numIter: 1
    },
    {
      gapRange: [60, 65],
      numIter: 3
    },
    {
      gapRange: [34, 36],
      numIter: 1
    },
    {
      gapRange: [38, 41],
      numIter: 2
    }
  ];

  let firstLastUnisonTempo; // so first and last tempo are the same for the loop

  unison_gapRange_numIterations.forEach((gapIterDict, gapIx) => {

    let numIter = gapIterDict.numIter;
    let tTempoSet = [0, 1, 2, 3, 4];

    for (let iterIx = 0; iterIx < numIter; iterIx++) {

      let tChgObj = {};

      let unisonFrame = Math.round(unisonTime * FRAMERATE); //convert to frames
      tChgObj['frame'] = unisonFrame;
      let tDur = choose(unisonDurSet);
      let tDurFrames = Math.round(tDur * FRAMERATE); //convert to frames
      tChgObj['durFrames'] = tDurFrames;
      //choose tempo
      if (tTempoSet.length == 0) tTempoSet = [0, 1, 2, 3, 4]; //when all used up replenish
      let tTempoIx = chooseIndex(tTempoSet); //select the index number from the remaining tempo set
      let tNewTempo = tTempoSet[tTempoIx];
      tTempoSet.splice(tTempoIx, 1); //remove this tempo from set
      tChgObj['tempo'] = tNewTempo;
      if (gapIx == 0 && iterIx == 0) firstLastUnisonTempo = tNewTempo;

      let timeToNextUnison = rrand(gapIterDict.gapRange[0], gapIterDict.gapRange[1]);
      unisonTime += timeToNextUnison;

      scoreDataObject.unisons.push(tChgObj);

    } // for (let iterIx = 0; iterIx < numIter; iterIx++) END

  }); //unison_gapRange_numIterations.forEach((gapIterDict) => END

  scoreDataObject.unisons[scoreDataObject.unisons.length - 1].tempo = firstLastUnisonTempo;

  //##endef Calculate frame number and duration of unisons

  //##ef Unison Flags

  //Make loop size array to store unison state for each frame in loop
  //For Each Unison Flag, find all frames that it is on scene and store in scoreDataObject.unisonFlagLocs
  let lastFrameInUnisonLoop = scoreDataObject.unisons[scoreDataObject.unisons.length - 1].frame + scoreDataObject.unisons[scoreDataObject.unisons.length - 1].durFrames;
  for (let i = 0; i < lastFrameInUnisonLoop; i++) {
    scoreDataObject.unisonFlagLocs.push([]);
  }
  for (let i = 0; i < RUNWAY_LENGTH_FRAMES; i++) scoreDataObject.leadIn_unisonFlagLocs.push([]);

  let tempoChg_signPos_thisPlayer = [];

  scoreDataObject.unisons.forEach((tempoFrmNumObj, tempChgIx) => { //{tempo:,frame:, durFrames:}

    let tempoNum = tempoFrmNumObj.tempo;
    let goFrmNum = tempoFrmNumObj.frame; //this is the frame num where the sign is at the go fret
    let tDurFrames = tempoFrmNumObj.durFrames;

    for (let i = (RUNWAY_LENGTH_FRAMES - 1); i >= 0; i--) { //Need to add a zLocation for every frame the sign is on the runway; count backwards so the soonist frame is the furtherest back position on runway and the last frame is 0-zpos

      let tempoNum_zPos_obj = {};
      let frameNum = goFrmNum - i; //

      if (frameNum >= 0) { //so you don't go to negative array index

        tempoNum_zPos_obj['tempoNum'] = tempoNum;
        let zLoc = Math.round(-PX_PER_FRAME * i);
        tempoNum_zPos_obj['zLoc'] = zLoc;
        tempoNum_zPos_obj['end'] = false;
        scoreDataObject.unisonFlagLocs[frameNum].push(tempoNum_zPos_obj); //replace the index in main array for this frame

      } // if (frameNum >= 0) END
      //
      else { //for lead-in  if frameNum < 0

        tempoNum_zPos_obj['tempoNum'] = tempoNum;
        let zLoc = Math.round(-PX_PER_FRAME * i);
        tempoNum_zPos_obj['zLoc'] = zLoc;
        tempoNum_zPos_obj['end'] = false;
        scoreDataObject.leadIn_unisonFlagLocs[RUNWAY_LENGTH_FRAMES + frameNum].push(tempoNum_zPos_obj); //replace the index in main array for this frame

      } //else END

    } // for (let i = RUNWAY_LENGTH_FRAMES; i >= 0; i--) END

    //MAKE ANOTHER LOOP HERE FOR DUR TO HOLD FLAG AT GO FRET
    for (let i = 1; i < tDurFrames; i++) {

      let tempoNum_zPos_obj = {};

      tempoNum_zPos_obj['tempoNum'] = tempoNum;
      tempoNum_zPos_obj['zLoc'] = 0;
      tempoNum_zPos_obj['end'] = false;
      let tFrameNum = goFrmNum + i;
      scoreDataObject.unisonFlagLocs[tFrameNum].push(tempoNum_zPos_obj);

    } // for (let i = 1; i < tDurFrames; i++) END

  }); // scoreData.unisons.forEach((tempoFrmNumObj, tempChgIx) => END


  // FOR SET OF UNISON OFF FLAGS
  scoreDataObject.unisons.forEach((tempoFrmNumObj, tempChgIx) => { //{tempo:,frame:, durFrames:}

    if (tempChgIx < scoreDataObject.unisons.length - 1) {

      let tempoNum = tempoFrmNumObj.tempo;
      let goFrmNum = tempoFrmNumObj.frame + tempoFrmNumObj.durFrames; //this is the frame num where the sign is at the go fret
      let tDurFrames = tempoFrmNumObj.durFrames;

      for (let i = (RUNWAY_LENGTH_FRAMES - 1); i >= 0; i--) { //Need to add a zLocation for every frame the sign is on the runway; count backwards so the soonist frame is the furtherest back position on runway and the last frame is 0-zpos

        let tempoNum_zPos_obj = {};
        let frameNum = goFrmNum - i; //

        if (frameNum >= 0) { //so you don't go to negative array index

          tempoNum_zPos_obj['tempoNum'] = tempoNum;
          let zLoc = Math.round(-PX_PER_FRAME * i);
          tempoNum_zPos_obj['zLoc'] = zLoc;
          tempoNum_zPos_obj['end'] = true;
          scoreDataObject.unisonFlagLocs[frameNum].push(tempoNum_zPos_obj); //replace the index in main array for this frame

        } // if (frameNum >= 0) END
        //
        else { //for lead-in

          tempoNum_zPos_obj['tempoNum'] = tempoNum;
          let zLoc = Math.round(-PX_PER_FRAME * i);
          tempoNum_zPos_obj['zLoc'] = zLoc;
          tempoNum_zPos_obj['end'] = true;
          scoreDataObject.leadIn_unisonFlagLocs[RUNWAY_LENGTH_FRAMES + frameNum].push(tempoNum_zPos_obj); //replace the index in main array for this frame

        } //else END

      } // for (let i = RUNWAY_LENGTH_FRAMES; i >= 0; i--) END
    }

  }); // scoreData.unisons.forEach((tempoFrmNumObj, tempChgIx) => END

  //##endef Unison Flags

  //##ef Unison Player Tokens

  scoreDataObject.unisonPlayerTokenTempoNum = new Array(scoreDataObject.unisonFlagLocs.length).fill(-1);

  scoreDataObject.unisons.forEach((tempoChgObj, tchgIx) => {

    let thisTempo = tempoChgObj.tempo;
    let thisFrameNum = tempoChgObj.frame;
    let tNumToFill = tempoChgObj.durFrames;

    for (let i = 0; i < tNumToFill; i++) {
      scoreDataObject.unisonPlayerTokenTempoNum[thisFrameNum + i] = thisTempo;
    }

  }); // tempoChangesByFrameNum_thisPlr.forEach((tempoChgObj, tchgIx) => END


  //##endef Unison Player Tokens


  //##endef CALCULATIONS FOR UNISONS

  //##ef CALCULATIONS FOR NOTATION


  //###ef CALCULATE WHEN(FRAME) TO ADD/SUBTRACT RESTS
  //Time Containers & amount of rests
  // 11 containers in a palindrome short-longer-longer ... longest-mirror
  let restsTimeContainers = generatePalindromeTimeContainers({
    numContainersOneWay: 6,
    startCont_minMax: [5, 7],
    pctChg_minMax: [0.27, 0.36]
  });

  //Find out total time
  let restsLoopTotalTime = 0;
  restsTimeContainers.forEach((tTime) => {
    restsLoopTotalTime += tTime;
  });

  // Going to loop this set of time containers a few times to get an overall motive loop length
  // Overall loop length will be x times restsLoopTotalTime
  let numRestsLoop = 7;
  let maxNumRests = 13;
  let restsByFrameSetLength = restsTimeContainers.length * numRestsLoop;
  //Probably overly complex way to make sure restsByFrameSetLength is divisible by maxNumRests so that when looped you remove the same number of rests as you add
  for (let i = 0; i < 100000; i++) {
    if ((restsByFrameSetLength % maxNumRests) == 0) {
      break;
    } else {
      restsByFrameSetLength++;
    }
  }

  // Figure out which frames will add or subtract a rest
  let restsByFrame = [];
  let tCumFrmCt_rests = 0;
  let addMinusRestsCt = 0;
  let restType = 0;
  let restSetInc = 0;
  for (let i = 0; i < restsByFrameSetLength; i++) {
    let tOb = {};
    //advance the amount of frames in restsTimeContainers
    let sec = restsTimeContainers[restSetInc];
    let incInFrms = Math.round(sec * FRAMERATE);
    tCumFrmCt_rests += incInFrms;
    tOb['frame'] = tCumFrmCt_rests;
    if (addMinusRestsCt == 0) restType = (restType + 1) % 2 //toggle rest type if we have moved from removing rests or adding rests or visa versa
    tOb['restType'] = restType;
    restSetInc = (restSetInc + 1) % restsTimeContainers.length;
    addMinusRestsCt = (addMinusRestsCt + 1) % maxNumRests;
    restsByFrame.push(tOb);
  }

  let motiveSetByFrame_length = restsByFrame[restsByFrame.length - 1].frame + 1; //plus 1 because restsByFrame.frame will be index num and length needs to be one more as ix starts at 0
  //###endef CALCULATE WHEN TO ADD/SUBTRACT RESTS
  //RESULTS:
  //<<restsByFrame{frame:,restType}>> A set of objects that tell you the frame to change the rest and the restType-add or subtract rest
  // <<motiveSetByFrame_length>> Calculate the overall length of the looping set that will contain rests, motives and articulations

  //###ef CALCULATE WHEN(FRAME) TO CHANGE MOTIVES
  //For motives, do a choose for dur between changes
  //Make a set as long as motiveSetByFrame_length
  //cycle through all the motives

  //Make an array of counting numbers that each represent a different motive from motiveInfoSet
  let motiveNumberSet = numberedSetFromSize({
    sz: (motiveInfoSet.length - 1)
  });
  //Make a large set <<orderedMotiveNumSet>> of scrambled motives; This adds one of each motive then scrambles then adds again, looping
  let orderedMotiveNumSet = chooseAndCycle({
    loopSet: motiveNumberSet,
    num: 5000
  });

  //Duration between motive changes
  let dursBtwnMotiveChgSet = [5, 7, 3, 6, 11, 13, 8, 9, 17];

  //Make big set of motive change objects: {motiveNum:, time:}
  let motiveChangeTimesObjSet = [];
  let chgFrmNum = Math.round(choose(dursBtwnMotiveChgSet) * FRAMERATE);
  let orderedMotiveNumSetIx = 0;
  while (chgFrmNum < motiveSetByFrame_length) { //Avoid while infinite loops see break at end of this loop
    let tObj = {};
    tObj['motiveNum'] = orderedMotiveNumSet[orderedMotiveNumSetIx];
    orderedMotiveNumSetIx++;
    tObj['frame'] = chgFrmNum;
    motiveChangeTimesObjSet.push(tObj);
    let timeToNextMotiveChg = choose(dursBtwnMotiveChgSet);
    chgFrmNum = chgFrmNum + Math.round(timeToNextMotiveChg * FRAMERATE);
  } // for (let i = 0; i < 100000; i++) END
  //###endef CALCULATE WHEN(FRAME) TO CHANGE MOTIVES
  //RESULTS:
  //<<motiveChangeTimesObjSet{motiveNum:,frame:}>> A set of objects that tell you what frame to change motive and which motive to change into

  //###ef CALCULATE WHEN(FRAME) TO CHANGE ARTICULATIONS
  // For motiveSetByFrame_length frames long, decide what frame to add or subtract an articulation
  // later, when adding rests, you will look at this set and see if an articulation was added/subtracted
  // and see how many motives are on, compare to a maximum density or 0 for min density then add or subtract an articulation or do nothing
  let articulationChgByFrame = [];
  let articulationGap = Math.round(rrand(7, 16));
  let articulationGapFrames = articulationGap * FRAMERATE;
  // next 3 let for knowing whether to add or subtract an articulation
  let articulationCounter = 0;
  let numArtToAddSub = 9; //add for numArtToAddSub then subtract for numArtToAddSub
  let addSubtractArtType = 1;
  //////////

  do { //Build set of articulation changes and which frame articulationChgByFrame[{frame:,type:}]

    let artObj = {};

    artObj['frame'] = articulationGapFrames;
    articulationGapFrames = articulationGapFrames + (Math.round(rrand(7, 16)) * FRAMERATE);
    artObj['type'] = addSubtractArtType;
    articulationChgByFrame.push(artObj); //add to main array
    articulationCounter = (articulationCounter + 1) % numArtToAddSub; //update counter
    if (articulationCounter == 0) addSubtractArtType = (addSubtractArtType + 1) % 2; //when counter reaches reset/0 then toggle addSubtractArtType

  } while (articulationGapFrames < motiveSetByFrame_length);
  //###endef CALCULATE WHEN(FRAME) TO CHANGE ARTICULATIONS
  //RESULTS:
  //<<articulationChgByFrame{type:,frame:}>> - A set of objects that tell whether to add or subtract an articulation and which frame

  //###ef POPULATE MASTER SET TO REPLACE LATER
  //Fill all frames with a set of 16 beats of all quarters and no articulations then replace later
  let motiveChgByFrameSet = []; //{motiveNum:,articulations:[{articulationType:,x:,y:,partialNum:}]}
  let tMotiveObj = { //empty set
    motiveNum: 0, //start with all quarters
    articulations: []
  }
  for (let i = 0; i < motiveSetByFrame_length; i++) {
    motiveChgByFrameSet.push([tMotiveObj, tMotiveObj, tMotiveObj, tMotiveObj, tMotiveObj, tMotiveObj, tMotiveObj, tMotiveObj, tMotiveObj, tMotiveObj, tMotiveObj, tMotiveObj, tMotiveObj, tMotiveObj, tMotiveObj, tMotiveObj]);
  }
  //This set will be altered then copied over each frame between rest changes
  let motiveChgByFrameSet_currSet = [tMotiveObj, tMotiveObj, tMotiveObj, tMotiveObj, tMotiveObj, tMotiveObj, tMotiveObj, tMotiveObj, tMotiveObj, tMotiveObj, tMotiveObj, tMotiveObj, tMotiveObj, tMotiveObj, tMotiveObj, tMotiveObj];
  //###endef POPULATE MASTER SET TO REPLACE LATER
  //RESULTS:
  //<<motiveChgByFrameSet{motiveNum:,articulations:[{articulationType:,x:,y:,partialNum:}]}>>
  //<<motiveChgByFrameSet_currSet{motiveNum:,articulations:[{articulationType:,x:,y:,partialNum:}]}>>

  //###ef CALCULATE FRAME BY FRAME SET


  let previous_motiveChgByFrameSet = deepCopy(motiveChgByFrameSet[0]); //First frame's set of 16 beats of motive objects as initilization

  for (let frmIx = 0; frmIx < motiveSetByFrame_length; frmIx++) {

    //Start with the previous frame's set of motives per beat
    let motiveSet_thisFrame = deepCopy(previous_motiveChgByFrameSet);

    //##ef RESTS
    //Look through restsByFrame set <<restsByFrame[{frame:,restType:(0-subtract,1-add)}]>>
    for (let restIx = 0; restIx < restsByFrame.length; restIx++) {
      if (restsByFrame[restIx].frame == frmIx) { //Is there a rest change on this frame in the restsByFrame set?

        let addOrSubtractRest = restsByFrame[restIx].restType; // =0 to remove rest; =1 to add rest

        //###ef REMOVE REST
        if (addOrSubtractRest == 0) { //remove rest

          //Make a set of beats-with-rests
          let beatsWithRests = []; //collect all beat numbers with rests

          for (let beatNum = 0; beatNum < motiveSet_thisFrame.length; beatNum++) {
            if (motiveSet_thisFrame[beatNum].motiveNum == -1) beatsWithRests.push(beatNum); //motiveNum: -1 indicates rest
          } // for(let beatNum=0;beatNum<motiveSet_thisFrame.length;beatNum++)

          //Choose randomly from the set of beats with rests and remove and update motiveSet_thisFrame
          if (beatsWithRests.length > 0) { //if there are any beats with rests
            let beatWithRestToRemove = choose(beatsWithRests);
            //Replace this beat with an object with motiveNum:0 (quarter-note) and no articulations
            motiveSet_thisFrame[beatWithRestToRemove] = {
              motiveNum: 0,
              articulations: []
            }; // motiveSet_thisFrame[beatWithRestToRemove] = {
          } //  if(t_beatsWithRests.length>0)

        } // if(addOrSubtractRest == 0){ //remove rest
        //###endef REMOVE REST

        //###ef ADD REST
        else if (addOrSubtractRest == 1) { //add rest

          //Make a set of beats-with-motives
          let beatsWithMotives = []; //collect all beat numbers with motives

          for (let beatNum = 0; beatNum < motiveSet_thisFrame.length; beatNum++) {
            if (motiveSet_thisFrame[beatNum].motiveNum != -1) beatsWithMotives.push(beatNum); //motiveNum: !=-1 indicates motive
          } // for(let beatNum=0;beatNum<motiveSet_thisFrame.length;beatNum++)

          //Choose randomly from the set of beats with motives and remove and update motiveSet_thisFrame
          if (beatsWithMotives.length > 0) { //if there are any beats with motives
            let beatWithMotiveToRemove = choose(beatsWithMotives);
            //Replace this beat with an object with motiveNum: -1 (rest) and no articulations
            motiveSet_thisFrame[beatWithMotiveToRemove] = {
              motiveNum: -1,
              articulations: []
            }; // motiveSet_thisFrame[beatWithMotiveToRemove] = {
          } // if (beatsWithMotives.length > 0)

        } //else if(addOrSubtractRest == 1){ //add rest
        //###endef ADD REST

      } // if(restsByFrame.frame == frmIx){ //There is a rest change on this frame
    } // for(let restIx=0;restIx<restsByFrame.length;restIx++)
    //##endef RESTS

    //##ef MOTIVES
    //Look through motiveChangeTimesObjSet <<motiveChangeTimesObjSet{motiveNum:,frame:}>>
    for (let motiveChgSetIx = 0; motiveChgSetIx < motiveChangeTimesObjSet.length; motiveChgSetIx++) {
      if (motiveChangeTimesObjSet[motiveChgSetIx].frame == frmIx) { //Is there a motive change on this frame

        let newMotiveNum = motiveChangeTimesObjSet[motiveChgSetIx].motiveNum; //This is the motive number to replace one in the set

        //Make a set of beats-with-motives
        let beatsWithMotives = []; //collect all beat numbers with motives

        //Look through motiveSet_thisFrame and see which beats have motives, if it is a motive, add beatNum to beatsWithMotives set
        for (let beatNum = 0; beatNum < motiveSet_thisFrame.length; beatNum++) {
          if (motiveSet_thisFrame[beatNum].motiveNum != -1) beatsWithMotives.push(beatNum); //motiveNum: !=-1 indicates motive
        } // for(let beatNum=0;beatNum<motiveSet_thisFrame.length;beatNum++)

        //Choose randomly from the set of beats with motives and update with new motive number and update motiveSet_thisFrame
        if (beatsWithMotives.length > 0) { //if there are any beats with motives
          let beatWithMotiveToChg = choose(beatsWithMotives);
          //Replace this beat with an object with motiveNum: -1 (rest) and no articulations
          motiveSet_thisFrame[beatWithMotiveToChg] = {
            motiveNum: newMotiveNum,
            articulations: []
          }; // motiveSet_thisFrame[beatWithMotiveToChg] = {
        } // if (beatsWithMotives.length > 0) //if there are any beats with motives

      } // if (motiveChangeTimesObjSet[motiveChgSetIx].frame == frmIx) { //Is there a motive change on this frame
    } // for (let motiveChgSetIx = 0; motiveChgSetIx < motiveChangeTimesObjSet.length; motiveChgSetIx++)
    //##endef MOTIVES

    //##ef ARTICULATIONS
    //Look through articulationChgByFrame set <<articulationChgByFrame{type:(0-subtract,1-add),frame:}>>
    for (let artSetIx = 0; artSetIx < articulationChgByFrame.length; artSetIx++) {
      if (articulationChgByFrame[artSetIx].frame == frmIx) { //Is there an articulation change on this frame

        let addOrSubtractArt = articulationChgByFrame[artSetIx].type; // =0 to remove articulation; =1 to add articulation

        //###ef REMOVE ARTICULATION
        if (addOrSubtractArt == 0) { //remove articulation

          //Make a set of beats-with-articulations
          let beatsWithArticulations = []; //collect all beat numbers with articulations

          //Look through motiveSet_thisFrame and see which beats have motives with articulations, randomly choose one of these beats, remove articulation from that beat
          for (let beatNum = 0; beatNum < motiveSet_thisFrame.length; beatNum++) {
            if (motiveSet_thisFrame[beatNum].motiveNum != -1) { //is a motive
              if (motiveSet_thisFrame[beatNum].articulations.length > 0) { //this motive on this beat has articulations

                beatsWithArticulations.push(beatNum); // add beat number to beatsWithArticulations set

              } // if (motiveSet_thisFrame[beatNum].articulations.length > 0) { //this motive on this beat has articulations
            } // if (motiveSet_thisFrame[beatNum].motiveNum != -1) { //is a motive
          } // for(let beatNum=0;beatNum<motiveSet_thisFrame.length;beatNum++)

          //Choose randomly from the set of beats with articulations, then choose randomly from the articulations set, then remove articulation
          if (beatsWithArticulations.length > 0) { //if there are beats with articulations
            let beatWithArtsToRemove = choose(beatsWithArticulations);
            //Remove one of the articulations in this beat's articulation set
            let indexOfarticulationToRemoveFromThisMotive = chooseIndex(motiveSet_thisFrame[beatWithArtsToRemove].articulations); //choose an index to remove from the array of articulations
            motiveSet_thisFrame[beatWithArtsToRemove].articulations.splice(indexOfarticulationToRemoveFromThisMotive, 1); //remove
          } // if (beatsWithArticulations.length > 0) { //if there are beats with articulations

        } // if (addOrSubtractArt == 0) { //remove articulation
        //###endef REMOVE ARTICULATION

        //###ef ADD ARTICULATION
        else if (addOrSubtractArt == 1) { //add articulation

          //Make a set of beats-with-motives
          let beats_availPartials_toAddArt = []; //[{beatNum:, motiveNum:, partial:}] //partial is already chosen before adding to set

          //Look through motiveSet_thisFrame and see which beats have motives, and look at these motive's articulations set to see if any partials are available to add an articulation
          for (let beatNum = 0; beatNum < motiveSet_thisFrame.length; beatNum++) {
            let motiveNumThisBeat = motiveSet_thisFrame[beatNum].motiveNum;
            if (motiveNumThisBeat != -1) { //this beat has a motive

              //Look up total number of partials for the motive at this beat
              let totalNumPartialsThisMotive = 0;
              motiveInfoSet.forEach((motiveInfoObj) => { //motiveInfoSet [{path:, lbl:, num:, w:, h:, numPartials:}]
                if (motiveInfoObj.num == motiveNumThisBeat) {
                  totalNumPartialsThisMotive = motiveInfoObj.numPartials;
                } // motiveInfoSet.forEach((motiveInfoObj) =>
              }); //motiveInfoSet.forEach((motiveInfoObj) => { //motiveInfoSet [{path:, lbl:, num:, w:, h:, numPartials:}]

              //Find out if there any available partials without articulations already in this beat's motive
              let availPartialsSet = numberedSetFromSize({ //create an array of 0,1,2,3... for number of available partials
                sz: totalNumPartialsThisMotive
              });
              motiveSet_thisFrame[beatNum].articulations.forEach((artObj, i) => { //{motiveNum:,articulations:[{articulationType:,x:,y:,partialNum:}]}
                const takenPartialIx = availPartialsSet.indexOf(artObj.partialNum); //find the index of the partialNum that already has an articulation
                availPartialsSet.splice(takenPartialIx, 1); //remove this index from the availPartialsSet
              }); //motiveSet_thisFrame[beatNum].articulations.forEach((artObj, i) => { //{motiveNum:,articulations:[{articulationType:,x:,y:,partialNum:}]}

              //If there are available partials for this motive on this beat, add to beats_availPartials_toAddArt
              if (availPartialsSet.length > 0) {
                tObj = {};
                tObj['beatNum'] = beatNum;
                tObj['motiveNum'] = motiveNumThisBeat;
                //Choose a random partial to update here
                let partialToUse = choose(availPartialsSet);
                tObj['partial'] = partialToUse;
                beats_availPartials_toAddArt.push(tObj);
              } //if (availPartialsSet.length > 0)

            } //if (motiveSet_thisFrame[beatNum].motiveNum != -1)
          } // for(let beatNum=0;beatNum<motiveSet_thisFrame.length;beatNum++)
          //RESULTS:<<beats_availPartials_toAddArt[{beatNum:,partial:}]>>

          //Choose randomly from the set of beats_availPartials_toAddArt, add an articulation to the motive at that beat
          if (beats_availPartials_toAddArt.length > 0) { //if there are any beats with motives with available partials to add an articulation
            let beats_availPartials_obj = choose(beats_availPartials_toAddArt);
            let beatToAddArticulation = beats_availPartials_obj.beatNum;
            let motiveNumToAddArticulation = beats_availPartials_obj.motiveNum;
            let partialToAddArticulation = beats_availPartials_obj.partial;
            //look up x/y location for this articulation
            let tX = beatCoords[beatToAddArticulation].x + articulationPosByMotive[motiveNumToAddArticulation][partialToAddArticulation];
            let tY = beatCoords[beatToAddArticulation].y;
            //Add to this beat's motive's articulation array
            motiveSet_thisFrame[beatToAddArticulation].articulations.push({
              articulationType: 0,
              x: tX,
              y: tY,
              partialNum: partialToAddArticulation
            }); // motiveSet_thisFrame[beatToAddArticulation].articulations.push
          } // if (beats_availPartials_toAddArt.length > 0) { //if there are any beats with motives with available partials to add an articulation

        } // else if (addOrSubtractArt == 1) { //add articulation
        //###endef ADD ARTICULATION

      } // if (articulationChgByFrame[artSetIx].frame == frmIx) { //Is there an articulation change on this frame
    } // for (let artSetIx = 0; artSetIx < articulationChgByFrame.length; artSetIx++) {
    //##endef ARTICULATIONS


    //##ef THIS FRAME'S UPDATES BEFORE MOVING ON TO NEXT FRAME
    //Copy set of motives per beat for this frame to master set
    motiveChgByFrameSet[frmIx] = deepCopy(motiveSet_thisFrame);
    //Update previous_motiveChgByFrameSet for next frame
    previous_motiveChgByFrameSet = deepCopy(motiveSet_thisFrame);
    //##endef THIS FRAME'S UPDATES BEFORE MOVING ON TO NEXT FRAME

  } // for(let frmIx=0;frmIx<motiveSetByFrame_length;frmIx++) //End of big frame by frame loop


  //###endef CALCULATE FRAME BY FRAME SET


  scoreDataObject.motiveSet = motiveChgByFrameSet; //This is the final set


  //##endef CALCULATIONS FOR NOTATION

  //##ef CALCULATIONS FOR PITCH SETS

  let availablePitchSetNumbers = []; //make a numbered Set of all available pitch sets
  for (let i = 0; i < pitchSetsDictionary.length; i++) availablePitchSetNumbers.push(i);
  let setOfPitchSetNumbers = cycleThroughSet_palindrome(availablePitchSetNumbers, 99); //create a long list of pitch set numbers in a palindrome
  // Decide which frames to change pitch sets, add to main array
  let pitchSetChangesByFrame = [];
  let psChangeIndicatorStateByFrame = []; //0=off;1=on
  for (let i = 0; i < motiveChgByFrameSet.length; i++) psChangeIndicatorStateByFrame.push(0); //populate w/zeros
  let nextFrameToChangePs = 0;
  let currPsIx = 0;
  let currPs = 0;
  for (let fIx = 0; fIx < motiveChgByFrameSet.length; fIx++) {
    if (fIx == nextFrameToChangePs) { //if this is a change frame, update the currPs and update all the iterators
      currPs = setOfPitchSetNumbers[currPsIx];
      for (let i = 0; i < 90; i++) psChangeIndicatorStateByFrame[fIx + i] = 1; //update the ps change indicator set
      //UPDATE
      currPsIx++;
      nextFrameToChangePs = nextFrameToChangePs + (rrandInt(24, 37) * FRAMERATE); //change pitch sets every 24-37 seconds
    }
    pitchSetChangesByFrame.push(currPs);
  }
  scoreDataObject.pitchSets = pitchSetChangesByFrame;
  scoreDataObject.psChgIndicator = psChangeIndicatorStateByFrame;


  //##endef CALCULATIONS FOR PITCH SETS



  return scoreDataObject;
} // function generateScoreData() END
//#endef GENERATE SCORE DATA

//#ef SCORE DATA MANAGER


function makeScoreDataManager() {
  // #ef Score Data Manager Panel

  let scoreDataManagerW = 300;
  let scoreDataManagerH = 500;

  let scoreDataManagerPanel = mkPanel({
    w: scoreDataManagerW,
    h: scoreDataManagerH,
    title: 'Score Data Manager',
    ipos: 'right-bottom',
    offsetX: '0px',
    offsetY: '0px',
    autopos: 'none',
    headerSize: 'xs',
    onwindowresize: true,
    contentOverflow: 'hidden',
    clr: 'black',
    onsmallified: function() {
      scoreDataManagerPanel.reposition({
        my: 'right-bottom',
        at: 'right-bottom',
        offsetY: this.h
      })
    },
    onunsmallified: function() {
      scoreDataManagerPanel.reposition({
        my: 'right-bottom',
        at: 'right-bottom',
        offsetY: this.offsetY
      })
    }
  });

  // #endef END Score Data Manager Panel

  // #ef Generate New Score Data Button

  let generateNewScoreDataButton = mkButton({
    canvas: scoreDataManagerPanel.content,
    w: scoreDataManagerW - 44,
    h: 44,
    top: 15,
    left: 15,
    label: 'Generate New Score Data',
    fontSize: 16,
    action: function() {

      scoreData = generateScoreData();
      console.log(scoreData);

    } // action: function() END
  }); // let generateNewScoreDataButton = mkButton( END

  // #endef END Generate New Score Data Button

  // #ef Save Score Data Button

  let saveScoreDataButton = mkButton({
    canvas: scoreDataManagerPanel.content,
    w: scoreDataManagerW - 44,
    h: 44,
    top: scoreDataManagerH - 70,
    left: 15,
    label: 'Save Current Score Data',
    fontSize: 16,
    action: function() {
      console.log(scoreData);
      let scoreDataString = JSON.stringify(scoreData);
      let scoreDataFileName = generateFileNameWdate('sf004');
      downloadStrToHD(scoreDataString, scoreDataFileName, 'text/plain');
    }
  });

  // #endef END Save Score Data Button

  // #ef Load Score Data From File Button

  let loadScoreDataFromFileButton = mkButton({
    canvas: scoreDataManagerPanel.content,
    w: scoreDataManagerW - 44,
    h: 44,
    top: 80,
    left: 15,
    label: 'Load Score Data From File',
    fontSize: 16,
    //https://stackoverflow.com/questions/16215771/how-to-open-select-file-dialog-via-js
    action: function() {
      let inputDOM_finderDialogBox = document.createElement('input');
      inputDOM_finderDialogBox.type = 'file';
      inputDOM_finderDialogBox.onchange = inputEventFromFinderDialogBox => {
        //target=input type='file'; files=FileList
        let file = inputEventFromFinderDialogBox.target.files[0];
        let reader = new FileReader();
        reader.readAsText(file, 'UTF-8');
        reader.onload = readerEvent => {
          let fileTextContent = readerEvent.target.result;
          scoreData = JSON.parse(fileTextContent); //turn loaded string from file into a javascript dictionary/object
          console.log(scoreData);
        }
      }
      inputDOM_finderDialogBox.click();
    }
  });

  // #endef END Load Score Data Button

  //#ef Load Score Data from Server Button

  let loadScoreDataFromServerButton = mkButton({
    canvas: scoreDataManagerPanel.content,
    w: scoreDataManagerW - 44,
    h: 44,
    top: 145,
    left: 15,
    label: 'Load Score Data From Server',
    fontSize: 16,
    action: function() { // Step 1: send msg to server to request list of names of score data files stored on the server
      SOCKET.emit('sf004_loadPieceFromServer', {
        pieceId: PIECE_ID
      });
    }
  });

  // Step 2: Server responds with list of file names
  SOCKET.on('sf004_loadPieceFromServerBroadcast', function(data) {

    let requestingId = data.pieceId;

    if (requestingId == PIECE_ID) {

      let arrayOfFileNamesFromServer = data.availableScoreDataFiles; // data from SOCKET msg
      let arrayOfMenuItems_lbl_action = [];

      arrayOfFileNamesFromServer.forEach((scoreDataFileNameFromServer) => {

        let temp_label_func_Obj = {};

        if (scoreDataFileNameFromServer != '.DS_Store') { //eliminate the ever present Macintosh hidden file .DS_Store

          temp_label_func_Obj['label'] = scoreDataFileNameFromServer;

          // Step 3: When menu item is chosen, this func loads score data to scoreData variable
          temp_label_func_Obj['action'] = function() {

            let tRequest = new XMLHttpRequest();
            tRequest.open('GET', '/scoreData/' + scoreDataFileNameFromServer, true);
            tRequest.responseType = 'text';

            tRequest.onload = () => {
              scoreData = JSON.parse(tRequest.response);
              console.log(scoreData);
            }
            tRequest.onerror = function() {
              console.log("** An error occurred");
            };

            tRequest.send();
          } //temp_label_func_Obj['action'] = function() END

          arrayOfMenuItems_lbl_action.push(temp_label_func_Obj);

        } //if (scoreDataFileNameFromServer != '.DS_Store') end

      }); // arrayOfFileNamesFromServer.forEach((scoreDataFileNameFromServer) END

      // Make Drop Down Menu
      let loadScoreDataFromServerMenu = mkMenu({
        canvas: scoreDataManagerPanel.content,
        w: scoreDataManagerW - 48,
        h: 220,
        top: 207,
        left: 25,
        menuLbl_ActionArray: arrayOfMenuItems_lbl_action
      });
      loadScoreDataFromServerMenu.classList.toggle("show");

    } //if (requestingId == PIECE_ID) end

  }); // SOCKET.on('sf004_loadPieceFromServerBroadcast', function(data) end

  //#endef END Load Score Data from Server Button

  scoreDataManagerPanel.smallify();
} // function makeScoreDataManager() END


//#endef END SCORE DATA MANAGER

//#ef BUILD WORLD


//##ef Make World Panel

function makeWorldPanel() {

  worldPanel = mkPanel({
    w: CANVAS_W,
    h: CANVAS_H,
    title: 'SoundFlow #4',
    onwindowresize: true,
    clr: clr_blueGrey
  });

} // function makeWorldPanel() END

//##endef Make World Panel

//##ef Make ThreeJS Scene


function makeThreeJsScene() {

  SCENE = new THREE.Scene();

  //###ef Camera
  CAMERA = new THREE.PerspectiveCamera(75, RENDERER_W / RENDERER_H, 1, 3000);
  CAMERA.position.set(0, CAM_Y, CAM_Z);
  CAMERA.rotation.x = rads(CAM_ROTATION_X);
  //###endef END Camera

  //###ef Lights
  SUN = new THREE.DirectionalLight(0xFFFFFF, 1.2);
  SUN.position.set(100, 600, 175);
  SCENE.add(SUN);
  SUN2 = new THREE.DirectionalLight(0x40A040, 0.6);
  SUN2.position.set(-100, 350, 200);
  SCENE.add(SUN2);
  //###endef END Lights

  //###ef Renderer
  RENDERER_DIV = mkDivCanvas({
    w: RENDERER_W,
    h: RENDERER_H,
    top: RENDERER_TOP,
    clr: 'black'
  })
  RENDERER_DIV.style.left = RENDERER_DIV_LEFT.toString() + 'px';
  worldPanel.content.appendChild(RENDERER_DIV);

  RENDERER = new THREE.WebGLRenderer();
  RENDERER.setSize(RENDERER_W, RENDERER_H);
  RENDERER_DIV.appendChild(RENDERER.domElement);
  //###endef Renderer

} // function makeThreeJsScene() end


//##endef Make ThreeJS Scene

//##ef Make Runway


function makeRunway() {

  let runwayMaterial =
    new THREE.MeshLambertMaterial({
      color: 0x0040C0,
      side: THREE.DoubleSide
    });

  let runwayGeometry = new THREE.PlaneBufferGeometry(RUNWAY_W, RUNWAY_L, 32);

  let runway = new THREE.Mesh(runwayGeometry, runwayMaterial);

  runway.position.z = -HALF_RUNWAY_LENGTH;
  runway.rotation.x = rads(-90); // at 0 degrees, plane is straight up and down

  SCENE.add(runway);

} //makeRunway() end


//##endef Make Runway

//##ef Make Tracks


function makeTracks() {

  let trackGeometry = new THREE.CylinderBufferGeometry(TRACK_DIAMETER, TRACK_DIAMETER, RUNWAY_L, 32);

  let trackMaterial = new THREE.MeshLambertMaterial({
    color: 0x708090
  });

  xPosOfTracks.forEach((trXpos) => {

    let newTrack = new THREE.Mesh(trackGeometry, trackMaterial);

    newTrack.rotation.x = rads(-90);
    newTrack.position.z = -HALF_RUNWAY_LENGTH;
    newTrack.position.y = -HALF_TRACK_DIAMETER;
    newTrack.position.x = trXpos;

    SCENE.add(newTrack);

  }); // xPosOfTracks.forEach((trXpos) => END

} // makeTracks() END


//##endef Make Tracks

//##ef Make Go Frets


function makeGoFrets() {

  //Make set of go frets: goFrets[]; Make set of GO indicators: goFretsGo[]
  let goFretGeometry = new THREE.BoxBufferGeometry(GO_FRET_W, GO_FRET_H, GO_FRET_L);
  let goFretGoGeometry = new THREE.BoxBufferGeometry(GO_FRET_W + 2, GO_FRET_H + 2, GO_FRET_L + 2);

  xPosOfTracks.forEach((trXpos, trIx) => {

    newGoFret = new THREE.Mesh(goFretGeometry, materialColors[trIx]);

    newGoFret.position.z = GO_Z;
    newGoFret.position.y = GO_FRET_Y;
    newGoFret.position.x = trXpos;
    newGoFret.rotation.x = rads(-14);

    SCENE.add(newGoFret);
    goFrets.push(newGoFret);

    newGoFretGo = new THREE.Mesh(goFretGoGeometry, matl_yellow);

    newGoFretGo.position.z = GO_Z;
    newGoFretGo.position.y = GO_FRET_Y;
    newGoFretGo.position.x = trXpos;
    newGoFretGo.rotation.x = rads(-14);
    newGoFretGo.visible = false;

    SCENE.add(newGoFretGo);
    goFretsGo.push(newGoFretGo);

  }); //xPosOfTracks.forEach((trXpos) END

} //makeGoFrets() end


//##endef Make Go Frets

//##ef Make Tempo Frets
function makeTempoFrets() {

  let tempoFretGeometry = new THREE.BoxBufferGeometry(TEMPO_FRET_W, TEMPO_FRET_H, TEMPO_FRET_L);

  xPosOfTracks.forEach((trXpos, trIx) => {

    let thisTracksTempoFrets = [];

    for (let tFretIx = 0; tFretIx < NUM_TEMPO_FRETS_TO_FILL; tFretIx++) {

      newTempoFret = new THREE.Mesh(tempoFretGeometry, materialColors[trIx]);

      newTempoFret.position.z = GO_Z - TEMPO_FRET_L - (TEMPO_FRET_L * tFretIx);
      newTempoFret.position.y = TEMPO_FRET_Y;
      newTempoFret.position.x = trXpos;
      newTempoFret.rotation.x = rads(-14);

      SCENE.add(newTempoFret);
      newTempoFret.visible = false;
      thisTracksTempoFrets.push(newTempoFret);

    } //for (let i = 0; i < NUM_TEMPO_FRETS_TO_FILL; i++) End

    tempoFretsPerTrack.push(thisTracksTempoFrets);

  }); //xPosOfTracks.forEach((trXpos) END

} //makeTempoFrets() end
//##endef Make Tempo Frets

//##ef Make BBs
function makeBouncingBalls() {

  for (let bbIx = 0; bbIx < NUM_TRACKS; bbIx++) {

    bbSet[bbIx]['div'] = mkDiv({
      canvas: worldPanel.content,
      w: BB_W,
      h: BB_H,
      top: BB_TOP,
      left: RENDERER_DIV_LEFT + BB_PAD_LEFT + ((BB_W + BB_GAP) * bbIx),
      bgClr: 'white'
    });

    bbSet[bbIx]['svgCont'] = mkSVGcontainer({
      canvas: bbSet[bbIx].div,
      w: BB_W,
      h: BB_H,
      x: 0,
      y: 0
    });

    bbSet[bbIx]['bbCirc'] = mkSvgCircle({
      svgContainer: bbSet[bbIx].svgCont,
      cx: BB_CENTER,
      cy: BBCIRC_BOTTOM_CY,
      r: BBCIRC_R,
      fill: TEMPO_COLORS[bbIx],
      stroke: 'white',
      strokeW: 0
    });

    bbSet[bbIx]['bbBouncePadOff'] = mkSvgLine({
      svgContainer: bbSet[bbIx].svgCont,
      x1: 0,
      y1: BB_H - HALF_BB_BOUNCE_WEIGHT,
      x2: BB_W,
      y2: BB_H - HALF_BB_BOUNCE_WEIGHT,
      stroke: 'black',
      strokeW: BB_BOUNCE_WEIGHT
    });

    bbSet[bbIx]['bbBouncePadOn'] = mkSvgLine({
      svgContainer: bbSet[bbIx].svgCont,
      x1: 0,
      y1: BB_H - HALF_BB_BOUNCE_WEIGHT,
      x2: BB_W,
      y2: BB_H - HALF_BB_BOUNCE_WEIGHT,
      stroke: 'yellow',
      strokeW: BB_BOUNCE_WEIGHT + 2
    });
    bbSet[bbIx].bbBouncePadOn.setAttributeNS(null, 'display', 'none');

    bbSet[bbIx]['offIndicator'] = mkSvgRect({
      svgContainer: bbSet[bbIx].svgCont,
      x: 0,
      y: 0,
      w: BB_W,
      h: BB_H,
      fill: 'rgba(173, 173, 183, 0.9)',
    });
    bbSet[bbIx].offIndicator.setAttributeNS(null, 'display', 'none');

  } //for (let bbIx = 0; bbIx < NUM_TRACKS; bbIx++) END

} //makeBouncingBalls() end
//##endef Make BBs

//##ef Make Staff Notation


function makeStaffNotation() {

  //##ef DIV & SVG Containers
  rhythmicNotationObj['div'] = mkDiv({
    canvas: worldPanel.content,
    w: RHYTHMIC_NOTATION_CANVAS_W,
    h: RHYTHMIC_NOTATION_CANVAS_H,
    top: RHYTHMIC_NOTATION_CANVAS_TOP,
    left: RHYTHMIC_NOTATION_CANVAS_L,
    bgClr: 'white'
  });
  rhythmicNotationObj['svgCont'] = mkSVGcontainer({
    canvas: rhythmicNotationObj.div,
    w: RHYTHMIC_NOTATION_CANVAS_W,
    h: RHYTHMIC_NOTATION_CANVAS_H,
    x: 0,
    y: 0
  });
  //##endef DIV & SVG Containers

  //##ef Staff Lines
  let rhythmicNotationStaffLines = [];
  for (let staffIx = 0; staffIx < NUM_STAFFLINES; staffIx++) {
    let tStaffY = TOP_STAFF_LINE_Y + (staffIx * VERT_DIST_BTWN_STAVES);
    let tLine = mkSvgLine({
      svgContainer: rhythmicNotationObj.svgCont,
      x1: 0,
      y1: tStaffY,
      x2: RHYTHMIC_NOTATION_CANVAS_W,
      y2: tStaffY,
      stroke: "black",
      strokeW: 1
    });
    rhythmicNotationStaffLines.push(tLine);
  }
  rhythmicNotationObj['staffLines'] = rhythmicNotationStaffLines;
  //##endef Staff Lines

  //##ef Draw Initial Notation
  // Make all motives and make display:none; Display All Quarters
  //make an SVG for each motive at each beat
  beatCoords.forEach((beatCoordsObj, beatIx) => { //each beat loop

    let tx = beatCoordsObj.x;
    let ty = beatCoordsObj.y;

    // motiveInfoSet = [{ // {path:, lbl:, num:, w:, h:, numPartials:}//used to be notationSvgPaths_labels
    motiveInfoSet.forEach((motiveObj) => { //each motive loop

      let tLabel = motiveObj.lbl;
      let motiveNum = motiveObj.num;
      let tDisp = motiveObj.num == 0 ? 'yes' : 'none'; //initial notation displayed
      // let tDisp = motiveObj.num == 3 ? 'yes' : 'none'; //initial notation displayed

      // Create HTML SVG image
      let tSvgImage = document.createElementNS(SVG_NS, "image");
      tSvgImage.setAttributeNS(XLINK_NS, 'xlink:href', '/pieces/sf004/notationSVGs/motives/' + tLabel + '.svg');
      tSvgImage.setAttributeNS(null, "y", ty - motiveObj.h);
      tSvgImage.setAttributeNS(null, "x", tx);
      tSvgImage.setAttributeNS(null, "visibility", 'visible');
      tSvgImage.setAttributeNS(null, "display", tDisp);
      rhythmicNotationObj.svgCont.appendChild(tSvgImage);

      motivesByBeat[beatIx][motiveNum] = tSvgImage;

    }); //notationSvgPaths_labels.forEach((motiveObj)  END

  }); //beatCoords.forEach((beatCoordsObj) END
  //##endef END Draw Initial Notation

} // makeStaffNotation() END


//##endef Make Staff Notation

//##ef Make Scrolling Tempo Cursors


function makeScrollingTempoCursors() {

  for (let tempoCsrIx = 0; tempoCsrIx < NUM_TEMPOS; tempoCsrIx++) {

    let tLine = mkSvgLine({
      svgContainer: rhythmicNotationObj.svgCont,
      x1: 0,
      y1: HALF_NOTEHEAD_H - NOTATION_CURSOR_H,
      x2: 0,
      y2: HALF_NOTEHEAD_H,
      stroke: TEMPO_COLORS[tempoCsrIx],
      strokeW: NOTATION_CURSOR_STROKE_W
    });
    tLine.setAttributeNS(null, 'stroke-linecap', 'round');
    tLine.setAttributeNS(null, 'display', 'none');
    // tLine.setAttributeNS(null, 'transform', "translate(" + beatCoords[4].x.toString() + "," + beatCoords[4].y.toString() + ")");
    tempoCursors.push(tLine);

  } //for (let tempoCsrIx = 0; tempoCsrIx < NUM_TEMPOS; tempoCsrIx++) END
  // tempoCursors[0].setAttributeNS(null, 'display', 'yes');
  // tempoCursors[0].setAttributeNS(null, 'transform', 'translate(' + beatCoords[3].x.toString() + ',' + beatCoords[3].y.toString() + ')');
} // function makeScrollingTempoCursors() END


//##endef Make Scrolling Tempo Cursors

//##ef Make Scrolling Cursor BBs


function makeScrollingCursorBbs() {
  // scrollingCsrBbsObjSet
  for (let csrBbIx = 0; csrBbIx < NUM_TEMPOS; csrBbIx++) {

    scrollingCsrBbsObjSet[csrBbIx]['ball'] = mkSvgCircle({
      svgContainer: rhythmicNotationObj.svgCont,
      cx: SCRBB_CENTER,
      cy: SCRBBCIRC_TOP_CY,
      r: SCRBBCIRC_R,
      fill: TEMPO_COLORS[csrBbIx],
      stroke: 'white',
      strokeW: 0
    });

    scrollingCsrBbsObjSet[csrBbIx].ball.setAttributeNS(null, 'display', 'none');

  } //for (let csrBbIx = 0; csrBbIx < NUM_TEMPOS; csrBbIx++) END

} //function makeScrollingCursorBbs() END


//##endef Make Scrolling Cursor BBs

//##ef Make Player Tokens
//Make number-of-players worth of tokens for each tempo
function makePlayerTokens() {
  //circle, triangle, diamond, watermellon, square
  for (let tempoIx = 0; tempoIx < NUM_TEMPOS; tempoIx++) {

    let tPlrSet = [];

    for (let playerIx = 0; playerIx < NUM_PLAYERS; playerIx++) {

      let thisPlrTokenObj = mkPlrTkns(rhythmicNotationObj.svgCont, playerIx);

      tPlrSet.push(thisPlrTokenObj);

    } //for (let playerIx = 0; playerIx < NUM_PLAYERS; playerIx++) END

    playerTokens.push(tPlrSet);

  } //for (let tempoIx = 0; tempoIx < NUM_TEMPOS; tempoIx++) END
} //function makePlayerTokens() end
//##endef Make Player Tokens

//##ef Make Signs


function makeSigns() { //Make a collection of possible signs to use each frame; different color each track; a collection for each player

  let signGeometry = new THREE.PlaneBufferGeometry(SIGN_W, SIGN_H, 32);

  for (let plrIx = 0; plrIx < NUM_PLAYERS; plrIx++) {
    let thisPlrsSigns = [];
    xPosOfTracks.forEach((trXpos, trIx) => {

      let thisTracksSigns = [];

      for (let tSignIx = 0; tSignIx < NUM_AVAILABLE_SIGN_MESHES_PER_TRACK; tSignIx++) {

        let signMaterial =
          new THREE.MeshLambertMaterial({
            color: TEMPO_COLORS[trIx],
            side: THREE.DoubleSide,
            opacity: 0.7,
            transparent: true,
          });

        let sign = new THREE.Mesh(signGeometry, signMaterial);

        sign.position.z = GO_Z;
        sign.position.x = trXpos;
        sign.position.y = 0;
        sign.rotation.x = rads(CAM_ROTATION_X);

        SCENE.add(sign);
        sign.visible = false;
        thisTracksSigns.push(sign);

      } //for (let tSignIx = 0; tSignIx < NUM_TEMPO_FRETS_TO_FILL; tSignIx++) end

      thisPlrsSigns.push(thisTracksSigns);

    }); // xPosOfTracks.forEach((trXpos, trIx) end

    signsByPlrByTrack.push(thisPlrsSigns);

  } // for(let plrIx=0;plrIx<NUM_PLAYERS;plrIx++) END

} //makeSigns() end


//##endef Make Signs

//##ef Make Unison Signs


function makeUnisonSigns() { //Make a collection of possible signs to use each frame; different color each track; a collection for each player

  let signGeometry = new THREE.PlaneBufferGeometry(SIGN_W, SIGN_H, 32);

  xPosOfTracks.forEach((trXpos, trIx) => {

    let thisTracksSigns = [];
    let thisTracksOffSigns = [];

    for (let tSignIx = 0; tSignIx < NUM_AVAILABLE_SIGN_MESHES_PER_TRACK; tSignIx++) {

      let signMaterial =
        new THREE.MeshLambertMaterial({
          color: clr_yellow,
          side: THREE.DoubleSide,
          opacity: 0.7,
          transparent: true,
        });

      let sign = new THREE.Mesh(signGeometry, signMaterial);

      sign.position.z = GO_Z;
      sign.position.x = trXpos;
      sign.position.y = 0;
      sign.rotation.x = rads(CAM_ROTATION_X);

      SCENE.add(sign);
      sign.visible = false;
      thisTracksSigns.push(sign);

    } //for (let tSignIx = 0; tSignIx < NUM_TEMPO_FRETS_TO_FILL; tSignIx++) end

    unisonSignsByTrack.push(thisTracksSigns);

    // UNISON OFF SIGNS
    for (let tSignIx = 0; tSignIx < NUM_AVAILABLE_SIGN_MESHES_PER_TRACK; tSignIx++) {

      let signMaterial =
        new THREE.MeshLambertMaterial({
          color: "black",
          side: THREE.DoubleSide,
          opacity: 0.7,
          transparent: true,
        });

      let sign = new THREE.Mesh(signGeometry, signMaterial);

      sign.position.z = GO_Z;
      sign.position.x = trXpos;
      sign.position.y = 0;
      sign.rotation.x = rads(CAM_ROTATION_X);

      SCENE.add(sign);
      sign.visible = false;
      thisTracksOffSigns.push(sign);

    } //for (let tSignIx = 0; tSignIx < NUM_TEMPO_FRETS_TO_FILL; tSignIx++) end

    unisonOffSignsByTrack.push(thisTracksOffSigns);

  }); // xPosOfTracks.forEach((trXpos, trIx) end

} //makeUnisonSigns() end


//##endef Make Unison Signs

//##ef Make Unison Tokens


function makeUnisonToken() {
  unisonToken = mkPlrTkns(rhythmicNotationObj.svgCont, 5);

  // unisonToken.svg.setAttributeNS(null, "display", 'yes');
  // unisonToken.txt.setAttributeNS(null, "display", 'yes');
  // unisonToken.move(beatCoords[11].x, beatCoords[11].y)
}


//##endef Make Unison Tokens

//##ef Make Pitch Sets


function makePitchSets() {

  //###ef DIV & SVG Containers
  pitchSetsObj['div'] = mkDiv({
    canvas: worldPanel.content,
    w: PITCH_SETS_W,
    h: PITCH_SETS_H,
    top: PITCH_SETS_TOP,
    left: PITCH_SETS_LEFT,
    bgClr: 'white'
  });
  pitchSetsObj['svgCont'] = mkSVGcontainer({
    canvas: pitchSetsObj.div,
    w: PITCH_SETS_W,
    h: PITCH_SETS_H,
    x: 0,
    y: 0
  });
  //###endef DIV & SVG Containers

  //###ef Make Pitch Set SVGs
  pitchSetsDictionary.forEach((psObj) => { //each motive loop // pitchSetsDictionary = [{ // {path:,lbl:,num:,w:,h:}

    let tPsNum = psObj.num;
    let tx = PITCH_SETS_CENTER_W - (psObj.w / 2);
    let ty = PITCH_SETS_MIDDLE_H - (psObj.h / 2);

    let tDisplay = tPsNum == 0 ? 'yes' : 'none';
    // let tDisplay = tPsNum == 3 ? 'yes' : 'none';

    // Create HTML SVG image
    let tSvgImage = document.createElementNS(SVG_NS, "image");
    tSvgImage.setAttributeNS(XLINK_NS, 'xlink:href', psObj.path);
    tSvgImage.setAttributeNS(null, "x", tx);
    tSvgImage.setAttributeNS(null, "y", ty);
    tSvgImage.setAttributeNS(null, "visibility", 'visible');
    tSvgImage.setAttributeNS(null, "display", tDisplay);
    pitchSetsObj.svgCont.appendChild(tSvgImage);

    pitchSetsObj.svgs[tPsNum] = tSvgImage;

  }); // pitchSetsDictionary.forEach((psObj) =>  END
  //###endef END Make Pitch Set SVGs

  //###ef Pitch Set Change Indicator
  pitchSetsObj['chgIndicator'] = mkSvgRect({
    svgContainer: pitchSetsObj.svgCont,
    x: 0,
    y: 0,
    w: PITCH_SETS_W,
    h: PITCH_SETS_H,
    fill: 'none',
    stroke: clr_neonMagenta,
    strokeW: 13
  });

  pitchSetsObj['chgIndicator'].setAttributeNS(null, 'display', 'none');
  //###endef END Pitch Set Change Indicator

} // function makePitchSets() END


//##endef Make Pitch Sets

//##ef Make Articulations
function makeArticulations() {
  for (let key in articulationsObj) {

    let artObj = articulationsObj[key];

    let tPath = artObj.path;
    let tLbl = key;
    let tAmt = artObj.amt;
    let tNum = artObj.num;
    let tArtSet = [];

    for (let artIx = 0; artIx < tAmt; artIx++) { // create tAmt number of the same SVG

      let tArt = document.createElementNS(SVG_NS, "image");
      tArt.setAttributeNS(XLINK_NS, 'xlink:href', tPath);
      tArt.setAttributeNS(null, "x", 0);
      tArt.setAttributeNS(null, "y", 2);
      tArt.setAttributeNS(null, "visibility", 'visible');
      tArt.setAttributeNS(null, "display", 'none');
      rhythmicNotationObj.svgCont.appendChild(tArt);

      tArtSet.push(tArt);

    } // for (let artIx = 0; artIx < tAmt; artIx++) END

    articulationsSet[tNum] = tArtSet;

  } // for (let key in articulationsObj) END

} //function makeArticulations()
//##endef Make Articulations


//#endef BUILD WORLD

//#ef WIPE/UPDATE/DRAW


//##ef Tempo Frets WIPE/UPDATE/DRAW

//###ef wipeTempoFrets
function wipeTempoFrets() {
  tempoFretsPerTrack.forEach((arrayOfTempoFretsForOneTrack) => {
    arrayOfTempoFretsForOneTrack.forEach((tTempoFret) => {
      tTempoFret.visible = false;
    });
  });
}
//###endef wipeTempoFrets

//###ef updateTempoFrets
function updateTempoFrets() {

  //###ef Tempo Frets - Frame by Frame Animation Loop
  if (FRAMECOUNT >= 0) {
    scoreData.tempoFretLocations_perTempo.forEach((setOfTempoFretLocsByFrame, tempoIx) => { // A set of locations for each frame for each tempo which loops

      let tempoFretLocationsSetNum = FRAMECOUNT % setOfTempoFretLocsByFrame.length; //adjust frame count for lead in frames and modulo for cycle length

      setOfTempoFretLocsByFrame[tempoFretLocationsSetNum].forEach((loc, tfIx) => { //this goes through the set of tfs that were created at init, only draws the necessary ones and positions them

        tempoFretsPerTrack[tempoIx][tfIx].position.z = loc;
        tempoFretsPerTrack[tempoIx][tfIx].visible = true;

      }); //setOfTempoFretLocsByFrame[tempoFretLocationsSetNum].forEach((loc, tfIx) => END

    }); // scoreData.tempoFretLocations_perTempo.forEach((setOfTempoFretLocsByFrame, tempoIx) => END
  } // if (FRAMECOUNT >= 0) END
  //###endef Tempo Frets - Frame by Frame Animation Loop

  //###ef Tempo Frets - Lead In Frames
  if (FRAMECOUNT < 0) {

    scoreData.leadIn_tempoFretLocations_perTempo.forEach((thisTempo_tfSet, tempoIx) => { // Set of Tempo Frets for each Tempo

      if (-FRAMECOUNT <= thisTempo_tfSet.length) { //FRAMECOUNT is negative; only start lead in set if FRAMECOUNT = the length of lead in tf set for this tempo

        let tfSetIx = thisTempo_tfSet.length + FRAMECOUNT; //count from FRAMECOUNT/thisTempo_tfSet.length and go backwards; ie the first index in set is the furtherest away

        thisTempo_tfSet[tfSetIx].forEach((tfLoc, tfIx) => { //each tf location for this tempo

          tempoFretsPerTrack[tempoIx][tfIx].position.z = tfLoc; //tempoFretsPerTrack is set of tfs already created by tempo
          tempoFretsPerTrack[tempoIx][tfIx].visible = true;

        }); // tempoFrets_leadInFrames_perTempo.forEach((thisTempo_tfSet, tempoIx) => END

      }

    }); //tempoFrets_leadInFrames_perTempo.forEach((thisTempo_tfSet, tempoIx) => END

  } // if (FRAMECOUNT < 0) END
  //###endef Tempo Frets - Lead In Frames

} //function updateTempoFrets()  END
//###endef updateTempoFrets

//##endef Tempo Frets WIPE/UPDATE/DRAW

//##ef GoFrets WIPE/UPDATE/DRAW

//###ef wipeGoFrets
function wipeGoFrets() {
  goFrets.forEach((goFret, fretIx) => {
    goFretsGo[fretIx].visible = false;
  });
}
//###endef wipeGoFrets

//###ef updateGoFrets
function updateGoFrets() {
  if (FRAMECOUNT >= 0) {

    scoreData.goFretsState_perTempo.forEach((goFrmSet, tempoIx) => { // A set of locations for each frame for each tempo which loops

      let goFrmSetIx = FRAMECOUNT % goFrmSet.length;
      let goFrmState = goFrmSet[goFrmSetIx];

      switch (goFrmState) {

        case 0:

          goFrets[tempoIx].visible = true;
          goFretsGo[tempoIx].visible = false;

          break;

        case 1:

          goFrets[tempoIx].visible = false;
          goFretsGo[tempoIx].visible = true;

          break;

      } //switch (goFrmState) END

    }); //goFrameCycles_perTempo.forEach((goFrmSet, tempoIx) => END

  } // if (FRAMECOUNT >= 0) END
} // function updateGoFrets() END
//###endef updateGoFrets

//##endef GoFrets WIPE/UPDATE/DRAW

//##ef BBs WIPE/UPDATE/DRAW

//###ef wipeBBs
function wipeBBs() {
  bbSet.forEach((tbb) => {
    tbb.bbBouncePadOn.setAttributeNS(null, 'display', 'none');
  }); // bbSet.forEach((tbb) =>
} // function wipeBbComplex()
//###endef wipeBBs

// #ef updateBBs
function updateBBs() {

  if (FRAMECOUNT >= 0) {
    scoreData.bbYpos_perTempo.forEach((bbYposSet, tempoIx) => { // Loop: set of goFrames

      let bbYposSetIx = FRAMECOUNT % bbYposSet.length; //adjust current FRAMECOUNT to account for lead-in and loop this tempo's set of goFrames
      let tBbCy = bbYposSet[bbYposSetIx];

      bbSet[tempoIx].bbCirc.setAttributeNS(null, 'cy', tBbCy);
      bbSet[tempoIx].bbCirc.setAttributeNS(null, 'display', 'yes');

    }); // scoreData.bbYpos_perTempo.forEach((bbYposSet, tempoIx) => END
  } // if (FRAMECOUNT >= 0) END
  //
  else if (FRAMECOUNT < 0) {
    scoreData.leadIn_bbYpos_perTempo.forEach((leadInSet, tempoIx) => {

      if (-FRAMECOUNT <= leadInSet.length) {
        let tfSetIx = leadInSet.length + FRAMECOUNT;
        bbSet[tempoIx].bbCirc.setAttributeNS(null, 'cy', leadInSet[tfSetIx]);
      } //  if (-FRAMECOUNT <= leadInSet.length)

    }); // scoreData.leadIn_bbYpos_perTempo.forEach((leadInSet, tempoIx) =>  END
  } // if (FRAMECOUNT >= 0) END

} // function updateBBs() END
//###endef updateBBs

//###ef updateBbBouncePad
function updateBbBouncePad() {
  if (FRAMECOUNT >= 0) {

    scoreData.goFretsState_perTempo.forEach((goFrmSet, tempoIx) => { // A set of locations for each frame for each tempo which loops

      let goFrmSetIx = FRAMECOUNT % goFrmSet.length;
      let goFrmState = goFrmSet[goFrmSetIx];

      switch (goFrmState) {

        case 0:
          bbSet[tempoIx].bbBouncePadOn.setAttributeNS(null, 'display', 'none');
          break;

        case 1:
          bbSet[tempoIx].bbBouncePadOn.setAttributeNS(null, 'display', 'yes');
          break;

      } //switch (goFrmState) END

    }); //goFrameCycles_perTempo.forEach((goFrmSet, tempoIx) => END

  } // if (FRAMECOUNT >= 0) END
} // function updateBbBouncePad() END
//###endef updateBbBouncePad

//##endef BBs WIPE/UPDATE/DRAW

//##ef Scrolling Cursors WIPE/UPDATE/DRAW

//###ef wipeTempoCsrs
function wipeTempoCsrs() {
  tempoCursors.forEach((tempoCsr) => {
    tempoCsr.setAttributeNS(null, 'display', 'none');
  });
}
//###endef END wipeTempoCsrs

//###ef updateScrollingCsrs
function updateScrollingCsrs() {
  if (FRAMECOUNT > 0) { //No lead in motion for scrolling cursors
    scoreData.scrollingCsrCoords_perTempo.forEach((posObjSet, tempoIx) => { // Loop: set of goFrames

      let setIx = FRAMECOUNT % posObjSet.length; //adjust current FRAMECOUNT to account for lead-in and loop this tempo's set of goFrames

      let tX = posObjSet[setIx].x;
      let tY1 = posObjSet[setIx].y1;
      let tY2 = posObjSet[setIx].y2;
      tempoCursors[tempoIx].setAttributeNS(null, 'x1', tX);
      tempoCursors[tempoIx].setAttributeNS(null, 'x2', tX);
      tempoCursors[tempoIx].setAttributeNS(null, 'y1', tY1);
      tempoCursors[tempoIx].setAttributeNS(null, 'y2', tY2);
      tempoCursors[tempoIx].setAttributeNS(null, 'display', 'yes');

    }); //goFrameCycles_perTempo.forEach((bbYposSet, tempoIx) => END
  } // if (FRAMECOUNT > LEAD_IN_FRAMES) END
} // function updateScrollingCsrs() END
//###endef updateScrollingCsrs

//##endef Scrolling Cursors WIPE/UPDATE/DRAW

//##ef Player Tokens WIPE/UPDATE/DRAW

//###ef wipePlayerTokens
function wipePlayerTokens() {
  playerTokens.forEach((thisTemposPlrTokens) => {
    thisTemposPlrTokens.forEach((plrTknObj) => {

      plrTknObj.svg.setAttributeNS(null, 'display', 'none');
      plrTknObj.txt.setAttributeNS(null, 'display', 'none');

    });
  });
}
//###endef wipePlayerTokens

//###ef Update Player Tokens
function updatePlayerTokens() {
  scoreData.playerTokenTempoNum_perPlayer.forEach((playerTokenLocationByFrame, plrIx) => { //{tempoNum}
    if (partsToRun.includes(plrIx)) {
      if (FRAMECOUNT > 0) {

        let setIx = FRAMECOUNT % playerTokenLocationByFrame.length; //adjust current FRAMECOUNT to account for lead-in and loop this tempo's set of goFrames

        let tTempoNum = playerTokenLocationByFrame[setIx];
        let tPlrTokenObj = playerTokens[tTempoNum][plrIx];
        let coordLookUpIx = FRAMECOUNT % scoreData.scrollingCsrCoords_perTempo[tTempoNum].length;
        let tBaseX = scoreData.scrollingCsrCoords_perTempo[tTempoNum][coordLookUpIx].x;
        let tBaseY = scoreData.scrollingCsrCoords_perTempo[tTempoNum][coordLookUpIx].y1;

        tPlrTokenObj.move(tBaseX, tBaseY);
        tPlrTokenObj.svg.setAttributeNS(null, "display", 'yes');
        tPlrTokenObj.txt.setAttributeNS(null, "display", 'yes');
        tPlrTokenObj.svg.setAttributeNS(null, "stroke", TEMPO_COLORS[tTempoNum]);

      } // if (FRAMECOUNT > LEAD_IN_FRAMES) END
    } // function updatePlayerTokens() END
  });
}
//###endef Update Player Tokens

//##endef Player Tokens WIPE/UPDATE/DRAW

//##ef Signs WIPE/UPDATE/DRAW

//###ef wipeSigns
function wipeSigns() {
  signsByPlrByTrack.forEach((arrayOfSignsForThisPlayer) => {
    arrayOfSignsForThisPlayer.forEach((arrayOfSignsForOneTrack) => {
      arrayOfSignsForOneTrack.forEach((tSign) => {
        tSign.visible = false;
      });
    });
  });
}
//###endef wipeSigns

//###ef updateSigns
function updateSigns() { //FOR UPDATE, HAVE TO HAVE DIFFERENT SIZE LOOP FOR EACH PLAYER

  if (FRAMECOUNT >= 0) {
    scoreData.tempoFlagLocs_perPlayer.forEach((tempoFlagLocsByFrame_thisPlr, plrIx) => { //{tempoNum}
      if (partsToRun.includes(plrIx)) {

        let setIx = FRAMECOUNT % tempoFlagLocsByFrame_thisPlr.length;

        if (tempoFlagLocsByFrame_thisPlr[setIx].length > 0) { //if there is a flag on scene,otherwise it will be an empty array

          tempoFlagLocsByFrame_thisPlr[setIx].forEach((signObj, flagIx) => { //a set of objects of flags that are on scene {tempoNum:,zLoc:}

            let tempo_trackNum = signObj.tempoNum;
            let zLoc = signObj.zLoc;
            let tSign = signsByPlrByTrack[plrIx][tempo_trackNum][flagIx]; //3d array- each player has a set of flags for each tempo/track

            tSign.position.z = zLoc;
            tSign.position.x = xPosOfTracks[tempo_trackNum];
            tSign.visible = true;
          });
        } // tempoFlagLocsByFrame_thisPlr.forEach((setOfSignsThisFrame) => END
      }
    }); // if (tempoFlagLocsByFrame_thisPlr[setIx] != -1) END
  } // if (FRAMECOUNT >= 0) END

  //
  else if (FRAMECOUNT < 0) { //lead in
    scoreData.leadIn_tempoFlagLocs_perPlayer.forEach((leadIn_tempoFlagLocs_thisPlr, plrIx) => { //{tempoNum}
      if (partsToRun.includes(plrIx)) {

        if (-FRAMECOUNT <= leadIn_tempoFlagLocs_thisPlr.length) {

          let setIx = leadIn_tempoFlagLocs_thisPlr.length + FRAMECOUNT;

          if (leadIn_tempoFlagLocs_thisPlr[setIx].length > 0) { //if there is a flag on scene,otherwise it will be an empty array
            leadIn_tempoFlagLocs_thisPlr[setIx].forEach((signObj, flagIx) => { //a set of objects of flags that are on scene {tempoNum:,zLoc:}

              let tempo_trackNum = signObj.tempoNum;
              let zLoc = signObj.zLoc;
              let tSign = signsByPlrByTrack[plrIx][tempo_trackNum][flagIx]; //3d array- each player has a set of flags for each tempo/track

              tSign.position.z = zLoc;
              tSign.position.x = xPosOfTracks[tempo_trackNum];
              tSign.visible = true;

            }); // leadIn_tempoFlagLocs_thisPlr[setIx].forEach((signObj, flagIx) => END
          } // if (leadIn_tempoFlagLocs_thisPlr[setIx].length > 0) END

        } // if (-FRAMECOUNT <= leadIn_tempoFlagLocs_thisPlr.length) END

      } // if (partsToRun.includes(plrIx))
    }); // scoreData.leadIn_tempoFlagLocs_perPlayer.forEach((leadIn_tempoFlagLocs_thisPlr, plrIx) =>  END
  } // else if (FRAMECOUNT < 0) END

} // function updateSigns() END
//###endef updateSigns

//##endef Signs WIPE/UPDATE/DRAW

//##ef Unison Signs WIPE/UPDATE/DRAW

//###ef Wipe Unison Signs
function wipeUnisonSigns() {
  unisonSignsByTrack.forEach((arrayOfSignsForOneTrack) => {
    arrayOfSignsForOneTrack.forEach((tSign) => {
      tSign.visible = false;
    });
  });
  unisonOffSignsByTrack.forEach((arrayOfSignsForOneTrack) => {
    arrayOfSignsForOneTrack.forEach((tSign) => {
      tSign.visible = false;
    });
  });
}
//###endef Wipe Unison Signs

//###ef Update Unison Signs
function updateUnisonSigns() { //FOR UPDATE, HAVE TO HAVE DIFFERENT SIZE LOOP FOR EACH PLAYER

  if (FRAMECOUNT >= 0) {

    let setIx = FRAMECOUNT % scoreData.unisonFlagLocs.length;
    if (scoreData.unisonFlagLocs[setIx].length > 0) { //if there is a flag on scene,otherwise it will be an empty array
      scoreData.unisonFlagLocs[setIx].forEach((signObj, flagIx) => { //a set of objects of flags that are on scene {tempoNum:,zLoc:}

        let tempo_trackNum = signObj.tempoNum;
        let zLoc = signObj.zLoc;

        let tSign;
        if (signObj.end) {
          tSign = unisonOffSignsByTrack[tempo_trackNum][flagIx];
        } else {
          tSign = unisonSignsByTrack[tempo_trackNum][flagIx];
        }

        tSign.position.z = zLoc;
        tSign.position.x = xPosOfTracks[tempo_trackNum];
        tSign.visible = true;

      }); // scoreData.unisonFlagLocs[setIx].forEach((signObj, flagIx) => END
    } // if (scoreData.unisonFlagLocs[setIx].length > 0) END
  } // if (FRAMECOUNT >= 0) END
  //
  else if (FRAMECOUNT < 0) {
    if (-FRAMECOUNT <= scoreData.leadIn_unisonFlagLocs.length) {

      let setIx = scoreData.leadIn_unisonFlagLocs.length + FRAMECOUNT;

      if (scoreData.leadIn_unisonFlagLocs[setIx].length > 0) { //if there is a flag on scene,otherwise it will be an empty array
        scoreData.leadIn_unisonFlagLocs[setIx].forEach((signObj, flagIx) => { //a set of objects of flags that are on scene {tempoNum:,zLoc:}

          let tempo_trackNum = signObj.tempoNum;
          let zLoc = signObj.zLoc;

          let tSign;
          if (signObj.end) {
            tSign = unisonOffSignsByTrack[tempo_trackNum][flagIx];
          } else {
            tSign = unisonSignsByTrack[tempo_trackNum][flagIx];
          }

          tSign.position.z = zLoc;
          tSign.position.x = xPosOfTracks[tempo_trackNum];
          tSign.visible = true;

        }); // scoreData.leadIn_unisonFlagLocs[setIx].forEach((signObj, flagIx) => END
      } // if (scoreData.leadIn_unisonFlagLocs[setIx].length > 0) END

    } // if (-FRAMECOUNT <= scoreData.leadIn_unisonFlagLocs.length)
  } // else if (FRAMECOUNT < 0)  END

} // function updateUnisonSigns() END
//###endef Update Unison Signs

//##endef Unison Signs WIPE/UPDATE/DRAW

//##ef Unison Tokens WIPE/UPDATE/DRAW

//###ef Wipe Unison Tokens
function wipeUnisonToken() {
  unisonToken.svg.setAttributeNS(null, 'display', 'none');
  unisonToken.txt.setAttributeNS(null, 'display', 'none');
}
//###endef Wipe Unison Tokens

//###ef Update Unison Tokens
function updateUnisonToken() {
  if (FRAMECOUNT >= 0) {

    let setIx = FRAMECOUNT % scoreData.unisonPlayerTokenTempoNum.length;

    if (scoreData.unisonPlayerTokenTempoNum[setIx] != -1) {

      let tTempoNum = scoreData.unisonPlayerTokenTempoNum[setIx];
      let coordLookUpIx = FRAMECOUNT % scoreData.scrollingCsrCoords_perTempo[tTempoNum].length;
      let tBaseX = scoreData.scrollingCsrCoords_perTempo[tTempoNum][coordLookUpIx].x;
      let tBaseY = scoreData.scrollingCsrCoords_perTempo[tTempoNum][coordLookUpIx].y1;

      unisonToken.move(tBaseX, tBaseY);
      unisonToken.svg.setAttributeNS(null, "display", 'yes');
      unisonToken.txt.setAttributeNS(null, "display", 'yes');
      unisonToken.svg.setAttributeNS(null, "fill", TEMPO_COLORS[tTempoNum]);
      unisonToken.svg.setAttributeNS(null, "stroke", TEMPO_COLORS[tTempoNum]);

    } //if (scoreData.unisonPlayerTokenTempoNum[setIx] != -1)

  } // if (FRAMECOUNT >=0) END
} // function updateUnisonPlayerToken()
//###endef Update Unison Tokens

//##endef Unison Tokens WIPE/UPDATE/DRAW

//##ef Notation WIPE/UPDATE/DRAW

//###ef wipeRhythmicNotation
function wipeRhythmicNotation() {
  if (FRAMECOUNT >= 0) {
    motivesByBeat.forEach((thisBeatsMotiveDic) => { //length=16[{key is motiveNum and stores image}]
      for (let key in thisBeatsMotiveDic) {
        let tMotive = thisBeatsMotiveDic[key];
        tMotive.setAttributeNS(null, 'display', 'none');
      }
    });
  }
}
//###endef wipeRhythmicNotation

//###ef Update Notation
function updateNotation() { //FOR UPDATE, HAVE TO HAVE DIFFERENT SIZE LOOP FOR EACH PLAYER
  if (FRAMECOUNT >= 0) {

    let setIx = FRAMECOUNT % scoreData.motiveSet.length; //adjust current FRAMECOUNT to account for lead-in and loop this tempo's set of goFrames

    scoreData.motiveSet[setIx].forEach((motiveObj, beatNum) => { //a set of objects that are on scene {motiveNum:,articulations:[{articulationType:,x:,y:,partialNum:}

      let t_motiveNum = motiveObj.motiveNum;

      motivesByBeat[beatNum][t_motiveNum].setAttributeNS(null, "display", 'yes');

    }); // scoreData.motiveSet[setIx].forEach((motiveNum, beatNum) => => END

  } // if (FRAMECOUNT >= 0) END
} // function updateNotation() END
//###endef Update Notation

//##endef Notation WIPE/UPDATE/DRAW

//##ef Articulations WIPE/UPDATE/DRAW

//###ef wipeArticulations
function wipeArticulations() {
  articulationsSet.forEach((thisArtImgSet) => {
    thisArtImgSet.forEach((tImg, i) => {
      tImg.setAttributeNS(null, 'display', 'none');
    });
  });
}
//###endef wipeArticulations

//###ef Update Articulations
function updateArticulations() {
  if (FRAMECOUNT >= 0) {

    let setIx = FRAMECOUNT % scoreData.motiveSet.length;
    let articulationsSetIxToUse = 0; //local counter to cycle through all available articulation images

    scoreData.motiveSet[setIx].forEach((motiveObj, beatNum) => { //a set of 16 objects for each beat that are on scene {motiveNum:,articulations:[{articulationType:,x:,y:,partialNum:}

      let t_motiveNum = motiveObj.motiveNum;

      if (t_motiveNum != -1) { //-1 are rests
        motiveObj.articulations.forEach((artObj) => { //{articulationType:,x:,y:,partialNum:}

          let t_artType = artObj.articulationType;
          let tX = artObj.x;
          let tY = artObj.y;

          if (t_artType != -1) {
            articulationsSet[t_artType][articulationsSetIxToUse].setAttributeNS(null, 'transform', "translate(" + tX.toString() + "," + tY.toString() + ")");
            articulationsSet[t_artType][articulationsSetIxToUse].setAttributeNS(null, "display", 'yes');
            articulationsSetIxToUse++;
          } //   if (t_artType != -1)

        }); // motiveObj.forEach((artObj)

      } //if (t_motiveNum != -1)

    }); // scoreData.motiveSet[setIx].forEach((motiveNum, beatNum) => => END

  } // if (FRAMECOUNT >= 0) END
} // function updateArticulations() END
//###endef Update Articulations

//##endef Articulations WIPE/UPDATE/DRAW

//##ef Pitch Sets WIPE/UPDATE/DRAW

//###ef wipePitchSets
function wipePitchSets() {
  if (FRAMECOUNT >= 0) {
    pitchSetsObj.svgs.forEach((thisPsImg) => {
      thisPsImg.setAttributeNS(null, 'display', 'none');
    });
  }
}
//###endef wipePitchSets

//###ef Update Pitch Sets
function updatePitchSets() {
  if (FRAMECOUNT >= 0) {
    let setIx = FRAMECOUNT % scoreData.pitchSets.length;
    pitchSetsObj.svgs[scoreData.pitchSets[setIx]].setAttributeNS(null, "display", 'yes');
  } // if (FRAMECOUNT >= 0) END
} // function updatePitchSets() END
//###endef Update Pitch Sets

//##endef Pitch Sets WIPE/UPDATE/DRAW

//##ef Pitch Set Indicator WIPE/UPDATE/DRAW

//###ef wipePitchSetIndicator
function wipePitchSetIndicator() {
  pitchSetsObj.chgIndicator.setAttributeNS(null, 'display', 'none');
}
//###endef wipePitchSetIndicator

//###ef Update Pitch Set Indicator
function updatePitchSetIndicator() {
  if (FRAMECOUNT >= 0) {
    let setIx = FRAMECOUNT % scoreData.psChgIndicator.length;
    if (scoreData.psChgIndicator[setIx] == 1) pitchSetsObj.chgIndicator.setAttributeNS(null, "display", 'yes');
  } // if (FRAMECOUNT >= 0) END
} // function updatePitchSetIndicator() END
//###endef Update Pitch Set Indicator

//##endef Update Pitch Set Indicator WIPE/UPDATE/DRAW

//##ef Scrolling BBs WIPE/UPDATE/DRAW

//###ef wipeScrBBs
function wipeScrBBs() {
  scrollingCsrBbsObjSet.forEach((scrBbObj) => {
    scrBbObj.ball.setAttributeNS(null, 'display', 'none');
  }); // bbSet.forEach((tbb) =>
} // function wipeBbComplex()
//###endef wipeScrBBs

//###ef updateScrollingBBs
function updateScrollingBBs() {
  if (FRAMECOUNT > 0) { //No lead in motion for scrolling cursors
    scoreData.scrollingCsrCoords_perTempo.forEach((posObjSet, tempoIx) => { // Loop: set of goFrames

      let setIx = FRAMECOUNT % posObjSet.length; //adjust current FRAMECOUNT to account for lead-in and loop this tempo's set of goFrames //scoreData.scrollingCsrCoords_perTempo & scoreData.bbYpos_perTempo arrays are same length so you can just one modulo
      //From scrollingCsrCoords_perTempo:
      let tX = posObjSet[setIx].x;
      let tY1 = posObjSet[setIx].y1;
      let tY2 = posObjSet[setIx].y2;
      //From bbYpos_perTempo:
      let tBbCy = scoreData.bbYpos_perTempo[tempoIx][setIx];

      let tBbCy_norm = (tBbCy - BBCIRC_TOP_CY) / (BBCIRC_BOTTOM_CY - BBCIRC_TOP_CY); //BBCIRC_TOP_CY to BBCIRC_BOTTOM_CY is the distance of the larger bbs; normalize this distance and multiple by the length of the scrolling cursor
      let scrBbY = tY2 - HALF_NOTEHEAD_H + (tBbCy_norm * NOTATION_CURSOR_H);
      let scrBbX = tX + SCRBBCIRC_R + NOTATION_CURSOR_STROKE_W;
      scrollingCsrBbsObjSet[tempoIx].ball.setAttributeNS(null, 'transform', "translate(" + scrBbX.toString() + "," + scrBbY.toString() + ")");
      scrollingCsrBbsObjSet[tempoIx].ball.setAttributeNS(null, 'display', "yes");

    }); //goFrameCycles_perTempo.forEach((bbYposSet, tempoIx) => END
  } // if (FRAMECOUNT > LEAD_IN_FRAMES) END
} // function updateScrollingCsrs() END
//###endef updateScrollingBBs

//##endef Scrolling BBs WIPE/UPDATE/DRAW



//##ef Wipe Function
function wipe() {
  wipeTempoFrets();
  wipeGoFrets();
  wipeBBs();
  wipeTempoCsrs();
  wipePlayerTokens();
  wipeSigns();
  wipeUnisonSigns();
  wipeUnisonToken();
  wipeRhythmicNotation();
  wipeArticulations();
  wipePitchSets();
  wipePitchSetIndicator();
  wipeScrBBs();
} // function wipe() END
//##endef Wipe Function

//##ef Update Function
function update() {
  updateTempoFrets();
  updateGoFrets();
  updateBBs();
  updateBbBouncePad();
  updateScrollingCsrs();
  updatePlayerTokens();
  updateSigns();
  updateUnisonSigns();
  updateUnisonToken();
  updateNotation();
  updateArticulations();
  updatePitchSets();
  updatePitchSetIndicator();
  updateScrollingBBs();
}
//##endef Update Function

//##ef Draw Function
function draw() {
  RENDERER.render(SCENE, CAMERA);
}
//##endef Draw Function


//#endef WIPE/UPDATE/DRAW

//#ef ANIMATION


//##ef Animation Engine
function animationEngine(timestamp) { //timestamp not used; timeSync server library used instead

  let ts_Date = new Date(TS.now()); //Date stamp object from TimeSync library
  let tsNowEpochTime_MS = ts_Date.getTime();
  cumulativeChangeBtwnFrames_MS += tsNowEpochTime_MS - epochTimeOfLastFrame_MS;
  epochTimeOfLastFrame_MS = tsNowEpochTime_MS; //update epochTimeOfLastFrame_MS for next frame

  while (cumulativeChangeBtwnFrames_MS >= MS_PER_FRAME) { //if too little change of clock time will wait until 1 animation frame's worth of MS before updating etc.; if too much change will update several times until caught up with clock time

    if (cumulativeChangeBtwnFrames_MS > (MS_PER_FRAME * FRAMERATE)) cumulativeChangeBtwnFrames_MS = MS_PER_FRAME; //escape hatch if more than 1 second of frames has passed then just skip to next update according to clock

    pieceClock(tsNowEpochTime_MS);
    wipe();
    update();
    draw();

    cumulativeChangeBtwnFrames_MS -= MS_PER_FRAME; //subtract from cumulativeChangeBtwnFrames_MS 1 frame worth of MS until while cond is satisified

  } // while (cumulativeChangeBtwnFrames_MS >= MS_PER_FRAME) END

  if (animationEngineCanRun) requestAnimationFrame(animationEngine); //animation engine gate: animationEngineCanRun
  // if (FRAMECOUNT < 120) requestAnimationFrame(animationEngine); //animation engine gate: animationEngineCanRun
} // function animationEngine(timestamp) END
//##endef Animation Engine END

//##ef Piece Clock
function pieceClock(nowEpochTime) {

  PIECE_TIME_MS = nowEpochTime - startTime_epochTime_MS - LEAD_IN_TIME_MS - pieceClockAdjustment;
  FRAMECOUNT = Math.round((PIECE_TIME_MS / 1000) * FRAMERATE); //Update FRAMECOUNT based on timeSync Time //if in lead-in FRAMECOUNT will be negative
  calcDisplayClock(PIECE_TIME_MS);

}
//##endef Piece Clock


//#endef ANIMATION

//#ef CONTROL PANEL


//##ef Make Control Panel
function makeControlPanel() {

  let controlPanelObj = {};
  let cpDistBtwnButts = CTRLPANEL_BTN_H + CTRLPANEL_MARGIN + 18;

  //###ef Control Panel Panel
  let controlPanelPanel = mkPanel({
    w: CTRLPANEL_W,
    h: CTRLPANEL_H,
    title: 'sf004 Control Panel',
    ipos: 'left-top',
    offsetX: '0px',
    offsetY: '0px',
    autopos: 'none',
    headerSize: 'xs',
    onwindowresize: true,
    contentOverflow: 'hidden',
    clr: 'black'
  });
  controlPanelObj['panel'] = controlPanelPanel;
  //###endef Control Panel Panel


  //###ef Start Piece Button
  let startButton = mkButton({
    canvas: controlPanelPanel.content,
    w: CTRLPANEL_BTN_W,
    h: CTRLPANEL_BTN_H,
    top: CTRLPANEL_MARGIN,
    left: CTRLPANEL_MARGIN,
    label: 'Start',
    fontSize: 14,
    action: function() {
      markStartTime_startAnimation();
    }
  });
  controlPanelObj['startBtn'] = startButton;
  //###endef Start Piece Button

  //###ef Restart Button
  makeRestartButton = function() {
    let restartButton = mkButton({
      canvas: controlPanelPanel.content,
      w: CTRLPANEL_BTN_W,
      h: CTRLPANEL_BTN_H,
      top: CTRLPANEL_MARGIN,
      left: CTRLPANEL_MARGIN,
      label: 'Restart?',
      fontSize: 13,
      action: function() {
        restartBtnFunc();
      }
    });
    restartButton.className = 'btn btn-1';
    controlPanelObj['restartBtn'] = restartButton;
  }
  //###endef Restart Button

  //###ef Pause Button
  let pauseButton = mkButton({
    canvas: controlPanelPanel.content,
    w: CTRLPANEL_BTN_W,
    h: CTRLPANEL_BTN_H,
    top: CTRLPANEL_MARGIN + cpDistBtwnButts,
    left: CTRLPANEL_MARGIN,
    label: 'Pause',
    fontSize: 14,
    action: function() {
      pauseBtnFunc();
    }
  });
  pauseButton.className = 'btn btn-1_inactive';
  controlPanelObj['pauseBtn'] = pauseButton;
  //###endef Pause Button

  //###ef Stop Button
  let stopButton = mkButton({
    canvas: controlPanelPanel.content,
    w: CTRLPANEL_BTN_W,
    h: CTRLPANEL_BTN_H,
    top: CTRLPANEL_MARGIN + (cpDistBtwnButts * 2),
    left: CTRLPANEL_MARGIN,
    label: 'Stop',
    fontSize: 14,
    action: function() {
      stopBtnFunc();
    }
  });
  stopButton.className = 'btn btn-1_inactive';
  controlPanelObj['stopBtn'] = stopButton;
  //###endef Stop Button

  //###ef GoTo Input Fields & Button

  let goToField_w = 18;
  let goToField_h = 18;
  let goToField_top = CTRLPANEL_MARGIN + (cpDistBtwnButts * 3) + 18;
  let goToField_left = CTRLPANEL_W - CTRLPANEL_MARGIN - goToField_w - 4;

  //###ef GoTo Input Fields
  let goTo_secondsInput = mkInputField({
    canvas: controlPanelPanel.content,
    id: 'gotoSecInput',
    w: goToField_w,
    h: goToField_h,
    top: goToField_top,
    left: goToField_left,
    fontSize: 15,
  }); // let goTo_secondsInput = mkInputField
  goTo_secondsInput.style.textAlign = 'right';
  goTo_secondsInput.value = 0;
  controlPanelObj['gotoSecInput'] = goTo_secondsInput;
  goTo_secondsInput.addEventListener("blur", function(e) { //function for when inputfield loses focus; make sure the number is between 0-59
    if (goTo_secondsInput.value > 59) goTo_secondsInput.value = 59;
    if (goTo_secondsInput.value < 0) goTo_secondsInput.value = 0;
  });
  goTo_secondsInput.addEventListener("click", function(e) { // selects text when clicked
    this.select();
  });

  let goTo_minutesInput = mkInputField({
    canvas: controlPanelPanel.content,
    id: 'gotoMinInput',
    w: goToField_w,
    h: goToField_h,
    top: goToField_top,
    left: goToField_left - goToField_w - 10,
    fontSize: 15,
  }); // let goTo_minutesInput = mkInputField
  goTo_minutesInput.style.textAlign = 'right';
  goTo_minutesInput.value = 0;
  controlPanelObj['gotoMinInput'] = goTo_minutesInput;
  goTo_minutesInput.addEventListener("blur", function(e) { //function for when inputfield loses focus; make sure the number is between 0-59
    if (goTo_minutesInput.value > 59) goTo_minutesInput.value = 59;
    if (goTo_minutesInput.value < 0) goTo_minutesInput.value = 0;
  });
  goTo_minutesInput.addEventListener("click", function(e) { // selects text when clicked
    this.select();
  });

  let goTo_hoursInput = mkInputField({
    canvas: controlPanelPanel.content,
    id: 'gotoHrInput',
    w: goToField_w,
    h: goToField_h,
    top: goToField_top,
    left: goToField_left - goToField_w - 10 - goToField_w - 10,
    fontSize: 15,
  }); // let goTo_hoursInput = mkInputField
  goTo_hoursInput.style.textAlign = 'right';
  goTo_hoursInput.value = 0;
  controlPanelObj['gotoHrInput'] = goTo_hoursInput;
  goTo_hoursInput.addEventListener("blur", function(e) { //function for when inputfield loses focus; make sure the number is between 0-59
    if (goTo_hoursInput.value < 0) goTo_hoursInput.value = 0;
  });
  goTo_hoursInput.addEventListener("click", function(e) { // selects text when clicked
    this.select();
  });
  //###endef GoTo Input Fields

  //###ef GoTo Button
  let gotoButton = mkButton({
    canvas: controlPanelPanel.content,
    w: CTRLPANEL_BTN_W,
    h: CTRLPANEL_BTN_H,
    top: goToField_top + goToField_h + 11,
    left: CTRLPANEL_MARGIN,
    label: 'Go To',
    fontSize: 14,
    action: function() {
      gotoBtnFunc();
    }
  });
  gotoButton.className = 'btn btn-1_inactive';
  controlPanelObj['gotoBtn'] = gotoButton;
  //###endef GoTo Button

  //###endef GoTo Input Fields & Button

  //##ef Piece ID Caption
  let pieceIdDisplayLbl = mkSpan({
    canvas: controlPanelPanel.content,
    top: CTRLPANEL_MARGIN + (cpDistBtwnButts * 3) + 18 + 18 + 11 + cpDistBtwnButts + 4,
    left: CTRLPANEL_MARGIN + 11,
    text: 'Piece ID:',
    fontSize: 13,
    color: 'white'
  });
  let pieceIdDisplay = mkSpan({
    canvas: controlPanelPanel.content,
    top: CTRLPANEL_MARGIN + (cpDistBtwnButts * 3) + 18 + 18 + 11 + cpDistBtwnButts + 4 + 15,
    left: CTRLPANEL_MARGIN + 11,
    text: PIECE_ID.toString(),
    fontSize: 13,
    color: 'white'
  });
  //##endef Piece ID Caption

  //###ef Join Button
  let joinButton = mkButton({
    canvas: controlPanelPanel.content,
    w: CTRLPANEL_BTN_W,
    h: CTRLPANEL_BTN_H,
    top: CTRLPANEL_H - CTRLPANEL_BTN_H - CTRLPANEL_MARGIN - CTRLPANEL_BTN_W - 15,
    left: CTRLPANEL_MARGIN,
    label: 'Join',
    fontSize: 14,
    action: function() {
      joinBtnFunc();
    }
  });
  joinButton.className = 'btn btn-1';
  controlPanelObj['joinBtn'] = joinButton;
  //###endef Join Button

  //###ef Join Go Button
  let joinGoButton = mkButton({
    canvas: controlPanelPanel.content,
    w: CTRLPANEL_BTN_W,
    h: CTRLPANEL_BTN_H,
    top: CTRLPANEL_H - CTRLPANEL_BTN_H - CTRLPANEL_MARGIN - 21,
    left: CTRLPANEL_MARGIN,
    label: 'Go',
    fontSize: 14,
    action: function() {
      joinGoBtnFunc();
    }
  });
  joinGoButton.className = 'btn btn-1_inactive';
  controlPanelObj['joinGoBtn'] = joinGoButton;
  //###endef Join Go Button

  if (!scoreControlsAreOn) {
    startBtn_isActive = false;
    startButton.className = 'btn btn-1_inactive';
  }

  return controlPanelObj;

} // function makeControlPanel() END
//##endef Make Control Panel

//##ef Start Piece Button Function & Socket
// Broadcast Start Time when Start Button is pressed
// This function is run from the start button above in Make Control Panel
let markStartTime_startAnimation = function() {
  if (startBtn_isActive) {

    let ts_Date = new Date(TS.now());
    let t_startTime_epoch = ts_Date.getTime(); //send your current time to server to relay as the start time for everyone when received back from server

    // Send start time to server to broadcast to rest of players
    SOCKET.emit('sf004_newStartTimeBroadcast_toServer', {
      pieceId: PIECE_ID,
      startTime_epochTime_MS: t_startTime_epoch,
      pieceClockAdjustment: pieceClockAdjustment,
      pauseState: pauseState,
      timePaused: timePaused
    });

  } // if (startBtn_isActive)
} // let markStartTime = function() END

//START PIECE RECEIVE SOCKET FROM SERVER BROADCAST
// Receive new start time from server broadcast and set startTime_epochTime_MS
SOCKET.on('sf004_newStartTime_fromServer', function(data) {
  if (data.pieceId == PIECE_ID) {
    console.log(data.serverSidePieceData);
    if (piece_canStart) { //Gate so the start functions aren't activated inadverently

      piece_canStart = false;
      startBtn_isActive = false;
      scoreCtrlPanel.startBtn.className = 'btn btn-1_inactive';
      if (scoreControlsAreOn) {
        stopBtn_isActive = true;
        scoreCtrlPanel.stopBtn.className = 'btn btn-1';
        pauseBtn_isActive = true; //activate pause button
        scoreCtrlPanel.pauseBtn.className = 'btn btn-1'; //activate pause button
        gotoBtn_isActive = true;
        scoreCtrlPanel.gotoBtn.className = 'btn btn-1';
      }
      joinBtn_isActive = false;
      scoreCtrlPanel.joinBtn.className = 'btn btn-1_inactive';
      animationEngineCanRun = true; //unlock animation gate


      scoreCtrlPanel.panel.smallify(); //minimize control panel when start button is pressed

      startTime_epochTime_MS = data.startTime_epochTime_MS; //stamp start time of this piece with timestamp relayed from server
      epochTimeOfLastFrame_MS = data.startTime_epochTime_MS; //update epochTimeOfLastFrame_MS so animation engine runs properly

      requestAnimationFrame(animationEngine); //kick off animation

    } // if (piece_canStart)
  } //if (data.pieceId == PIECE_ID)
}); // SOCKET.on('sf004_newStartTime_fromServer', function(data) END
//##endef Start Piece function & socket

//##ef Pause Button Function & Socket
// This function is run from the pause button above in Make Control Panel
let pauseBtnFunc = function() {
  if (pauseBtn_isActive) { //gate

    //increment the pause state here locally, but don't update global variable pauseState until received back from server
    let thisPress_pauseState = (pauseState + 1) % 2; //pause button is a toggle, change state each time it is pressed
    let tsNow_Date = new Date(TS.now());
    let timeAtPauseBtnPress_MS = tsNow_Date.getTime(); //timeAtPauseBtnPress_MS

    if (thisPress_pauseState == 1) { //Paused
      SOCKET.emit('sf004_pause', {
        pieceId: PIECE_ID,
        thisPress_pauseState: thisPress_pauseState,
        timeAtPauseBtnPress_MS: timeAtPauseBtnPress_MS,
        new_pieceClockAdjustment: pieceClockAdjustment //only used for unpause
      });
    } // if (pauseState == 1) { //Paused
    //
    else if (thisPress_pauseState == 0) { //unpaused

      let tsNow_Date = new Date(TS.now());
      let t_currTime_MS = tsNow_Date.getTime();
      //For here and in goto, you want the pieceClockAdjustment to be the same for all clients
      //Calculate here before sending to server to broadcast, and when received, set this number to pieceClockAdjustment for everyone
      let new_pieceClockAdjustment = t_currTime_MS - timePaused + pieceClockAdjustment; //t_currTime_MS - timePaused will be the amount of time to subtract off current time to get back to time when the piece was paused; + pieceClockAdjustment to add to any previous addjustments

      SOCKET.emit('sf004_pause', {
        pieceId: PIECE_ID,
        thisPress_pauseState: thisPress_pauseState,
        timeAtPauseBtnPress_MS: timeAtPauseBtnPress_MS,
        new_pieceClockAdjustment: new_pieceClockAdjustment
      });
    } // else if (pauseState == 0) { //unpaused

  } // if (pauseBtn_isActive)
} //let pauseBtnFunc = function()

//PAUSE PIECE RECEIVE SOCKET FROM SERVER BROADCAST
SOCKET.on('sf004_pause_broadcastFromServer', function(data) {

  let requestingId = data.pieceId;
  let thisPress_pauseState = data.thisPress_pauseState;
  let timeAtPauseBtnPress_MS = data.timeAtPauseBtnPress_MS;
  let new_pieceClockAdjustment = data.new_pieceClockAdjustment;

  if (requestingId == PIECE_ID) {

    if (thisPress_pauseState == 1) { //paused
      timePaused = timeAtPauseBtnPress_MS; //update local global variables //store in server
      pauseState = thisPress_pauseState; //store in server for join
      animationEngineCanRun = false;
      if (scoreControlsAreOn) {
        scoreCtrlPanel.pauseBtn.innerText = 'Resume';
        scoreCtrlPanel.pauseBtn.className = 'btn btn-2';
      }
    } //if (pauseState == 1) { //paused
    //
    else if (thisPress_pauseState == 0) { //unpaused
      pauseState = thisPress_pauseState;
      pieceClockAdjustment = new_pieceClockAdjustment; //t_currTime_MS - timePaused will be the amount of time to subtract off current time to get back to time when the piece was paused; + pieceClockAdjustment to add to any previous addjustments
      if (scoreControlsAreOn) {
        scoreCtrlPanel.pauseBtn.innerText = 'Pause';
        scoreCtrlPanel.pauseBtn.className = 'btn btn-1';
      }
      scoreCtrlPanel.panel.smallify();
      animationEngineCanRun = true;
      requestAnimationFrame(animationEngine);
    } //else if (pauseState == 0) { //unpaused

  } //if (requestingId == PIECE_ID)

}); // SOCKET.on('sf004_pauseBroadcast', function(data)

//##endef Pause Button Function & Socket

//##ef Stop Piece Button Function & Socket

let stopBtnFunc = function() {
  if (stopBtn_isActive) {

    // Send stop command to server to broadcast to rest of players
    SOCKET.emit('sf004_stop', { //stop also deletes this pieceId's score data on the server
      pieceId: PIECE_ID,
    });

  } // if (startBtn_isActive)
} // stopBtnFunc = function() END

//STOP PIECE RECEIVE SOCKET FROM SERVER BROADCAST
SOCKET.on('sf004_stop_broadcastFromServer', function(data) {
  if (data.pieceId == PIECE_ID) {
    location.reload();
  } //if (data.pieceId == PIECE_ID)
}); // SOCKET.on('sf004_stop_broadcastFromServer', function(data) END

//##endef Stop Piece Button Function & Socket

//##ef Goto Button Function & Socket

let gotoBtnFunc = function() {
  if (gotoBtn_isActive) { //gate

    //Get Goto time and convert to MS
    let goToTimeMS = (scoreCtrlPanel.gotoHrInput.value * 60 * 60 * 1000) + (scoreCtrlPanel.gotoMinInput.value * 60 * 1000) + (scoreCtrlPanel.gotoSecInput.value * 1000);
    let tsNow_Date = new Date(TS.now());
    let t_currTime_MS = tsNow_Date.getTime();
    let timeAdjustmentToGetToGotoTime = PIECE_TIME_MS - goToTimeMS;
    //For here and in pause, you want the pieceClockAdjustment to be the same for all clients
    //Calculate here before sending to server to broadcast, and when received, set this number to pieceClockAdjustment for everyone
    let newPieceClockAdjustment = pieceClockAdjustment + timeAdjustmentToGetToGotoTime;

    SOCKET.emit('sf004_goto', {
      pieceId: PIECE_ID,
      newPieceClockAdjustment: newPieceClockAdjustment
    });

  } // if (gotoBtn_isActive)
} // gotoBtnFunc = function()

//PAUSE PIECE RECEIVE SOCKET FROM SERVER BROADCAST
SOCKET.on('sf004_goto_broadcastFromServer', function(data) {

  let requestingId = data.pieceId;
  let newPieceClockAdjustment = data.newPieceClockAdjustment;

  if (requestingId == PIECE_ID) {
    pieceClockAdjustment = newPieceClockAdjustment;
    scoreCtrlPanel.panel.smallify();
  } //if (requestingId == PIECE_ID)

}); // SOCKET.on('sf004_goto_broadcastFromServer', function(data)

//##endef Goto Button Function & Socket

//##ef Join Button Function & Socket

let joinBtnFunc = function() {
  if (joinBtn_isActive) {

    // Send stop command to server to broadcast to rest of players
    SOCKET.emit('sf004_join', {
      pieceId: PIECE_ID,
    });

  } // if (joinBtn_isActive)
} // joinBtnFunc = function() END

//STOP PIECE RECEIVE SOCKET FROM SERVER BROADCAST
SOCKET.on('sf004_join_broadcastFromServer', function(data) {
  if (data.pieceId == PIECE_ID) {
    if (piece_canStart) { //since this is broadcast all players receive; if your score is started then you won't get this join info

      //Deactivate Start Button
      piece_canStart = false;
      startBtn_isActive = false;
      scoreCtrlPanel.startBtn.className = 'btn btn-1_inactive';

      //Populate the synced data
      startTime_epochTime_MS = data.startTime_epochTime_MS;
      pieceClockAdjustment = data.pieceClockAdjustment;
      pauseState = data.pauseState;
      timePaused = data.timePaused;

      //Activate Go Button
      scoreCtrlPanel.joinGoBtn.className = 'btn btn-1';
      joinGoBtn_isActive = true;

    } //  if (piece_canStart) { //since this is broadcast all players receive; if your score is started then you won't get this join info
  } //if (data.pieceId == PIECE_ID)
}); // SOCKET.on('sf004_join_broadcastFromServer', function(data) END

//JOIN GO BUTTON FUNCTION
let joinGoBtnFunc = function() {
  if (joinGoBtn_isActive) {

    piece_canStart = false;
    startBtn_isActive = false;
    scoreCtrlPanel.startBtn.className = 'btn btn-1_inactive';
    if (scoreControlsAreOn) {
      stopBtn_isActive = true;
      scoreCtrlPanel.stopBtn.className = 'btn btn-1';
      pauseBtn_isActive = true; //activate pause button
      scoreCtrlPanel.pauseBtn.className = 'btn btn-1'; //activate pause button
      gotoBtn_isActive = true;
      scoreCtrlPanel.gotoBtn.className = 'btn btn-1';
    }
    joinBtn_isActive = false;
    joinGoBtn_isActive = false;
    scoreCtrlPanel.joinBtn.className = 'btn btn-1_inactive';

    scoreCtrlPanel.joinGoBtn.className = 'btn btn-1_inactive';

    animationEngineCanRun = true; //unlock animation gate


    scoreCtrlPanel.panel.smallify(); //minimize control panel when start button is pressed

    epochTimeOfLastFrame_MS = startTime_epochTime_MS

    requestAnimationFrame(animationEngine); //kick off animation

  } // if (joinGoBtn_isActive)
} // joinGoBtnFunc = function() END

//##endef Join Button Function & Socket

//##ef Restart Piece Button Function & Socket

//RESTART PIECE PREP RECEIVE SOCKET FROM SERVER BROADCAST
//If the pieceId already exsists on the server, when you press start, nothing happens except you get back sf004_restartPrep_fromServer
SOCKET.on('sf004_restartPrep_broadcastFromServer', function(data) {
  if (data.pieceId == PIECE_ID) {
    //deactivate start button and create restart button
    if (scoreControlsAreOn) {
      startBtn_isActive = false;
      scoreCtrlPanel.startBtn.className = 'btn btn-1_inactive';
      makeRestartButton();
    }
  } //if (data.pieceId == PIECE_ID)
}); // SOCKET.on('sf004_stop_broadcastFromServer', function(data) END

let restartBtnFunc = function() {
  if (restartBtn_isActive) {

    let ts_Date = new Date(TS.now());
    let t_startTime_epoch = ts_Date.getTime(); //send your current time to server to relay as the start time for everyone when received back from server

    // Send start time to server to broadcast to rest of players
    SOCKET.emit('sf004_restart', {
      pieceId: PIECE_ID,
      startTime_epochTime_MS: t_startTime_epoch,
      pieceClockAdjustment: pieceClockAdjustment,
      pauseState: pauseState,
      timePaused: timePaused
    }); //SOCKET.emit('sf004_restart'

  } // if (restartBtn_isActive)
} // restartBtnFunc = function() END

SOCKET.on('sf004_restart_broadcastFromServer', function(data) {
  if (data.pieceId == PIECE_ID) {
    console.log(data.serverSidePieceData);
    if (piece_canStart) { //Gate so the start functions aren't activated inadverently

      piece_canStart = false;
      if (scoreControlsAreOn) {
        restartBtn_isActive = false;
        scoreCtrlPanel.restartBtn.className = 'btn btn-1_inactive';
        stopBtn_isActive = true;
        scoreCtrlPanel.stopBtn.className = 'btn btn-1';
        pauseBtn_isActive = true; //activate pause button
        scoreCtrlPanel.pauseBtn.className = 'btn btn-1'; //activate pause button
        gotoBtn_isActive = true;
        scoreCtrlPanel.gotoBtn.className = 'btn btn-1';
      }
      joinBtn_isActive = false;
      scoreCtrlPanel.joinBtn.className = 'btn btn-1_inactive';

      animationEngineCanRun = true; //unlock animation gate
      scoreCtrlPanel.panel.smallify(); //minimize control panel when start button is pressed

      startTime_epochTime_MS = data.startTime_epochTime_MS; //stamp start time of this piece with timestamp relayed from server
      epochTimeOfLastFrame_MS = data.startTime_epochTime_MS; //update epochTimeOfLastFrame_MS so animation engine runs properly

      requestAnimationFrame(animationEngine); //kick off animation

    } // if (piece_canStart)
  } //if (data.pieceId == PIECE_ID)
}); // SOCKET.on('sf004_restart_broadcastFromServer' END

//##endef Restart Piece Button Function & Socket

//#endef CONTROL PANEL

//#ef CLOCK
function makeClock() {
  displayClock = mkPanel({
    w: 66,
    h: 20,
    // w: 57,
    // h: 18,
    title: 'Clock',
    ipos: 'right-top',
    // offsetX: '97px',
    // offsetY: '207px',
    clr: 'white',
    onwindowresize: true
  })
  displayClock.content.style.fontSize = "16px";
  // displayClock.content.style.fontSize = "14px";
  displayClock.smallify();
}

function calcDisplayClock(pieceTimeMS) {
  let displayClock_TimeMS = pieceTimeMS % 1000;
  let displayClock_TimeSec = Math.floor(pieceTimeMS / 1000) % 60;
  let displayClock_TimeMin = Math.floor(pieceTimeMS / 60000) % 60;
  let displayClock_TimeHrs = Math.floor(pieceTimeMS / 3600000);
  displayClock.content.innerHTML = pad(displayClock_TimeHrs, 2) + ":" + pad(displayClock_TimeMin, 2) + ":" + pad(displayClock_TimeSec, 2);
}
//#endef CLOCK



*/





//

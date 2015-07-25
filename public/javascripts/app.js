//************* PROJECT INFORMATION *************

/*************
 * Author: Christopher Dancarlo Danan
 * Created: July 14, 2015
 * Modified: July 24, 2015
 * Purpose: Game logic for Lights Out clone project.
*************/

//************* GLOBAL VARIABLES *************

//Levels.
var levelOne = [33, 34, 35, 43, 44, 45, 53, 54, 55],  //1 move to solve.
	levelTwo = [0, 1, 10, 11, 8, 9, 18, 19, 88, 89, 98, 99, 80, 81, 90, 91],  //4 moves to solve.
	levelThree = [31, 32, 33, 34, 35, 36, 37, 38, 41, 42, 43, 44, 45, 46, 47, 48, 51, 52, 53, 54, 55, 56, 57, 58],  //10  moves to solve.
	levelFour = [0, 1, 2, 7, 8, 9, 10, 13, 16, 19, 20, 23, 26, 29, 31, 32, 33, 36, 37, 38, 43, 46, 53, 56, 63, 66, 70, 71, 72, 77, 78, 79, 82, 87, 92, 97],  //10 moves to solve.
	levelFive = [11, 12, 17, 18, 30, 32, 37, 39, 40, 42, 47, 49, 50, 52, 57, 59, 70, 71, 72, 77, 78, 79, 82, 83, 86, 87, 92, 93, 96, 97],  //16 moves to solve.
	currentLevel = 1;  //Default start at level 1.

//Sounds.
//One way to play the same sound simultaneously is to create duplicates of the sound, stick them into an array, and play them round-robin style.
// I would've prefered something more simple, but so far my research on the Internet provides no better results, as the previous method resulted in
// numerous warnings popping out in the developer's console.
//I did read about something called the Web Audio API, but it seems that it is not widely implemented in all browsers as of now.
var clickBeep1 = new Audio("assets/sounds/Beep_Click_Cell.m4a"),  //Used whenever player clicks a cell.
	clickBeep2 = new Audio("assets/sounds/Beep_Click_Cell.m4a"),  //Have multiple instances of the same sound in order to have it play while a previous iteration is still playing.
	clickBeep3 = new Audio("assets/sounds/Beep_Click_Cell.m4a"),
	clickBeep4 = new Audio("assets/sounds/Beep_Click_Cell.m4a"),
	clickBeep5 = new Audio("assets/sounds/Beep_Click_Cell.m4a");  
var clickBeepID = 0;  //Keeps track of which clickBeep is currently playing in array.
var clickBeepArr = [clickBeep1, clickBeep2, clickBeep3, clickBeep4, clickBeep5];  //Play sounds round-robin style to simulate 

var secret = new Audio("assets/sounds/Vane_Easter_Egg.m4a");  //Used for easter egg.

var buttonClick = new Audio("assets/sounds/buttonClick.wav");
buttonClick.volume = 0.8;

var winSound = new Audio("assets/sounds/reward.mp3");  //downloaded from flashkit.com - created by Mark E. Buckland.

//Most recent move made by the player.
var lastClicked;

//Boolean to determine if sounds are muted or not.
var mute = false;

//************* FUNCTIONS *************

//References: 	http://stackoverflow.com/questions/6893080/html5-audio-play-sound-repeatedly-on-click-regardless-if-previous-iteration-h
//				https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#Older_way_to_register_event_listeners

/*************
 * Purpose: Toggle the cell passed into the function "on" or "off".
 * Input:
 			-id: The id of the cell that is being toggled. Only integer numbers should be passed in.
 * Output: The cell's class will be switched to the opposite of it's previous state (i.e. class will read "on" or "off").
*************/
var toggle = function(id){
	$("#" + id).toggleClass("off");
	$("#" + id).toggleClass("on");
};

/*************
 * Purpose: Calculate the cells that are affected by a click and toggle them.
 * Input: 
 			-clickedID: the id of the cell that is clicked.
 * Output: The clicked cell and the surrounding cells are toggled on/off.
*************/
var toggleCells = function(clickedID){
	var leftID = clickedID - 1,
		rightID = clickedID + 1,
		topID = clickedID - local_data_cols,
		bottomID = clickedID + local_data_cols,
		topLeftID = topID - 1,
		topRightID = topID + 1,
		bottomLeftID = bottomID - 1,
		bottomRightID = bottomID + 1;

	//Toggle the clicked cell on/off.
	toggle(clickedID);

	//Toggle the surrounding cells on/off:
	//Left side
	//The if-statement prevents wrapped cells from being activated.
	if(leftID % local_data_cols !== (local_data_cols - 1) &&
		topLeftID % local_data_cols !== (local_data_cols - 1) &&
		bottomLeftID % local_data_cols !== (local_data_cols - 1)){
		toggle(leftID);
		toggle(topLeftID);
		toggle(bottomLeftID);
	}

	//Middle
	toggle(topID);
	toggle(bottomID);

	//Right side
	//The if-statement prevents wrapped cells from being activated.
	if(rightID % local_data_cols !== 0 &&
		topRightID % local_data_cols !== 0 &&
		bottomRightID % local_data_cols !== 0){
		toggle(rightID);
		toggle(topRightID);
		toggle(bottomRightID);
	}
};

/*************
 * Purpose: Check if the board is in a win state.
 * Input: None.
 * Output: Return true if the player won, else return false.
*************/
var win = function(){
	var cellsOn = $(".on");  //Array to hold all cells with class "on"; if array is empty, then all cells are off (i.e. player won the game).

	if(cellsOn.length === 0){
		return true;
	} else{
		return false;
	}
};

/*************
 * Purpose: Configure the game board based on the level.
 * Input:
 			-level: the level to be loaded, stored as an array with cellIDs that are to be turned on.
 * Output: The game board is configured.
*************/
var loadLevel = function(level){
	level.forEach(function(cellID){
		toggle(cellID);
	});
};

/*************
 * Purpose: Turn all cells on the board on or off.
 * Input:
 			-off: Boolean - if true, turn off all cells; if false, turn on all cells.
 * Output: All cells are turned on or off.
*************/
var turnCellsOff = function(off){
	if(off){
		for(var i = 0; i < local_data_numCells; i++){
			if($("#" + i).hasClass("on")){
				toggle(i);
			}
		}
	}else{
		for(var i = 0; i < local_data_numCells; i++){
			if($("#" + i).hasClass("off")){
				toggle(i);
			}
		}
	}
};

/*************
 * Purpose: Restart the current level. First, it turns off all cells. Then, it calls chooseLevel() to reload the current level.
 * Input: None.
 * Output: Calls chooseLevel() to reload the current level.
*************/
var restart = function(level){
	//Turn off all cells.
	turnCellsOff(true);

	//Reload current level.
	chooseLevel();
};

/*************
 * Purpose: Choose which level to load based on current level number.
 * Input: None.
 * Output: The next level is chosen and loaded.
*************/
var chooseLevel = function(){
	//Load next level based on current level.
	switch(currentLevel){
		case 2:
			$("#levelIndicator").empty();
			$("#levelIndicator").text("Level 2");
			loadLevel(levelTwo);
			break;
		case 3:
			$("#levelIndicator").empty();
			$("#levelIndicator").text("Level 3");
			loadLevel(levelThree);
			break;
		case 4:
			$("#levelIndicator").empty();
			$("#levelIndicator").text("Level 4");
			loadLevel(levelFour);
			break;
		case 5:
			$("#levelIndicator").empty();
			$("#levelIndicator").text("Level 5");
			loadLevel(levelFive);
			break;
		default:
			$("#levelIndicator").empty();
			$("#levelIndicator").text("Level 1");
			loadLevel(levelOne);
			currentLevel = 1;
	}
};

//************* MAIN *************

var main = function(){
	"use strict";

	console.log("HEY VANE!!!");

	loadLevel(levelOne);  //Start on level 1.
	$("#levelIndicator").text("Level 1");

	//Player clicked a cell on the game board.
	$("#gameBoard td").on("click", function(cell){
		var clickedID = parseInt($(cell.target).attr("id"));  //Save id of clicked cell; used later to toggle other cells as on/off.
		lastClicked = clickedID;
		
		toggleCells(clickedID);

		if(win()){
			console.log("You won!");

			if(mute === false){
				winSound.play();  //Play a sound to indicate the level was completed.
			}
			
			//The following will flash the board yellow and blue in order to indicate that the level was completed.
			var counter = 0;  //Counts how many times the board flashes and will be used to turn off setInterval.
			var winInterval = setInterval(function(){
				if(counter % 2 === 0){
					turnCellsOff(false);
					counter++;
				}else{
					turnCellsOff(true);
					counter++;
				}

				//Reference for stopping setInterval: http://stackoverflow.com/questions/9136261/how-to-make-a-setinterval-stop-after-some-time-or-after-a-number-of-actions
				if(counter === 6){
					clearInterval(winInterval);
					//Load the next level.
					currentLevel++
					chooseLevel();
				}
			}, 200);
		}else{
			//Move clickBeep sound in here so that it doesn't play when the player wins a level.
			if(mute === false){
				clickBeepArr[clickBeepID++].play();
				//Reset clickBeepID to 0 if it reaches end of array.
				if(clickBeepID >= clickBeepArr.length){
					clickBeepID = 0;
				}
			}
		}
	});
	
	//Player clicked Restart Button.
	$("#restartButton").on("click", function(){
		console.log("Restart button clicked.");
		console.log("Restarting level " + currentLevel);

		if(mute === false){
			//One way the Internet suggests playing overlapping identical sounds is to set currentTime to 0
			// evertime the sound needs to be played. While this doesn't actually play the sound simultaneously,
			// it works for short sounds such as this buttonClick here.
			buttonClick.currentTime = 0;
			buttonClick.play();
		}
	
		restart();
	});

	//Player clicked Undo Button.
	$("#undoButton").on("click", function(){
		console.log("Clicked Undo button");

		if(mute === false){
			buttonClick.currentTime = 0;
			buttonClick.play();
		}

		toggleCells(lastClicked);
	});

	//Player clicked Mute Button.
	$("#muteButton").on("click", function(){
		console.log("Clicked Mute button");

		mute = !mute;

		if(mute === true){
			$("#muteButton").text("Unmute");
			buttonClick.currentTime = 0;
			buttonClick.play();
		} else{
			$("#muteButton").text("Mute");
		}
	});

	//Easter egg!!!
	$("#shh").on("click", function(){
		if(mute === false){
			secret.play();
		}
	});
};

$(document).ready(main);

//t
//fflvd
//Thank you, God!
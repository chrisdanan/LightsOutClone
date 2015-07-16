/*************
 * Author: Christopher Dancarlo Danan
 * Created: July 14, 2015
 * Modified: July 16, 2015
 * Purpose: Game logic for Lights Out clone project.
*************/

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

var main = function(){
	"use strict";

	console.log("HEY VANE!!!");

	//Player clicked a cell on the game board.
	$("#gameBoard td").on("click", function(cell){
		var clickedID = parseInt($(cell.target).attr("id"));  //Save id of clicked cell; used later to toggle other cells as on/off.
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

		if(win()){
			console.log("You won!");
		}
	});
};

$(document).ready(main);
'use strict';

module.exports = { nextStates };

// Quick and dirty: Hard coded model - to be fixed later

function nextStates ( currentState ) {
	var targetStates = [];

	switch( currentState ) {
		case "Submitted": {
			targetStates = ["Acknowledged", "Rejected"];
		}
		case "Acknowledged":{
			targetStates = ["InProgress", "Cancelled"];
		}
		case "InProgress": {
			targetStates = ["Resolved", "Cancelled" ];
		}
		case "Resolved": {
			targetStates = ["Closed"];
		}
	}

	return targetStates;
}

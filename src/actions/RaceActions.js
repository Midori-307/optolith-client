import AppDispatcher from '../dispatcher/AppDispatcher';
import ActionTypes from '../constants/ActionTypes';

export default {
	selectRace: function(raceID) {
		AppDispatcher.dispatch({
			actionType: ActionTypes.SELECT_RACE,
			raceID
		});
	},
	filter: function(text) {
		AppDispatcher.dispatch({
			actionType: ActionTypes.FILTER_RACES,
			text
		});
	},
	sort: function(option) {
		AppDispatcher.dispatch({
			actionType: ActionTypes.SORT_RACES,
			option
		});
	},
	changeValueVisibility: function() {
		AppDispatcher.dispatch({
			actionType: ActionTypes.CHANGE_RACE_VALUE_VISIBILITY
		});
	}
};
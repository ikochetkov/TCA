import cuid from 'cuid';
import {actionTypes} from '@servicenow/ui-core';
import {
	makeGetFromLocalStorageHandler,
	makeStoreStateInLocalStorageHandler
} from './effects';
import {
	CHECKLIST_LOAD,
	CHECKLIST_LOAD_SUCCEEDED,
	CHECKLIST_INPUT_CHANGED,
	CHECKLIST_ITEM_ADD,
	CHECKLIST_ITEM_UPDATED,
	CHECKLIST_UPDATED
} from '../constants';

const makeUpdateStateHandler = checklistHandler => coeffects => {
	coeffects.updateState(checklistHandler(coeffects));
	coeffects.dispatch(CHECKLIST_UPDATED);
};

export default {
	actionHandlers: {
		[actionTypes.COMPONENT_BOOTSTRAPPED]: ({dispatch}) => {
			dispatch(CHECKLIST_LOAD);
		},
		[CHECKLIST_LOAD]: {
			stopPropagation: true,
			...makeGetFromLocalStorageHandler(
				'state',
				CHECKLIST_LOAD_SUCCEEDED
			)
		},
		[CHECKLIST_LOAD_SUCCEEDED]: {
			stopPropagation: true,
			effect: ({action, updateState}) =>
				updateState(JSON.parse(action.payload))
		},
		[CHECKLIST_INPUT_CHANGED]: {
			stopPropagation: true,
			effect: makeUpdateStateHandler(({action}) => ({
				inputValue: action.payload
			}))
		},
		[CHECKLIST_ITEM_ADD]: {
			stopPropagation: true,
			effect: makeUpdateStateHandler(({state}) => ({
				inputValue: '',
				items: state.items.concat({
					itemId: cuid(),
					label: state.inputValue,
					completed: false
				})
			}))
		},
		[CHECKLIST_ITEM_UPDATED]: {
			stopPropagation: true,
			effect: makeUpdateStateHandler(({action, state}) => ({
				items: state.items.map(item =>
					item.itemId === action.payload.itemId
						? {
								...item,
								...action.payload
							}
						: item
				)
			}))
		},
		[CHECKLIST_UPDATED]: {
			stopPropagation: true,
			...makeStoreStateInLocalStorageHandler('state')
		}
	}
};

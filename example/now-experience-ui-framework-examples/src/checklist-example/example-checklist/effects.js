export function getFromLocalStorageEffect(name, successAction, coeffects) {
	const {dispatch} = coeffects;
	const results = localStorage.getItem(name);
	if (results) dispatch(successAction, results);
}

export const makeGetFromLocalStorageHandler = (name, successAction) => ({
	effect: getFromLocalStorageEffect,
	args: [name, successAction]
});

export function storeStateInLocalStorageEffect(name, coeffects) {
	const {state} = coeffects;
	localStorage.setItem(name, JSON.stringify(state));
}

export const makeStoreStateInLocalStorageHandler = name => ({
	effect: storeStateInLocalStorageEffect,
	args: [name]
});

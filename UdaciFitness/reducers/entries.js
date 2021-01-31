import { RECEIVE_ENTRIES, ADD_ENTRY, REMOVE_ENTRY } from '../actions/index'

export default function entries(state = {}, action) {
    switch(action.type) {
        case RECEIVE_ENTRIES:
            return {
                ...state,
                ...action.entries
            };
        case ADD_ENTRY:
            return {
                ...state,
                ...action.entry
            };
        case REMOVE_ENTRY:
            const newState = {}
            Object.keys(state)
                .filter((e) => {e !== action.key})
                .map((e) => {newState[e] = state[e]})
            return newState;
        default:
            return state;
    }
}
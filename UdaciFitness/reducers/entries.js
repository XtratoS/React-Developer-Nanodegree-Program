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
            return {
                ...state,
                [action.key]: null
            };
        default:
            return state;
    }
}
import {RECEIVE_DATA} from '../actions/shared';

export default function loaded (state = false, action) {
    switch(action.type) {
        case RECEIVE_DATA:
            return true;
        default:
            return state;
    }
}
import {combineReducers} from 'redux';

import todos from './todos';
import goals from './goals';
import loaded from './loaded';

export default combineReducers({
    todos,
    goals,
    loaded
});
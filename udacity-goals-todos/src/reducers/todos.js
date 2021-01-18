import {ADD_TODO, TOGGLE_TODO, REMOVE_TODO} from '../actions/todos';
import {RECEIVE_DATA} from '../actions/shared';

export default function todos (state = [], action) {
    switch(action.type) {
        case ADD_TODO:
            return state.concat([action.todo]);
        case REMOVE_TODO:
            return state.filter((todo) => todo.id !== action.id)
        case TOGGLE_TODO:
            state.forEach((todo) => {
                if (todo.id === action.id) {
                    todo.complete = !todo.complete;
                }
            });
            return state;
        case RECEIVE_DATA:
            return action.todos;
        default:
            return state;
    }
}
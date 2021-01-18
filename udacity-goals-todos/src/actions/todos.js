import API from 'goals-todos-api';

export const ADD_TODO = 'ADD_TODO';
export const TOGGLE_TODO = 'TOGGLE_TODO';
export const REMOVE_TODO = 'REMOVE_TODO';

function addTodo(todo) {
    return {
        type: ADD_TODO,
        todo: todo
    }
}

function toggleTodo(id) {
    return {
        type: TOGGLE_TODO,
        id
    }
}

function removeTodo(id) {
    return {
        type: REMOVE_TODO,
        id
    }
}

export function handleAddTodo(name, callback) {
    return function(dispatch) {
        return API.saveTodo(name).then(todo => {
            dispatch(addTodo(todo));
            callback();
        }).catch(() => {
            alert(`Failed to add todo "${name}", please try again.`);
        });
    }
}

export function handleToggleItem(todo) {
    return function(dispatch) {
        dispatch(toggleTodo(todo.id));
        return API.saveTodoToggle(todo.id).catch(() => {
            dispatch(toggleTodo(todo.id));
            alert(`Failed to toggle ${todo.name}, please try again.`);
        });
    }
}

export function handleDeleteTodo(todo) {
    return (dispatch) => {
        dispatch(removeTodo(todo.id));
        return API.deleteTodo(todo.id).catch(() => {
            dispatch(addTodo(todo));
            alert(`Couldn't todo "${todo.name}", please try again.`);
        });
    }
}
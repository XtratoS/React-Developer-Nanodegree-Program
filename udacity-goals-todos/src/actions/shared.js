import API from 'goals-todos-api';

export const RECEIVE_DATA = 'RECEIVE_DATA';

function recieveData(todos, goals) {
    return {
        type: RECEIVE_DATA,
        todos,
        goals
    }
}

export function handeInitialData() {
    return (dispatch) => {
        return Promise.all([
            API.fetchTodos(),
            API.fetchGoals()
        ]).then(([todos, goals]) => {
            dispatch(recieveData(todos, goals));
        });
    }
}
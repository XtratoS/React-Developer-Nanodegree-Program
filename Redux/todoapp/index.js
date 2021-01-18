const ADD_TODO = 'ADD_TODO';
const REMOVE_TODO = 'REMOVE_TODO';
const TOGGLE_TODO = 'TOGGLE_TODO';
const ADD_GOAL = 'ADD_GOAL';
const REMOVE_GOAL = 'REMOVE_GOAL';
const RECEIVE_DATA = 'RECEIVE_DATA';

const {API} = window;

function genId() {
    return Math.random().toString(36).substring(2) + (new Date()).getTime().toString(36);
}

function todos (state = [], action) {
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

function goals (state = [], action) {
    switch(action.type) {
        case ADD_GOAL:
            return state.concat([action.goal]);
        case REMOVE_GOAL:
            return state.filter((goal) => goal.id !== action.id);
        case RECEIVE_DATA:
            return action.goals;
        default:
            return state;
    }
}

function loaded (state = false, action) {
    switch(action.type) {
        case RECEIVE_DATA:
            return true;
        default:
            return state;
    }
}

function addTodoAction(todo) {
    return {
        type: ADD_TODO,
        todo: todo
    }
}

function recieveDataAction(todos, goals) {
    return {
        type: RECEIVE_DATA,
        todos,
        goals
    }
}

function removeTodoAction(id) {
    return {
        type: REMOVE_TODO,
        id
    }
}

function toggleTodoAction(id) {
    return {
        type: TOGGLE_TODO,
        id
    }
}

function removeGoalAction(id) {
    return {
        type: REMOVE_GOAL,
        id
    }
}

function addGoalAction(goal) {
    return {
        type: ADD_GOAL,
        goal: goal
    }
}

function handleDeleteTodo(todo) {
    return (dispatch) => {
        dispatch(removeTodoAction(todo.id));
        return API.deleteTodo(todo.id).catch(() => {
            dispatch(addTodoAction(todo));
            alert(`Couldn't todo "${todo.name}", please try again.`);
        });
    }
}

function handleAddGoal (name, callback) {
    return (dispatch) => {
        return API.saveGoal(name).then((goal) => {
            dispatch(addGoalAction(goal));
            callback();
        }).catch(() => {
            alert(`Failed to add Goal "${name}", please try again.`)
        })
    }
}

function handleDeleteGoal(goal) {
    return function(dispatch) {
        dispatch(removeGoalAction(goal.id));
        return API.deleteGoal(goal.id).catch(() => {
            dispatch(addGoalAction(goal));
            alert(`Failed to delete Goal "${goal.name}", please try again.`)
        })
    }
}

function handleAddTodo(name, callback) {
    return function(dispatch) {
        return API.saveTodo(name).then(todo => {
            dispatch(addTodoAction(todo));
            callback();
        }).catch(() => {
            alert(`Failed to add todo "${name}", please try again.`);
        });
    }
}

function handleToggleItem(todo) {
    return function(dispatch) {
        dispatch(toggleTodoAction(todo.id));
        return API.saveTodoToggle(todo.id).catch(() => {
            dispatch(toggleTodoAction(todo.id));
            alert(`Failed to toggle ${todo.name}, please try again.`);
        });
    }
}

function handeInitialData() {
    return (dispatch) => {
        return Promise.all([
            API.fetchTodos(),
            API.fetchGoals()
        ]).then(([todos, goals]) => {
            dispatch(recieveDataAction(todos, goals));
        });
    }
}

const noBitcoinChecker = (store) => (next) => (action) => {
    if (action.type === ADD_TODO && action.todo.name.toLowerCase().includes('bitcoin')) {
        return alert('NO BITCOINS');
    }
    if (action.type === ADD_GOAL && action.goal.name.toLowerCase().includes('bitcoin')) {
        return alert('NO BITCOINS');
    }
    return next(action);
}

const logger = (store) => (next) => (action) => {
    console.group(action.type);
        console.log('The action: ', action);
        const resultAfterNextMiddleware = next(action);
        console.log('The new state: ', store.getState());
    console.groupEnd();
    return resultAfterNextMiddleware;
}

const store = Redux.createStore(Redux.combineReducers({
    todos,
    goals,
    loaded
}), Redux.applyMiddleware(ReduxThunk.default, noBitcoinChecker, logger));

class List extends React.Component {

    render() {
        const {items, remove, toggle} = this.props;
        return (
            <ul>{
                items.map((item) => (
                    <li key={item.id}>
                        <span
                            onClick={() => {toggle(item)}}
                            style={{textDecoration: item.complete ? 'line-through' : 'none'}}
                        >
                            {item.name}
                        </span>
                        <button
                            className="btn btn-danger"
                            onClick={() => {remove(item)}}
                        >
                            x
                        </button>
                    </li>
                ))
            }</ul>
        )
    }
}

class Todos extends React.Component {

    addItem = (event) => {
        
        event.preventDefault();

        const name = this.input.value;
        const callback = () => {
            this.input.value = '';
        }

        this.props.dispatch(handleAddTodo(name, callback));
    }

    removeItem = (todo) => {
        this.props.dispatch(handleDeleteTodo(todo))
    }

    toggleItem = (todo) => {
        this.props.dispatch(handleToggleItem(todo))
    }

    render () {
        return (
            <div>
                <h1>Todo List</h1>
                <input
                    type='text'
                    placeholder='Add Todo'
                    ref={(input) => this.input = input}
                />
                <button onClick={this.addItem}>Add Todo</button>
                <List
                    items={this.props.todos}
                    remove={this.removeItem}
                    toggle={this.toggleItem}
                />
            </div>
        )
    }
}

const ConnectedTodos = ReactRedux.connect((state)=>({
    todos: state.todos
}))(Todos)

class Goals extends React.Component {

    addItem = (event) => {
        event.preventDefault();
        const name = this.input.value;

        this.props.dispatch(handleAddGoal(name, () => {this.input.value = ''}))
    }

    removeItem = (goal) => {
        this.props.dispatch(handleDeleteGoal(goal))
    }

    render () {
        return (
            <div>
                <h1>Goals</h1>
                <input
                    type='text'
                    placeholder='Add Goal'
                    ref={(input) => this.input = input}
                />
                <button onClick={this.addItem}>Add Goal</button>
                <List
                    items={this.props.goals}
                    remove={this.removeItem}
                />
            </div>
        )
    }
}

const ConnectedGoals = ReactRedux.connect((state) => ({
    goals: state.goals
}))(Goals)

class App extends React.Component {
    componentDidMount() {
        const {dispatch} = this.props
        dispatch(handeInitialData());
    }

    render() {
        if (this.props.loaded === false) {
            return (
                <div className="m-4">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            )
        } else if (this.props.loaded === true) {
            return (
                <div className="m-4">
                    <ConnectedTodos/>
                    <ConnectedGoals/>
                </div>
            )
        }
    }
}

const ConnectedApp = ReactRedux.connect((state) => ({
    loaded: state.loaded
}))(App)

ReactDOM.render(
    <ReactRedux.Provider store={store}>
        <ConnectedApp/>
    </ReactRedux.Provider>,
    document.querySelector('#app')
)
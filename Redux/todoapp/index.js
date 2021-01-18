function genId() {
    return Math.random().toString(36).substring(2) + (new Date()).getTime().toString(36);
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
import React from 'react';
import {connect} from 'react-redux';

import List from './List';
import {
    handleAddTodo,
    handleToggleItem,
    handleDeleteTodo
} from '../actions/todos';

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

export default connect((state)=>({
    todos: state.todos
}))(Todos);
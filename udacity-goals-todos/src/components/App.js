import React from 'react';
import ConnectedGoals from './Goals';
import ConnectedTodos from './Todos';
import {connect} from 'react-redux';
import {handeInitialData} from '../actions/shared';

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

export default connect((state) => ({
    loaded: state.loaded
}))(App)
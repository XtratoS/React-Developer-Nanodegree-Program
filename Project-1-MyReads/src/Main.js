import React, { Component } from 'react';
import './App.css';
import {Route} from 'react-router-dom';
import List from './List';
import Search from './Search';

class BooksApp extends Component {
    render() {
        return (
            <div className="app">
                <Route
                    exact path='/'
                    render={()=>(
                        <List/>
                    )}
                />
                <Route
                    path='/search'
                    render={()=>(
                        <Search/>
                    )}
                />
            </div>
        )
    }
}

export default BooksApp;
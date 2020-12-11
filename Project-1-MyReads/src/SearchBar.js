import React, { Component } from 'react'
import './App.css'
import {Link} from 'react-router-dom';

class SearchBar extends Component {

    handleChange = (event) => {
        const query = event.target.value;
        this.props.changeQuery(query);
    }

    render() {
        return (
            <div className="search-books-bar">
                <Link
                    className="close-search"
                    to="/"
                />
                <div className="search-books-input-wrapper">
                    <input
                        type="text"
                        placeholder="Search by title or author"
                        value={this.props.query}
                        onChange={this.handleChange}
                    />
                </div>
            </div>
        )
    }
}

export default SearchBar;
import React, { Component } from 'react';
import * as BooksAPI from './BooksAPI';
import './App.css';
import BooksGrid from './BooksGrid';
import {Link} from 'react-router-dom';

class Search extends Component {

    state = {
        query: '',
        books: []
    }

    handleChange = (event) => {
        const query = event.target.value;

        this.setState(
            function updater (prevState) {
                prevState.query = query;
                return prevState;
            }, function callback () {
                if (!((!query) || query === '')) {
                    BooksAPI.search(query).then((result) => {
                        const books = result.books;
                        const resultQuery = result.query;
                        if (resultQuery === this.state.query){
                            if (Array.isArray(books)) {
                                this.setState({books: books.map((book) => (book.id))});
                            } else {
                                this.setState({books: []});
                            }
                        }
                    });
                } else {
                    this.setState({books: []});
                }
            }
        );
    }

    render() {
        return (
            <div className="search-books">
                <div className="search-books-bar">
                    <Link
                        className="close-search"
                        to="/"
                    />
                    <div className="search-books-input-wrapper">
                        <input
                            type="text"
                            placeholder="Search by title or author"
                            value={this.state.query}
                            onChange={this.handleChange}
                        />
                    </div>
                </div>
                <div className="search-books-results">
                    <BooksGrid
                        books={this.state.books}
                    />
                </div>
            </div>
        )
    }
}

export default Search;
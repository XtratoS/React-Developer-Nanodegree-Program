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
        this.setState({query: query});
        if (!((!query) || query === '')) {
            BooksAPI.search(query).then((result) => {
                const books = result.books;
                const resultQuery = result.query;
                if (Array.isArray(books)) {
                    if (resultQuery === this.state.query){
                        this.setState({books: books.map((book) => (book.id))});
                    }
                } else {
                    if (resultQuery === this.state.query){
                        this.setState({books: []});
                    }
                }
            });
        } else {
            this.setState({books: []});
        }
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
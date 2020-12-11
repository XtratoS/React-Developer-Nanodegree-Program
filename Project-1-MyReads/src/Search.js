import React, { Component } from 'react'
import * as BooksAPI from './BooksAPI'
import './App.css'
import SearchBar from './SearchBar'
import BooksGrid from './BooksGrid';

class Search extends Component {

    state = {
        query: '',
        books: []
    }

    changeQuery = (query) => {
        this.setState({query: query});
        if (!query) {
            this.setState({books: []});
        } else {
            BooksAPI.search(query).then((result)=>{
                if (Array.isArray(result)) {
                    this.setState({books: result.map((book) => (book.id))});
                } else {
                    this.setState({books: []});
                }
            });
        }
    }

    render() {
        return (
            <div className="search-books">
                <SearchBar
                    changeQuery={this.changeQuery}
                    query={this.query}
                />
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
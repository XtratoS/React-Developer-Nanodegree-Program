import React, { Component } from 'react'
import * as BooksAPI from './BooksAPI'
import './App.css'
import {Link} from 'react-router-dom';
import BooksGrid from './BooksGrid';

class List extends Component {
    state = {
        currentlyReading: [],
        wantToRead: [],
        read: []
    }

    componentDidMount() {
        BooksAPI.getAll().then((books) => {
            books.map((book) => (
                this.setState((prevState) => {
                    prevState[book.shelf].push(book.id);
                    return prevState;
                })
            ));
        });
    }

    setList = (list) => {
        this.setState(list);
    }

    render() {
        return (
            <div className="list-books">
                <div className="list-books-title">
                    <h1>My Reads</h1>
                </div>
                <div className="list-books-content">
                    <div>
                        <div className="bookshelf">
                            <h2 className="bookshelf-title">Currently Reading</h2>
                            <div className="bookshelf-books">
                                <BooksGrid
                                    books={this.state.currentlyReading}
                                    updateList={this.setList}
                                />
                            </div>
                        </div>
                        <div className="bookshelf">
                            <h2 className="bookshelf-title">Want To Read</h2>
                            <div className="bookshelf-books">
                                <BooksGrid
                                    books={this.state.wantToRead}
                                    updateList={this.setList}
                                />
                            </div>
                        </div>
                        <div className="bookshelf">
                            <h2 className="bookshelf-title">Read</h2>
                            <div className="bookshelf-books">
                                <BooksGrid
                                    books={this.state.read}
                                    updateList={this.setList}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="open-search">
                    <Link
                        to="/search"
                    >
                        <button style={{cursor: 'pointer'}}>Go To Search</button>
                    </Link>
                </div>
            </div>
        )
    }
}

export default List;
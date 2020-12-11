import React, { Component } from 'react'
import * as BooksAPI from './BooksAPI';
import './App.css'

class Book extends Component {
    state = {
        book: {}
    }

    componentDidMount() {
        this._ismounted = true;
        this.updateSelf();
    }

    componentWillUnmount() {
        this._ismounted = false;
    }

    updateSelf = () => {
        const id = this.props.book;
        BooksAPI.get(id).then((book) => {
            if (this._ismounted) {
                this.setState({book: book});
            }
        });
    }

    changeBookShelf = (event, book) => {
        const newShelf = event.target.value;
        BooksAPI.update(book, newShelf).then((newList) => {
            if (this.props.updateList) {
                this.props.updateList(newList);
            } else {
                this.updateSelf();
            }
        });
    }

    render() {
        const book = this.state.book;
        return (
            <div className="book">
                <div className="book-top">
                    <div className="book-cover" style={{ width: 128, height: 193, backgroundImage: `url("${(book && book.imageLinks && book.imageLinks.thumbnail)}")`, backgroundRepeat: 'no-repeat' }}></div>
                    <div className="book-shelf-changer">
                        <select onChange={(event) => {this.changeBookShelf(event, book)}} defaultValue="move">
                            <option value="move" disabled>Move to...</option>
                            <option value="currentlyReading">{book.shelf==='currentlyReading' && '✔ '}Currently Reading</option>
                            <option value="wantToRead">{book.shelf==='wantToRead' && '✔ '}Want to Read</option>
                            <option value="read">{book.shelf==='read' && '✔ '}Read</option>
                            <option value="none">{book.shelf==='none' && '✔ '}None</option>
                        </select>
                    </div>
                </div>
                <div className="book-title">{book.title}</div>
                <div className="book-authors">{book.authors}</div>
            </div>
        )
    }
}

export default Book;
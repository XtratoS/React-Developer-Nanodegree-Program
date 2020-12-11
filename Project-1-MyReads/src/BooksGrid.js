import React from 'react'
import './App.css'
import Book from './Book'

const BooksGrid = (props) => (
    <ol className="books-grid">
        {props.books.map((bookId) => (
            <li key={bookId}>
                <Book
                    book={bookId}
                    updateList={props.updateList}
                />
            </li>
        ))}
    </ol>
)

export default BooksGrid;
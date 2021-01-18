import React from 'react';

export default class List extends React.Component {

    render() {
        const {items, remove, toggle} = this.props;
        return (
            <ul>{
                items.map((item) => (
                    <li key={item.id}>
                        <span
                            onClick={() => {toggle(item)}}
                            style={{textDecoration: item.complete ? 'line-through' : 'none'}}
                        >
                            {item.name}
                        </span>
                        <button
                            className="btn btn-danger"
                            onClick={() => {remove(item)}}
                        >
                            x
                        </button>
                    </li>
                ))
            }</ul>
        )
    }
}
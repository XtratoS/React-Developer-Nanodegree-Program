const a1 = {
    users: {
        1: {
            id: 1,
            name: 'a'
        },
        2: {
            id: 2,
            name: 'b'
        }
    }
}

const a2 = {
    tweets: {
        1: {
            id: 1,
            content: 'Tweet 1',
            tweeterName: 'a'
        },
        2: {
            id: 2,
            content: 'Tweet 2',
            tweeterName: 'b'
        }
    }
}

console.log({...a1, tweets: a2.tweets});
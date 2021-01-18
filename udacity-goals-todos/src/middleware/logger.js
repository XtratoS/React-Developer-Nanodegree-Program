const logger = (store) => (next) => (action) => {
    console.group(action.type);
        console.log('The action: ', action);
        const resultAfterNextMiddleware = next(action);
        console.log('The new state: ', store.getState());
    console.groupEnd();
    return resultAfterNextMiddleware;
}

export default logger;
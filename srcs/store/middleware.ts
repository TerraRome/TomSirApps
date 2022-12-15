import thunk from 'redux-thunk'
// import { createLogger } from 'redux-logger';

const middlewares: any = []

middlewares.push(thunk)

// if (__DEV__) {
//     middlewares.push(createLogger());
// }

export default middlewares

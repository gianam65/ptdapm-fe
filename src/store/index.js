import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'
import logger from 'redux-logger'
import createSagaMiddleware from 'redux-saga';
import rootSaga from '../saga/index'
import reducer from './reducer/index'
const sagaMiddleware = createSagaMiddleware();

const middleware = [...getDefaultMiddleware({ thunk: false }), sagaMiddleware, logger];

export const store = configureStore({
    reducer,
    middleware
})

sagaMiddleware.run(rootSaga);

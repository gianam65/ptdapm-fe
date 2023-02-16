import { all } from 'redux-saga/effects';
import { employeeSaga } from './employee';
import reportSaga from './reportSaga';

export default function* rootSaga() {
    yield all([
        employeeSaga(),
        ...reportSaga
    ]);
}
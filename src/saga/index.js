import { all } from 'redux-saga/effects';
import { employeeSaga } from './employee';

export default function* rootSaga() {
    yield all([employeeSaga()]);
}
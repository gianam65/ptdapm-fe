import { put, takeEvery } from 'redux-saga/effects';
import { getEmployeeAction } from '../actions/employeeAction';
import { getEmployee } from '../store/reducer/employee';
import { callAPI } from '../config/axios';

function* getEmployeeRequestSaga(action) {
  const result = yield callAPI({ url: 'https://catfact.ninja/fact' });
  yield put(getEmployee([result.data.fact]));
}

export function* employeeSaga() {
  yield takeEvery(getEmployeeAction.type, getEmployeeRequestSaga);
}

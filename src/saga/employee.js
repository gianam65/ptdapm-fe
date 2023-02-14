import { call, put, takeEvery } from 'redux-saga/effects';
import * as types from '../actions/types/employeeType'
import { getEmployee } from '../store/reducer/employee'
import { callAPI } from '../config/axios'

function* getEmployeeRequestSaga(action) {
    console.log("getEmployeeRequestSaga", action);
    const result = yield callAPI({ url: "https://catfact.ninja/fact" });
    yield put(getEmployee([result.data.fact]));
}

export function* employeeSaga() {
    yield takeEvery(types.GET_EMPLOYEE_REQUEST, getEmployeeRequestSaga);
}
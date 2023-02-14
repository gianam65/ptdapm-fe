<<<<<<< Updated upstream
import { put, takeEvery } from 'redux-saga/effects';
import * as types from '../actions/types/employeeType';
import { getEmployee } from '../store/reducer/employee';
import { callAPI } from '../config/axios';
=======
import { call, put, takeEvery } from 'redux-saga/effects';
import * as types from '../actions/types/employeeType'
import { getEmployee } from '../store/reducer/employee'
import { callAPI } from '../config/axios'
import { employeeAction } from '../actions/employeeAction'
>>>>>>> Stashed changes

function* getEmployeeRequestSaga(action) {
  const result = yield callAPI({ url: 'https://catfact.ninja/fact' });
  yield put(getEmployee([result.data.fact]));
}

export function* employeeSaga() {
<<<<<<< Updated upstream
  yield takeEvery(types.GET_EMPLOYEE_REQUEST, getEmployeeRequestSaga);
}
=======
    yield takeEvery(employeeAction.type, getEmployeeRequestSaga);
}
>>>>>>> Stashed changes

import { takeEvery, put } from "redux-saga/effects"
import { GET_REPORT_REQUEST } from '../actions/types/reportTypes'
import { callAPI } from '../config/axios';
import * as actions from '../store/reducer/report'

function* handleGetReport(action) {
    try {
        const response = yield callAPI({ url: 'https://catfact.ninja/fact' })
        yield put(actions.getReportSuccess([response.data.fact]))
    } catch (error) {
        yield put(actions.getReportFailure(error))
    }
}


const reportSaga = [
    takeEvery(GET_REPORT_REQUEST, handleGetReport)
]

export default reportSaga
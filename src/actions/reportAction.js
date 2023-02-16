import * as reportTypes from './types/reportTypes'
import { createAction } from '@reduxjs/toolkit'

export const reportActions = {
    getReportRequest: createAction(reportTypes.GET_REPORT_REQUEST),
    getReportSuccess: createAction(reportTypes.GET_REPORT_SUCCESS),
    getReportFailure: createAction(reportTypes.GET_REPORT_FAILURE),
};
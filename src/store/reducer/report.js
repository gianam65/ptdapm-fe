import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    listReport: [],
    error: null,
};

export const reportReducer = createSlice({
    name: 'report',
    initialState,
    reducers: {
       getReportRequest: (state, action) => { },
        getReportSuccess: (state, action) => {
            state.listReport = action.payload
        },
        getReportFailure: (state, action) => {
            state.error = action.payload
        }
    }
})

export const {getReportRequest, getReportSuccess, getReportFailure } = reportReducer.actions

export default reportReducer.reducer

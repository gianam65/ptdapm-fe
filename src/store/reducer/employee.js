import { createSlice } from '@reduxjs/toolkit';
import { GET_EMPLOYEE_REQUEST } from '../../actions/types/employeeType'


const initialState = {
    listEmployee: [],
    isLoading: false
};

export const employeeReducer = createSlice({
    name: 'employee',
    initialState,
    reducers: {
        getEmployee: (state, action) => {
            state.listEmployee = action.payload;
            state.isLoading = false
        },
        addEmployee: (state, action) => {

        }
    }
});
export const { getEmployee, addEmployee } = employeeReducer.actions;

export default employeeReducer.reducer;



import { createSlice } from '@reduxjs/toolkit';
const initialState = {
  listEmployee: [],
  status: 'idle'
};

export const employeeReducer = createSlice({
  name: 'employee',
  initialState,
  reducers: {
    getEmployee: (state, action) => {
      state.listEmployee = action.payload;
    },
    addEmployee: (state, action) => {}
  }
});
export const { getEmployee, addEmployee } = employeeReducer.actions;

export default employeeReducer.reducer;

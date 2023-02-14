import { createAction } from '@reduxjs/toolkit'
import * as types from './types/employeeType'



export const getEmployeeAction = createAction(types.GET_EMPLOYEE_REQUEST)
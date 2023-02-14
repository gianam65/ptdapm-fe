import { createAction } from '@reduxjs/toolkit'
import * as types from './types/employeeType'



export const employeeAction = createAction(types.GET_EMPLOYEE_REQUEST)
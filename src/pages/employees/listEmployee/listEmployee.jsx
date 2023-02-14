import React from 'react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as types from '../../../actions/types/employeeType';

export default function ListEmployee() {
  const dispatch = useDispatch();
  const employees = useSelector(state => state.employee.listEmployee);

  useEffect(() => {
    dispatch({ type: types.GET_EMPLOYEE_REQUEST });

    // eslint-disable-next-line
  }, []);

  const renderList = () => {
    return employees.map((employee, index) => {
      return <p key={index}>{employee}</p>;
    });
  };

  return (
    <div>
      {/* <button onClick={() => dispatch({ type: types.GET_EMPLOYEE_REQUEST })}>Getdata</button> */}
      {renderList()}
    </div>
  );
}

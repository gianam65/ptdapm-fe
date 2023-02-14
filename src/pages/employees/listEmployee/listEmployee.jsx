import React from 'react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getEmployeeAction } from '../../../actions/employeeAction';

export default function ListEmployee() {
  const dispatch = useDispatch();
  const employees = useSelector(state => state.employee.listEmployee);

  useEffect(() => {
    dispatch(getEmployeeAction());
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

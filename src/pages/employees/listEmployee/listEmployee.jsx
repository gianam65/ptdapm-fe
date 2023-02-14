import React from 'react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as types from '../../../actions/types/employeeType';
<<<<<<< Updated upstream

export default function ListEmployee() {
=======
import { employeeAction } from '../../../actions/employeeAction';
export default function () {
>>>>>>> Stashed changes
  const dispatch = useDispatch();
  const employees = useSelector(state => state.employee.listEmployee);

  useEffect(() => {
<<<<<<< Updated upstream
    dispatch({ type: types.GET_EMPLOYEE_REQUEST });

    // eslint-disable-next-line
=======
    dispatch(employeeAction());
>>>>>>> Stashed changes
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

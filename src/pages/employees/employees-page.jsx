import './employees-page.scss';
import { Table } from 'antd';
import { useEffect, useState } from 'react';
import { httpGet } from '../../services/request';
import { getAPIHostName } from '../../utils';
import { loadingState } from '../../recoil/store/app';
import { useSetRecoilState } from 'recoil';
import { fallbackToDefaultAvatar } from '../../utils/';
const EmployeesPage = () => {
  const [listEmployees, setListEmployees] = useState([]);
  const setPageLoading = useSetRecoilState(loadingState);
  useEffect(() => {
    const fetchEmployees = () => {
      setPageLoading(true);
      const url = `${getAPIHostName()}/employees`;
      httpGet(url)
        .then(res => {
          if (res.success) {
            const { employeeList } = res.data;
            setListEmployees(employeeList);
          }
          setPageLoading(false);
        })
        .catch(() => {
          setPageLoading(false);
        });
    };
    fetchEmployees();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: text => <span className="employee__name">{text}</span>
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email'
    },
    {
      title: 'Phone',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
      render: phoneNumber => <span className="employee__phone">{phoneNumber}</span>
    },
    {
      title: 'Salary rank',
      dataIndex: 'salaryRank',
      key: 'salaryRank',
      render: salaryRank => <span className="employee__salary">{salaryRank}</span>
    },
    {
      title: 'Gender',
      dataIndex: 'gender',
      key: 'gender',
      render: gender => <span className="employee__gender">{gender}</span>
    },
    {
      title: 'Position',
      key: 'position',
      dataIndex: 'position',
      render: position => <span className="employee__position">{position}</span>
    },
    {
      title: 'Birth day',
      key: 'BirthOfDate',
      dataIndex: 'BirthOfDate',
      render: BirthOfDate => <span className="employee__birthday">{BirthOfDate}</span>
    },
    {
      title: 'Avatar',
      key: 'picturePath',
      dataIndex: 'picturePath',
      render: picturePath => (
        <img src={fallbackToDefaultAvatar(picturePath)} alt="employee avatar" className="employee__avatar" />
      )
    }
  ];

  return (
    <div>
      <div className="employees__container">
        <Table columns={columns} dataSource={listEmployees} rowKey={record => record._id} pagination={false} />
      </div>
    </div>
  );
};

export default EmployeesPage;

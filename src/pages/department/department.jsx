import './department.scss';
import { PlusOutlined, MoreOutlined, EditOutlined, DeleteOutlined, ExclamationCircleFilled } from '@ant-design/icons';
import Button from '../../components/button/button';
import { Input, Modal, Table, Popover, notification } from 'antd';
import { getAPIHostName } from '../../utils/';
import { httpDeleteDepartment, httpGet } from '../../services/request';
import { useEffect, useState } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { accessTokenState } from '../../recoil/store/account';
import { loadingState } from '../../recoil/store/app';

const { confirm } = Modal;
const { Search } = Input;
export default function DepartmentPage() {
  const accessToken = useRecoilValue(accessTokenState);
  const [departmentList, setDepartmentList] = useState([]);
  const setPageLoading = useSetRecoilState(loadingState);
  useEffect(() => {
    const getDepartment = () => {
      const url = `${getAPIHostName()}/departments`;
      setPageLoading(true);
      httpGet(url)
        .then(res => {
          if (res.success) {
            const { departmentList } = res.data[0];
            setDepartmentList(departmentList);
          }
          setPageLoading(false);
        })
        .catch(() => {
          notification.error({
            title: 'Error',
            message: 'Can not get deparment data'
          });
          setPageLoading(false);
        });
    };
    getDepartment();
  }, []);

  const content = id => {
    return (
      <div className="action">
        <div className="action__edit">
          <EditOutlined />
          <div onClick={() => {}}>Edit</div>
        </div>
        <div
          className="action__delete"
          onClick={() => {
            showConfirm(id);
          }}
        >
          <DeleteOutlined />
          <div>Delete</div>
        </div>
      </div>
    );
  };

  const showConfirm = idDelete => {
    confirm({
      title: 'Do you want to delete this department?',
      icon: <ExclamationCircleFilled />,
      onOk() {
        const deleteUrl = `${getAPIHostName()}/departments/${idDelete}`;
        httpDeleteDepartment(deleteUrl, accessToken)
          .then(res => {
            console.log(res);
          })
          .catch(err => {
            console.log(err);
          });
      },
      onCancel() {
        console.log('Cancel');
      }
    });
  };

  const columns = [
    {
      title: 'CODE',
      dataIndex: 'code',
      key: 'code'
    },
    {
      title: 'NAME',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: 'EMPLOYEESID ',
      key: 'employeesId',
      dataIndex: 'employeesId'
    },
    {
      title: 'ACTION',
      render: (_, item) => (
        <div>
          <Popover content={content(item._id)} trigger="click">
            <MoreOutlined />
          </Popover>
        </div>
      )
    }
  ];

  const _deparmentList = () => {
    return departmentList.filter(item => item.is_deleted);
  };

  // const handleSearchDepartment = e => {
  //   const searchValue = e.target.value || '';

  //   const searchResult = departmentList.filter(
  //     item => item.name?.includes(searchValue) || item.code?.includes(searchValue)
  //   );

  //   setDepartmentList(searchResult);
  // };

  return (
    <div>
      <div className="department__action">
        <Search
          placeholder="Type here to search"
          // onChange={handleSearchDepartment}
          style={{
            width: 200
          }}
        />
        <Button leftIcon={<PlusOutlined />}>ADD</Button>
      </div>
      <Table columns={columns} rowKey={record => record._id} dataSource={_deparmentList()} />
    </div>
  );
}

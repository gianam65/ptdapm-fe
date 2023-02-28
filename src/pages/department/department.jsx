import './department.scss';
import { PlusOutlined, MoreOutlined, EditOutlined, DeleteOutlined, ExclamationCircleFilled } from '@ant-design/icons';
import Button from '../../components/button/button';
import { Modal, Table, Popover, notification } from 'antd';
import { getAPIHostName } from '../../utils/';
import { httpGet, httpDelete, httpPost, httpPut } from '../../services/request';
import { useEffect, useState, useRef } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { accessTokenState } from '../../recoil/store/account';
import { loadingState } from '../../recoil/store/app';
import CustomInput from '../../components/custom-input/custom-input';

export default function DepartmentPage() {
  const accessToken = useRecoilValue(accessTokenState);
  const [departmentList, setDepartmentList] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [isLoadingTable, setIsLoadingTable] = useState(false);
  const [openUpSertDepartment, setOpenUpSertDepartment] = useState(false);
  const [updateId, setUpdateId] = useState();
  const setPageLoading = useSetRecoilState(loadingState);
  const departmentNameRef = useRef(null);
  const departmentCodeRef = useRef(null);
  useEffect(() => {
    const getDepartment = () => {
      const url = `${getAPIHostName()}/departments`;
      setPageLoading(true);
      httpGet(url)
        .then(res => {
          if (res.success) {
            const { departmentList } = res.data;
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

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openModalUpSertDepartment = id => {
    setUpdateId(id);
    setOpenUpSertDepartment(true);
  };

  const handleUpdateDepartment = id => {
    if (!id) return;
    const name = departmentNameRef.current.input.value;
    const code = departmentCodeRef.current.input.value;
    const url = `${getAPIHostName()}/departments/${id}`;

    httpPut(url, { name, code }, accessToken)
      .then(res => {
        if (res.success) {
          console.log('res :>> ', res);
          // setDepartmentList(oldDepartmentList => [res.data, ...oldDepartmentList]);
          notification.success({
            title: 'Success',
            message: 'Successfully updated department'
          });
          // setOpenUpSertDepartment(false);
        }
      })
      .catch(() => {
        notification.error({
          title: 'Error',
          message: 'Failed to update department'
        });
        // setOpenUpSertDepartment(false);
      });
  };

  const content = id => {
    return (
      <div className="action">
        <div className="action__edit">
          <EditOutlined />
          <div onClick={() => openModalUpSertDepartment(id)}>Edit</div>
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
    Modal.confirm({
      title: 'Do you want to delete this department?',
      icon: <ExclamationCircleFilled />,
      onOk() {
        setIsLoadingTable(true);
        const url = `${getAPIHostName()}/departments/${idDelete}`;
        httpDelete(url, accessToken)
          .then(res => {
            if (res.success) {
              setDepartmentList(oldDepartments => oldDepartments.filter(deparment => deparment._id !== idDelete));
              notification.success({
                title: 'Success',
                message: res.message || 'Delete deparment success'
              });
            }
            setIsLoadingTable(false);
          })
          .catch(() => {
            notification.error({
              title: 'Error',
              message: 'Delete deparment failed'
            });
            setIsLoadingTable(false);
          });
      },
      onCancel() {
        return;
      }
    });
  };

  const columns = [
    {
      title: 'Code',
      dataIndex: 'code',
      key: 'code'
    },
    {
      title: 'Department name',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: 'Total employees ',
      key: 'employeesId',
      dataIndex: 'employeesId',
      render: (_, record) => <span className="department__total-emp">{record.employeesId?.length || 0} employees</span>
    },
    {
      title: 'ACTION',
      render: (_, item) => (
        <div className="department__row-action">
          <Popover content={content(item._id)} trigger="click">
            <MoreOutlined />
          </Popover>
        </div>
      )
    }
  ];

  const handleAddDepartment = () => {
    const name = departmentNameRef.current.input.value;
    const code = departmentCodeRef.current.input.value;
    const url = `${getAPIHostName()}/departments`;

    httpPost(url, { name, code }, accessToken)
      .then(res => {
        if (res.success) {
          setDepartmentList(oldDepartmentList => [res.data, ...oldDepartmentList]);
          notification.success({
            title: 'Success',
            message: 'Successfully created a new department'
          });
          setOpenUpSertDepartment(false);
        }
      })
      .catch(err => {
        notification.error({
          title: 'Error',
          message: 'Failed to create new department'
        });
        console.log('err :>> ', err);
        setOpenUpSertDepartment(false);
      });
  };

  const getDataSource = () => {
    let departmentToRender = departmentList.filter(item => item.is_deleted);

    return departmentToRender.filter(
      item => item.name?.indexOf(searchValue) >= 0 || item.code?.indexOf(searchValue) >= 0
    );
  };

  return (
    <div>
      <div className="department__action">
        <CustomInput
          type="search"
          placeholder="Type here to search"
          onChange={e => setSearchValue(e.target.value)}
          className="department__search-inp"
        />
        <Button
          className="department__search-btn"
          onClick={() => openModalUpSertDepartment()}
          rightIcon={<PlusOutlined />}
        >
          Add department
        </Button>
      </div>
      <Table
        pagination={false}
        loading={isLoadingTable}
        columns={columns}
        rowKey={record => record._id}
        dataSource={getDataSource()}
      />

      <Modal
        title="Add department"
        open={openUpSertDepartment}
        onOk={() => {
          updateId ? handleUpdateDepartment(updateId) : handleAddDepartment();
        }}
        wrapClassName="add__department-modal"
        onCancel={() => setOpenUpSertDepartment(false)}
        okText="Add"
      >
        <div className="add__department-label">Name:</div>
        <CustomInput ref={departmentNameRef} placeholder="Enter department name" />
        <div className="add__department-label">Code:</div>
        <CustomInput ref={departmentCodeRef} placeholder="Enter department code" />
      </Modal>
    </div>
  );
}

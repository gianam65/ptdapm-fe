import './department.scss';
import { PlusOutlined, EditOutlined, DeleteOutlined, ExclamationCircleFilled } from '@ant-design/icons';
import Button from '../../components/button/button';
import { Modal, Table, notification, Tooltip } from 'antd';
import { getAPIHostName, checkIsEmpty } from '../../utils/';
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
  const [selectedDepartment, setSelectedDepartment] = useState({});
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
            title: 'Lỗi',
            message: 'Không thể lấy thông tin phòng ban'
          });
          setPageLoading(false);
        });
    };
    getDepartment();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openModalUpSertDepartment = id => {
    setUpdateId(id);
    setSelectedDepartment(departmentList.find(dp => dp._id === id) || {});
    setOpenUpSertDepartment(true);
  };

  const handleUpdateDepartment = id => {
    if (!id) return;
    const name = departmentNameRef.current.input.value;
    const code = departmentCodeRef.current.input.value;
    const url = `${getAPIHostName()}/departments/${id}`;
    if (checkIsEmpty(name) || checkIsEmpty(code)) {
      notification.error({
        title: 'Thất bại',
        message: 'Vui lòng điền đầy đủ thông tin'
      });
      return;
    }
    httpPut(url, { name, code }, accessToken)
      .then(res => {
        if (res.success) {
          setDepartmentList(oldDepartmentList => {
            const updatedDepartmentIdx = oldDepartmentList.findIndex(dep => dep._id === id);
            oldDepartmentList[updatedDepartmentIdx].name = name;
            oldDepartmentList[updatedDepartmentIdx].code = code;

            return oldDepartmentList;
          });
          notification.success({
            title: 'Thành công',
            message: 'Cập nhật phòng ban thành công'
          });
          setOpenUpSertDepartment(false);
        }
      })
      .catch(() => {
        notification.error({
          title: 'Lỗi',
          message: 'Cập nhật phòng ban thất bại'
        });
        setOpenUpSertDepartment(false);
      });
  };

  const showConfirm = idDelete => {
    Modal.confirm({
      title: 'Bạn có muốn xoá phòng ban này không?',
      icon: <ExclamationCircleFilled />,
      onOk() {
        setIsLoadingTable(true);
        const url = `${getAPIHostName()}/departments/${idDelete}`;
        httpDelete(url, accessToken)
          .then(res => {
            if (res.success) {
              setDepartmentList(oldDepartments => oldDepartments.filter(deparment => deparment._id !== idDelete));
              notification.success({
                title: 'Thành công',
                message: 'Xoá phòng ban thành công'
              });
            }
            setIsLoadingTable(false);
          })
          .catch(() => {
            notification.error({
              title: 'Lỗi',
              message: 'Xoá phòng ban thất bại'
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
      title: 'Mã phòng ban',
      dataIndex: 'code',
      key: 'code'
    },
    {
      title: 'Tên phòng ban',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: 'Tổng số nhân viên',
      key: 'employeesId',
      dataIndex: 'employeesId',
      render: (_, record) => <span className="department__total-emp">{record.employeesId?.length || 0} nhân viên</span>
    },
    {
      title: 'Hành động',
      fixed: 'right',
      render: (_, item) => (
        <div className="department__row-action">
          <div className="action manipulated__action">
            <div className="action__edit">
              <Tooltip title="Sửa">
                <EditOutlined onClick={() => openModalUpSertDepartment(item._id)} />
              </Tooltip>
            </div>
            <div
              className="action__delete"
              onClick={() => {
                showConfirm(item._id);
              }}
            >
              <Tooltip title="Xoá">
                <DeleteOutlined />
              </Tooltip>
            </div>
          </div>
        </div>
      )
    }
  ];

  const handleAddDepartment = () => {
    const name = departmentNameRef.current.input.value;
    const code = departmentCodeRef.current.input.value;
    const url = `${getAPIHostName()}/departments`;

    if (checkIsEmpty(name) || checkIsEmpty(code)) {
      notification.error({
        title: 'Thất bại',
        message: 'Vui lòng điền đầy đủ thông tin'
      });
      return;
    }
    httpPost(url, { name, code }, accessToken)
      .then(res => {
        if (res.success) {
          setDepartmentList(oldDepartmentList => [res.data, ...oldDepartmentList]);
          notification.success({
            title: 'Thành công',
            message: 'Tạo phòng ban mới thành công'
          });
          setOpenUpSertDepartment(false);
        } else {
          notification.error({
            title: 'Lỗi',
            message: 'Tạo phòng ban mới thất bại'
          });
        }
      })
      .catch(() => {
        notification.error({
          title: 'Lỗi',
          message: 'Tạo phòng ban mới thất bại'
        });
        setOpenUpSertDepartment(false);
      });
  };

  const getDataSource = () => {
    let departmentToRender = departmentList.filter(item => !item.is_deleted);

    return departmentToRender.filter(
      item => item.name?.indexOf(searchValue) >= 0 || item.code?.indexOf(searchValue) >= 0
    );
  };

  return (
    <div>
      <div className="department__action">
        <CustomInput
          type="search"
          placeholder="Tìm kiếm"
          onChange={e => setSearchValue(e.target.value)}
          className="department__search-inp"
        />
        <Button
          className="department__search-btn"
          onClick={() => openModalUpSertDepartment()}
          rightIcon={<PlusOutlined />}
        >
          Thêm phòng ban
        </Button>
      </div>
      <Table
        pagination={true}
        loading={isLoadingTable}
        columns={columns}
        rowKey={record => record._id}
        dataSource={getDataSource()}
        scroll={{ y: 'calc(100vh - 320px)' }}
      />

      <Modal
        title={updateId ? 'Sửa phòng ban' : 'Thêm phòng ban'}
        open={openUpSertDepartment}
        onOk={() => {
          updateId ? handleUpdateDepartment(updateId) : handleAddDepartment();
        }}
        wrapClassName="add__department-modal"
        onCancel={() => setOpenUpSertDepartment(false)}
        okText={updateId ? 'Sửa' : 'Thêm'}
        cancelText="Huỷ"
      >
        <div className="add__department-label">Tên phòng ban:</div>
        <CustomInput
          onChange={e => setSelectedDepartment({ ...selectedDepartment, name: e.target.value })}
          value={selectedDepartment.name}
          ref={departmentNameRef}
          placeholder="Vui lòng nhập tên phòng ban"
        />
        <div className="add__department-label">Mã phòng ban:</div>
        <CustomInput
          onChange={e => setSelectedDepartment({ ...selectedDepartment, code: e.target.value })}
          value={selectedDepartment.code}
          ref={departmentCodeRef}
          placeholder="Vui lòng nhập mã phòng ban"
        />
      </Modal>
    </div>
  );
}

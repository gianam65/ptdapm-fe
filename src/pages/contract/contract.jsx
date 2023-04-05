import './contract.scss';
import { Table, Tag, Modal, DatePicker, notification, Tooltip } from 'antd';
import { EyeOutlined, EditOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import CustomInput from '../../components/custom-input/custom-input';
import { translateStatus, getAPIHostName, locale } from '../../utils';
import { httpGet, httpPut } from '../../services/request';
import { loadingState } from '../../recoil/store/app';
import { useSetRecoilState } from 'recoil';
import dayjs from 'dayjs';
import { convertDateStringToUnixDateTime, removeTimeFromDate, checkIsEmpty } from '../../utils';

export default function ContractPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [contractInfor, setContractInfor] = useState({});
  const [searchValue, setSearchValue] = useState('');
  const [listcontract, setListContract] = useState([]);
  const setPageLoading = useSetRecoilState(loadingState);
  const [listEmployees, setListEmployees] = useState([]);
  const [isLoadingTable, setIsLoadingTable] = useState(false);
  const [startDateContract, setStartDateContract] = useState();
  const [endDateContract, setEndDateContract] = useState();
  const [dateContract, setContractDate] = useState();

  useEffect(() => {
    Promise.all([getEmployees(), getContract()]);
    // eslint-disable-next-line
  }, []);

  const getEmployees = () => {
    setIsLoadingTable(true);
    const url = `${getAPIHostName()}/employees`;
    httpGet(url)
      .then(res => {
        if (res.success) {
          setListEmployees(res.data.employeeList);
        }
        setIsLoadingTable(false);
      })
      .catch(() => {
        setIsLoadingTable(false);
      });
  };

  const checkStartDayContract = Boolean(startDateContract || contractInfor.start_date);
  const checkEndDayContract = Boolean(endDateContract || contractInfor.end_date);

  const getContract = () => {
    const url = `${getAPIHostName()}/contracts`;
    setPageLoading(true);
    httpGet(url)
      .then(res => {
        if (res.success) {
          setListContract(res.data);
        }
        setPageLoading(false);
      })
      .catch(() => {
        notification.error({
          title: 'Error',
          message: 'Không thể lấy được dữ liệu hợp đồng'
        });
        setPageLoading(false);
      });
  };

  const handleUpCheckContract = record => {
    setContractInfor(record);
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const refreshState = () => {
    setContractDate(null);
    setStartDateContract(null);
    setEndDateContract(null);
  };

  const handleUpdateContract = () => {
    if (contractInfor.status === 'pending') {
      const url = `${getAPIHostName()}/contracts/${contractInfor._id}`;
      let buildBody = {
        ...contractInfor,
        contract_date: convertDateStringToUnixDateTime(dateContract || contractInfor.contract_date),
        start_date: convertDateStringToUnixDateTime(startDateContract),
        end_date: convertDateStringToUnixDateTime(endDateContract)
      };
      if (
        checkIsEmpty(convertDateStringToUnixDateTime(dateContract)) ||
        checkIsEmpty(convertDateStringToUnixDateTime(startDateContract)) ||
        checkIsEmpty(convertDateStringToUnixDateTime(contractInfor.contract_date)) ||
        checkIsEmpty(convertDateStringToUnixDateTime(endDateContract))
      ) {
        notification.error({
          title: 'Thất bại',
          message: 'Vui lòng điền đầy đủ thông tin'
        });
        return;
      }
      httpPut(url, buildBody)
        .then(res => {
          if (res.success) {
            getContract();
            notification.success({
              title: 'Thành công',
              message: 'Cập nhật hợp đồng thành công'
            });
          }
        })
        .catch(err => {
          console.log('err :>> ', err);
          notification.error({
            title: 'Thất bại',
            message: 'Cập nhật hợp đồng không thành công'
          });
          setPageLoading(false);
        });
      setIsModalOpen(false);
    }
    refreshState();
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const columns = [
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (_, record) => {
        let color;
        if (record.status === 'pending') {
          color = 'geekblue';
        } else if (record.status === 'completed') {
          color = 'green';
        } else {
          color = 'volcano';
        }
        return (
          <Tag color={color} key={record.key}>
            {translateStatus(record.status)}
          </Tag>
        );
      }
    },
    {
      title: 'Tên nhân viên',
      dataIndex: 'employee_name',
      key: 'employee_name',
      width: 200
    },
    {
      title: 'Chức vụ',
      dataIndex: 'position',
      key: 'position'
    },
    {
      title: 'Tên hợp đồng',
      dataIndex: 'contract_name',
      key: 'contract_name',
      width: 200
    },
    {
      title: 'Ngày kí',
      dataIndex: 'contract_date',
      key: 'contract_date',
      render: contract_date => removeTimeFromDate(contract_date)
    },
    {
      title: 'Ngày bắt đầu',
      dataIndex: 'start_date',
      key: 'start_date',
      width: 150,
      render: start_date => removeTimeFromDate(start_date)
    },
    {
      title: 'Ngày kết thúc',
      dataIndex: 'end_date',
      key: 'end_date',
      width: 150,
      render: end_date => removeTimeFromDate(end_date)
    },
    {
      title: 'Hành động',
      key: 'action',
      fixed: 'right',
      width: 120,
      render: (_, record) => {
        return (
          <div className="contract__action">
            {record.status === 'completed' || record.status === 'cancelled' ? (
              <Tooltip title="Xem">
                <EyeOutlined
                  onClick={() => {
                    handleUpCheckContract(record);
                    showModal();
                  }}
                />
              </Tooltip>
            ) : (
              <Tooltip title="Sửa">
                <EditOutlined
                  onClick={() => {
                    handleUpCheckContract(record);
                    showModal();
                  }}
                />
              </Tooltip>
            )}
          </div>
        );
      }
    }
  ];

  const getDataSource = () => {
    const dataToRender = listcontract.map(itemContract => {
      const employee = listEmployees.find(item => item._id === itemContract.employeeId);

      return { ...itemContract, employee_name: employee?.name };
    });
    return dataToRender.filter(item => item.contract_name.toLowerCase().includes(searchValue.toLowerCase()));
  };

  return (
    <div>
      <div className="contract__search">
        <CustomInput
          type="search"
          placeholder="Nhập vào đây để tìm kiếm"
          onChange={e => setSearchValue(e.target.value)}
          className="contract__search-inp"
        />
      </div>

      <Table
        pagination={true}
        columns={columns}
        dataSource={getDataSource()}
        rowKey={record => record._id}
        loading={isLoadingTable}
        locale={locale}
        scroll={{ y: 'calc(100vh - 320px)', x: 'max-content' }}
      />
      <Modal
        title="Thông tin hợp đồng"
        open={isModalOpen}
        okText={contractInfor.status === 'completed' || contractInfor.status === 'cancelled' ? 'Đóng' : 'Cập nhật'}
        cancelText={'Huỷ'}
        onOk={handleUpdateContract}
        onCancel={handleCancel}
        okButtonProps={{
          disabled: !(checkEndDayContract && checkStartDayContract)
        }}
      >
        <div className="edit__contract-label">Tên hợp đồng</div>

        <CustomInput
          value={contractInfor.contract_name}
          onChange={e => {
            setContractInfor({ ...contractInfor, contract_name: e.target.value });
          }}
          disabled={contractInfor.status === 'completed'}
        ></CustomInput>

        <div className="edit__contract-label">Tên nhân viên</div>
        <CustomInput value={contractInfor.employee_name} disabled></CustomInput>

        <div className="edit__contract-label">Chức vụ</div>
        <CustomInput
          value={contractInfor.position}
          onChange={e => {
            setContractInfor({ ...contractInfor, position: e.target.value });
          }}
          disabled={contractInfor.status === 'completed'}
        ></CustomInput>

        <div className="edit__contract-row">
          <div>
            <div className="edit__contract-label">Ngày ký hợp đồng</div>
            <DatePicker
              value={dayjs(dateContract || contractInfor.contract_date, 'YYYY-MM-DD')}
              onChange={(_, dateString) => setContractDate(dateString)}
              format="YYYY-MM-DD HH:mm"
              disabled={contractInfor.status === 'completed'}
            />
          </div>
          <div>
            <div className="edit__contract-label">Ngày bắt đầu</div>
            <DatePicker
              format="YYYY-MM-DD HH:mm"
              value={
                startDateContract || contractInfor.start_date
                  ? dayjs(startDateContract || contractInfor.start_date, 'YYYY-MM-DD')
                  : null
              }
              onChange={(_, dateString) => setStartDateContract(dateString)}
              disabled={contractInfor.status === 'completed'}
            />
          </div>
          <div>
            <div className="edit__contract-label">Ngày kết thúc</div>
            <DatePicker
              format="YYYY-MM-DD HH:mm"
              value={
                endDateContract || contractInfor.end_date
                  ? dayjs(endDateContract || contractInfor.end_date, 'YYYY-MM-DD')
                  : null
              }
              onChange={(_, dateString) => setEndDateContract(dateString)}
              disabled={contractInfor.status === 'completed'}
            />
          </div>
        </div>

        <div className="edit__contract-label">Email</div>
        <CustomInput
          value={contractInfor.email}
          onChange={e => {
            setContractInfor({ ...contractInfor, email: e.target.value });
          }}
          disabled={contractInfor.status === 'completed'}
        ></CustomInput>
        <div></div>
      </Modal>
    </div>
  );
}

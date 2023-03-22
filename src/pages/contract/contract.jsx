import './contract.scss';
import { Table, Tag, Modal, DatePicker, notification } from 'antd';
import { EyeOutlined, EditOutlined, DeleteOutlined, ExclamationCircleFilled } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import CustomInput from '../../components/custom-input/custom-input';
import { translateStatus, normalizeDate, getAPIHostName } from '../../utils';
import { httpDelete, httpGet, httpPut } from '../../services/request';
import { loadingState } from '../../recoil/store/app';
import { useSetRecoilState } from 'recoil';

const { confirm } = Modal;
export default function ContractPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [contractInfor, setContractInfor] = useState({});
  const [searchValue, setSearchValue] = useState('');
  const [listcontract, setListContract] = useState([]);
  const setPageLoading = useSetRecoilState(loadingState);
  const [listEmployees, setListEmployees] = useState([]);

  const handleChangeContractDate = value => {
    setContractInfor({ ...contractInfor, contract_date: value });
  };
  const handleChangeStartDate = value => {
    setContractInfor({ ...contractInfor, start_date: value });
  };
  const handleChangeEndDate = value => {
    setContractInfor({ ...contractInfor, end_date: value });
  };

  const showConfirm = idDelete => {
    confirm({
      title: 'Bạn có chắc muốn xoá hợp đồng này không',
      icon: <ExclamationCircleFilled />,
      onOk() {
        const url = `${getAPIHostName()}/contracts/${idDelete}`;
        httpDelete(url)
          .then(res => {
            if (res.success) {
              getContract();
              notification.success({
                title: 'Thành công',
                message: 'Huỷ hợp đồng thành công'
              });
            }
          })
          .catch(() => {
            notification.error({
              title: 'Error',
              message: 'Không thể huỷ hợp đồng'
            });
            setPageLoading(false);
          });
      },
      onCancel() {
        console.log('Cancel');
      }
    });
  };

  const getEmployees = () => {
    const url = `${getAPIHostName()}/employees`;
    httpGet(url)
      .then(res => {
        if (res.success) {
          setListEmployees(res.data.employeeList);
        }
      })
      .catch(err => console.log(err));
  };

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

  useEffect(() => {
    getContract();
    getEmployees();
    // eslint-disable-next-line
  }, []);

  const handleUpCheckContract = record => {
    setContractInfor(record);
  };
  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
    if (contractInfor.status === 'pending') {
      const url = `${getAPIHostName()}/contracts/${contractInfor._id}`;
      httpPut(url, contractInfor)
        .then(res => {
          if (res.success) {
            getContract();
            notification.success({
              title: 'Thành công',
              message: 'Cập nhật hợp đồng thành công'
            });
          }
        })
        .catch(() => {
          notification.error({
            title: 'Error',
            message: 'Cập nhật hợp đồng không thành công'
          });
          setPageLoading(false);
        });
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const columns = [
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => {
        return (
          <div className="contract__action">
            <DeleteOutlined
              onClick={() => {
                showConfirm(record._id);
              }}
            />
            {record.status === 'completed' ? (
              <EyeOutlined
                onClick={() => {
                  handleUpCheckContract(record);
                  showModal();
                }}
              />
            ) : (
              <EditOutlined
                onClick={() => {
                  handleUpCheckContract(record);
                  showModal();
                }}
              />
            )}
          </div>
        );
      }
    },
    {
      title: 'Tên hợp đồng',
      dataIndex: 'contract_name',
      key: 'contract_name'
    },
    {
      title: 'Chức vụ',
      dataIndex: 'role',
      key: 'role'
    },
    {
      title: 'Tên nhân viên',
      dataIndex: 'employee_name',
      key: 'employee_name'
    },
    {
      title: 'Ngày ký hợp đồng',
      dataIndex: 'contract_date',
      key: 'contract_date',
      render: contractDate => {
        <span>{normalizeDate(contractDate)}</span>;
      }
    },
    {
      title: 'Ngày bắt đầu có hiệu lực',
      dataIndex: 'start_date',
      key: 'start_date'
    },
    {
      title: 'Ngày kết thúc hợp đồng',
      dataIndex: 'end_date',
      key: 'end_date'
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (_, record) => {
        let color;
        if (record.status === 'pending') {
          color = 'geekblue';
        } else if (record.status === 'completed') {
          color = 'green';
        } else {
          color = 'vocalno';
        }
        return (
          <Tag color={color} key={record.key}>
            {translateStatus(record.status)}
          </Tag>
        );
      }
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email'
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
        scroll={{ y: 'calc(100vh - 320px)' }}
      />
      <Modal
        title="Thông tin hợp đồng"
        open={isModalOpen}
        okText={contractInfor.status === 'completed' ? 'OK' : 'Cập nhật'}
        onOk={handleOk}
        onCancel={handleCancel}
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
          value={contractInfor.role}
          onChange={e => {
            setContractInfor({ ...contractInfor, role: e.target.value });
          }}
          disabled={contractInfor.status === 'completed'}
        ></CustomInput>

        <div className="edit__contract-row">
          <div>
            <div className="edit__contract-label">Ngày ký hợp đồng</div>
            <DatePicker
              value={contractInfor.contract_date}
              onChange={handleChangeContractDate}
              disabled={contractInfor.status === 'completed'}
            />
          </div>
          <div>
            <div className="edit__contract-label">Ngày bắt đầu</div>
            <DatePicker
              value={contractInfor.start_date}
              onChange={handleChangeStartDate}
              disabled={contractInfor.status === 'completed'}
            />
          </div>
          <div>
            <div className="edit__contract-label">Ngày kết thúc</div>
            <DatePicker
              value={contractInfor.end_date}
              onChange={handleChangeEndDate}
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

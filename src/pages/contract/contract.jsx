import './contract.scss';
import { Table, Tag, Modal, DatePicker } from 'antd';
import { CheckOutlined, EyeOutlined } from '@ant-design/icons';
import { useState } from 'react';
import CustomInput from '../../components/custom-input/custom-input';
import { translateStatus } from '../../utils';
import moment from 'moment/moment';

export default function ContractPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [contractInfor, setContractInfor] = useState({});

  const handleCheckContract = record => {
    setContractInfor({
      contract_name: record.contract_name,
      role: record.role,
      employee_name: record.employee_name,
      contract_date: moment(record.contract_date),
      email: record.email,
      end_date: moment(record.end_date),
      start_date: moment(record.start_date)
    });
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const columns = [
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => {
        if (record.status === 'completed') {
          return (
            <EyeOutlined
              onClick={() => {
                handleCheckContract(record);
                showModal();
              }}
            />
          );
        } else {
          return (
            <CheckOutlined
              className="check-icon"
              onClick={() => {
                handleCheckContract(record);
                showModal();
              }}
            />
          );
        }
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
      key: 'contract_date'
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
        } else {
          color = 'green';
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
  const data = [
    {
      key: '1',
      contract_name: 'Hợp đồng 1 ',
      role: 'teacher',
      employee_name: 'Loi',
      contract_date: '2021-03-01',
      start_date: '2021-03-05',
      end_date: '2023-03-01',
      status: 'completed',
      email: 'loi123456@gmail.com'
    },
    {
      key: '2',
      contract_name: 'Hợp đồng 2 ',
      role: 'teacher2',
      employee_name: 'Manh',
      contract_date: '2021-03-12',
      start_date: '2021-03-06',
      end_date: '2023-03-06',
      status: 'pending',
      email: 'loi123456@gmail.com'
    }
  ];
  return (
    <div>
      <Table columns={columns} dataSource={data} />
      <Modal title="Thông tin hợp đồng" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <div className="edit__contract-label">Tên hợp đồng</div>
        <CustomInput defaultValue={contractInfor.contract_name} disabled></CustomInput>

        <div className="edit__contract-label">Tên nhân viên</div>
        <CustomInput defaultValue={contractInfor.employee_name} disabled></CustomInput>

        <div className="edit__contract-label">Chức vụ</div>
        <CustomInput defaultValue={contractInfor.role} disabled></CustomInput>

        <div className="edit__contract-row">
          <div>
            <div className="edit__contract-label">Ngày ký hợp đồng</div>
            <DatePicker value={contractInfor.contract_date} disabled />
          </div>
          <div>
            <div className="edit__contract-label">Ngày bắt đầu</div>
            <DatePicker value={contractInfor.start_date} disabled />
          </div>
          <div>
            <div className="edit__contract-label">Ngày kết thúc</div>
            <DatePicker value={contractInfor.end_date} disabled />
          </div>
        </div>

        <div className="edit__contract-label">Email</div>
        <CustomInput defaultValue={contractInfor.email} disabled></CustomInput>
        <div></div>
      </Modal>
    </div>
  );
}

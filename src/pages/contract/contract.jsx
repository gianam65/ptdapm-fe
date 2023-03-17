import './contract.scss';
import { Table, Tag, Modal, DatePicker, Select } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { useState } from 'react';
import CustomInput from '../../components/custom-input/custom-input';
export default function ContractPage() {
  const { RangePicker } = DatePicker;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dateRange, setDateRange] = useState([]);
  function handleDateChange(dates) {
    setDateRange(dates);
  }
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
        } else if (record.status === 'success') {
          color = 'green';
        } else {
          color = 'volcano';
        }
        return (
          <Tag color={color} key={record.key}>
            {record.status.toUpperCase()}
          </Tag>
        );
      }
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email'
    },
    {
      title: 'Cập nhật',
      key: 'action',
      render: (_, record) => (
        <EditOutlined
          onClick={() => {
            showModal();
          }}
        />
      )
    }
  ];
  const data = [
    {
      key: '1',
      contract_name: 'Hợp đồng 1 ',
      role: 'teacher',
      employee_name: 'Loi',
      contract_date: '01-02-2001',
      start_date: '02-03-2001',
      end_date: '02-11-2001',
      status: 'pending',
      email: 'loi123456@gmail.com'
    }
  ];
  return (
    <div>
      <Table columns={columns} dataSource={data} />;
      <Modal title="Chỉnh sửa hợp đồng" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <div className="edit__contract-label">Tên hợp đồng</div>
        <CustomInput></CustomInput>
        <div className="edit__contract-label">Tên nhân viên</div>
        <CustomInput></CustomInput>

        <div className="edit__contract-label">Chức vụ</div>
        <CustomInput></CustomInput>
        <div className="edit__contract-row">
          <div>
            <div className="edit__contract-label">Ngày ký hợp đồng</div>
            <DatePicker onChange={() => {}} />
          </div>
          <div>
          <div className="edit__contract-label">Ngày bắt đầu và kết thúc hợp đồng</div>
          <RangePicker onChange={handleDateChange} value={dateRange} />
          </div>
        </div>

        <div className="edit__contract-label">Trạng thái</div>
        <Select
          defaultValue="complete"
          style={{
            width: 120
          }}
          onChange={() => {}}
          options={[
            {
              value: 'complete',
              label: 'complete'
            },
            {
              value: 'pending',
              label: 'pending'
            },
            {
              value: 'cancel',
              label: 'cancel'
            }
          ]}
        />
        <div className="edit__contract-label">Email</div>
        <CustomInput></CustomInput>
        <div></div>
      </Modal>
    </div>
  );
}

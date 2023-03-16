import './employees-page.scss';
import { Table, notification, Modal, Popover, message, Upload } from 'antd';
import { useEffect, useState, useRef } from 'react';
import { httpGet, httpPost } from '../../services/request';
import { getAPIHostName } from '../../utils';
import { loadingState } from '../../recoil/store/app';
import { useSetRecoilState, useRecoilValue } from 'recoil';
import { fallbackToDefaultAvatar, removeTimeFromDate } from '../../utils/';
import { CSVLink } from 'react-csv';
import { CloudDownloadOutlined } from '@ant-design/icons';
import CustomInput from '../../components/custom-input/custom-input';
import { accessTokenState } from '../../recoil/store/account';
import {  MoreOutlined  } from '@ant-design/icons';

const HEADERS = [
  { label: 'Tên nhân viên', key: 'name' },
  { label: 'Email', key: 'email' },
  { label: 'Điện thoại', key: 'phoneNumber' },
  { label: 'Địa chỉ', key: 'address' },
  { label: 'Bậc lương', key: 'salaryRank' },
  { label: 'Giới tính', key: 'gender' },
  { label: 'Mã nhân viên', key: 'codeEmployee' },
  { label: 'Tình trạng hoạt động', key: 'status' },
  { label: 'Ngày sinh', key: 'BirthOfDate' }
];

const EmployeesPage = () => {
  const [listEmployees, setListEmployees] = useState([]);
  const setPageLoading = useSetRecoilState(loadingState);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const accessToken = useRecoilValue(accessTokenState);
  const [imageUrl, setImageUrl] = useState();
  const employeesNameRef = useRef(null);
  const employeesCodeRef = useRef(null);
  const employeesEmailRef = useRef(null);
  const employeesBirthdayRef = useRef(null);
  const employeesPhoneRef = useRef(null);
  const employeesGenderRef = useRef(null);

  useEffect(() => {
    const fetchEmployees = () => {
      setPageLoading(true);
      const url = `${getAPIHostName()}/employees`;
      httpGet(url)
        .then(res => {
          console.log(res, 'dataaa')
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

  const fetchAddEmployees = () => {
    const name = employeesNameRef.current.input.value;
    const code = employeesCodeRef.current.input.value;
    const email = employeesEmailRef.current.input.value;
    const birthday = employeesBirthdayRef.current.input.value;
    const phone = employeesPhoneRef.current.input.value;
    const gender = employeesGenderRef.current.input.value;
    setPageLoading(true);
    const url = `${getAPIHostName()}/employees`;
    httpPost(url, {name, code, email, birthday, phone, gender}, accessToken)
      .then(res => {
        if (res.success) {
          setListEmployees(oldEmployeeList => [res.data, ...oldEmployeeList]);
          notification.success({
            title: 'Success',
            message: 'Successfully created a new employee'
          });
        } else {
          notification.error({
            title: 'Error',
            message: res.message || 'Failed to create new employee'
          });
        }
        setPageLoading(false);
      })
      .catch(() => {
        setPageLoading(false);
      });
  };


  const columns = [
    {
      title: 'Tên nhân viên',
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
      title: 'Điện thoại',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
      render: phoneNumber => <span className="employee__phone">{phoneNumber}</span>
    },
    {
      title: 'Địa chỉ',
      key: 'address',
      dataIndex: 'address',
      render: address => <span className="employee__address">{address}</span>
    },
    {
      title: 'Bậc lương',
      dataIndex: 'salaryRank',
      key: 'salaryRank',
      render: salaryRank => <span className="employee__salary">{salaryRank}</span>
    },
    {
      title: 'Giới tính',
      dataIndex: 'gender',
      key: 'gender',
      render: gender => <span className="employee__gender">{gender}</span>
    },
    {
      title: 'Mã nhân viên',
      key: 'codeEmployee',
      dataIndex: 'codeEmployee',
      render: codeEmployee => <span className="employee__position">{codeEmployee}</span>
    },
    {
      title: 'Tình trạng hoạt động',
      key: 'status',
      dataIndex: 'status',
      render: status => <span className="employee__status">{status}</span>
    },
    {
      title: 'Ngày sinh',
      key: 'BirthOfDate',
      dataIndex: 'BirthOfDate',
      render: BirthOfDate => <span className="employee__birthday">{removeTimeFromDate(BirthOfDate)}</span>
    },
    {
      title: 'Ảnh',
      key: 'picturePath',
      dataIndex: 'picturePath',
      render: picturePath => (
        <img src={fallbackToDefaultAvatar(picturePath)} alt="employee avatar" className="employee__avatar" />
      )
    },
    {
      title: 'ACTION',
      render: (_, item) => (
        <div className="employees__row-action">
          <Popover  trigger="click">
            <MoreOutlined />
          </Popover>
        </div>
      )
    }
  ];

  const buildDataToExport = () => {
    let data = [];
    for (let i = 0; i < listEmployees.length; i++) {
      if (!listEmployees[i]) return;
      let record = {
        name: listEmployees[i].name,
        email: listEmployees[i].email,
        phoneNumber: listEmployees[i].phoneNumber,
        address: listEmployees[i].address,
        salaryRank: listEmployees[i].salaryRank,
        gender: listEmployees[i].gender,
        codeEmployee: listEmployees[i].codeEmployee,
        status: listEmployees[i].status,
        BirthOfDate: removeTimeFromDate(listEmployees[i].BirthOfDate)
      };

      data = [...data, record];
    }

    return data;
  };

  return (
    <div className="employess__section">
      <CSVLink data={buildDataToExport()} headers={HEADERS}>
        <div className="download__btn">
          Tải xuống excel
          <CloudDownloadOutlined />
        </div>
      </CSVLink>
      <div className="employees__container">
        <Table columns={columns} dataSource={listEmployees} rowKey={record => record._id} pagination={true} />
      </div>
      <Modal
        title="Add employees"
        wrapClassName="add__employees-modal"
        okText="Add"
        open={isModalOpen}
        onOk={() => fetchAddEmployees()}
        onCancel={handleCancel}
      >
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div className='add__employees_left'>
            <div className="add__employees-label">Name:</div>
            <CustomInput ref={employeesNameRef} placeholder="Enter employees name" />
            <div className="add__employees-label">Email:</div>
            <CustomInput ref={employeesEmailRef} placeholder="Enter employees email" />
            <div className="add__employees-label">Your birthday :</div>
            <CustomInput ref={employeesBirthdayRef} placeholder="Your birthday " />
            <div className="add__employees-label">phoneNumber:</div>
            <CustomInput ref={employeesPhoneRef} placeholder="Your number" />
          </div>
          <div className='add__employees_right'>
            <div className="add__employees-label">Gender:</div>
            <CustomInput ref={employeesGenderRef} placeholder="Male or Female" />
            <div className="add__employees-label">Employee code :</div>
            <CustomInput ref={employeesCodeRef} placeholder="Enter employees code" />
            <Upload
              name="avatar"
              listType="picture-circle"
              className="avatar-uploader"
              showUploadList={false}
            >
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt="avatar"
                  style={{
                    width: '100%',
                  }}
                />
              ) : (
                uploadButton
              )}
            </Upload>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default EmployeesPage;

import './employees-page.scss';
import { Table, notification, Modal, Popover, Upload, message, InputNumber, Select, Input, Pagination } from 'antd';
import { useEffect, useState, useRef } from 'react';
import { httpGet, httpPost, httpDelete } from '../../services/request';
import { getAPIHostName } from '../../utils';
import { loadingState } from '../../recoil/store/app';
import { useSetRecoilState, useRecoilValue } from 'recoil';
import { fallbackToDefaultAvatar, removeTimeFromDate } from '../../utils/';
import { CSVLink } from 'react-csv';
import { CloudDownloadOutlined } from '@ant-design/icons';
import CustomInput from '../../components/custom-input/custom-input';
import { accessTokenState } from '../../recoil/store/account';
import { MoreOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import Button from '../../components/button/button';
import Search from 'antd/es/transfer/search';

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
  const { Option } = Select;
  const [departmentList, setDepartmentList] = useState([]);
  const [benefitList, setBenefitList] = useState([]);
  const [activePage, setActivePage] = useState(1)
  const [totalPage, setTotalPage] = useState()
  const [listEmployees, setListEmployees] = useState([]);
  const setPageLoading = useSetRecoilState(loadingState);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const accessToken = useRecoilValue(accessTokenState);
  const [imageUrl, setImageUrl] = useState();
  const employeesNameRef = useRef(null);
  const employeesCodeRef = useRef(null);
  const employeesEmailRef = useRef(null);
  const employeesBirthdayRef = useRef(null);
  const employeesPhoneRef = useRef(null);
  const employeesGenderRef = useRef(null);
  const employeesAddressRef = useRef(null)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [code, setCode] = useState("")
  const [birthday, setBirthday] = useState("")
  const [phone, setPhone] = useState("")
  const [gender, setGender] = useState("")
  const [address, setAddress] = useState("")
  const [salaryRanks, setSalaryRanks] = useState(1)
  const [department, setDepartment] = useState()
  const [benefit, setBenefit] = useState()
  const [startDate, setStartDate] = useState()
  const [id, setID] = useState()
  const [modalText] = useState('Are you sure to delete this employee ?');
  const [textSearch, setTextSearch] = useState()
  const [totalEmployee, setTotalEmployee] = useState()
  const { Search } = Input
  useEffect(() => {
    fetchEmployees(activePage);
    getDepartment();
    getBenefit();
  }, []);

  const getBenefit = () => {
    const url = `${getAPIHostName()}/benefits`;
    setPageLoading(true);
    httpGet(url)
      .then(res => {
        if (res.success) {
          const { benefitList } = res.data;
          setBenefitList(benefitList);
        }
        setPageLoading(false);
      })
      .catch(() => {
        notification.error({
          title: 'Error',
          message: 'Can not get benefit data'
        });
        setPageLoading(false);
      });
  };

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

  const fetchEmployees = (activePage) => {
    setPageLoading(true);
    const url = `${getAPIHostName()}/employees?is_deleted=false&limit=4&page=${activePage}`;
    httpGet(url)
      .then(res => {
        if (res.success) {
          const { employeeList, totalPage, totalEmployee } = res.data;
          setListEmployees(employeeList);
          setActivePage(activePage)
          setTotalPage(totalPage)
          setTotalEmployee(totalEmployee)
        }
        setPageLoading(false);
      })
      .catch(() => {
        setPageLoading(false);
      });
  };

  const fetchAddEmployees = () => {
    const name = employeesNameRef.current.input.value;
    const codeEmployee = employeesCodeRef.current.input.value;
    const email = employeesEmailRef.current.input.value;
    const birthday = employeesBirthdayRef.current.input.value;
    const phoneNumber = employeesPhoneRef.current.input.value;
    const gender = employeesGenderRef.current.input.value;
    const address = employeesAddressRef.current.input.value;
    setPageLoading(true);
    const url = `${getAPIHostName()}/employees`;
    httpPost(url, { name, codeEmployee, email, birthday, phoneNumber, gender, address, salaryRanks }, accessToken)
      .then(res => {
        if (res.success) {
          notification.success({
            title: 'Success',
            message: 'Successfully created a new employee'
          });
          fetchEmployees()
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

  const handleCodeEmployee = codeEmployee => {
    setCode(codeEmployee)
    setEditModalOpen(true)
  }

  const fetchUpdateEmployees = () => {
    setPageLoading(true);
    const url = `${getAPIHostName()}/employees?department=&position=&benefit=`;
    let buildBodyToUpdate = {
      name: name,
      email: email,
      codeEmployee: code,
      phoneNumber: phone,
      gender: gender,
      address: address,
      birthday: birthday,
      deparment: department,
      benefit: benefit,
      salaryRanks: salaryRanks,
      startDate: startDate
    };
    httpPost(url, buildBodyToUpdate, accessToken)
      .then(res => {
        if (res.success) {
          notification.success({
            title: 'Success',
            message: 'Successfully update a new employee'
          })
          setEditModalOpen(false)
          fetchEmployees()
        } else {
          notification.error({
            title: 'Error',
            message: res.message || 'Failed to update new employee'
          });
        }
        setPageLoading(false);
      })
      .catch(() => {
        setPageLoading(false);
      });
  };

  const fetchDeleteEmployees = () => {
    setPageLoading(true);
    const url = `${getAPIHostName()}/employees/delete/${id}`;
    console.log(url, "12121")
    console.log(accessToken)
    httpDelete(url, accessToken)
      .then(res => {
        if (res.success) {
          notification.success({
            title: 'Success',
            message: 'Successfully delete an employee',
          });
          fetchEmployees()
        } else {
          notification.error({
            title: 'Error',
            message: res.message || 'Failed to delete an employee'
          });
        }
        setPageLoading(false);
      })
      .catch(() => {
        setPageLoading(false);
      });
  };

  const fetchSearchEmployees = (activePage) => {
    setPageLoading(true);
    const url = `${getAPIHostName()}/employees?text=${textSearch}&is_deleted=false&page=${activePage}`;
    httpGet(url, accessToken)
      .then(res => {
        if (res.success) {
          const { employeeList, totalPage } = res.data
          setListEmployees(employeeList)
          setTotalPage(totalPage)
        } else {
          notification.error({
            title: 'Error',
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
          <Popover content={content(item.codeEmployee, item._id)} trigger="click">
            <MoreOutlined />
          </Popover>
        </div>
      )
    }
  ];

  const handleID = id => {
    setID(id)
    setDeleteModalOpen(true)
  }

  const content = (codeEmployee, id) => {
    return (
      <div className="action manipulated__action">
        <div onClick={() => handleCodeEmployee(codeEmployee)} className="action__edit">
          <EditOutlined />
          <div>Edit</div>
        </div>
        <div onClick={() => handleID(id)} className="action__delete">
          <DeleteOutlined />
          <div>Xoá</div>
        </div>
      </div>
    );
  };

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

  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
    }
    return isJpgOrPng && isLt2M;
  };

  const uploadButton = (
    <div>
      {<PlusOutlined />}
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </div>
  );




  return (
    <div className="employess__section">
      <CSVLink data={buildDataToExport()} headers={HEADERS}>
        <div className="download__btn">
          Tải xuống excel
          <CloudDownloadOutlined />
        </div>
      </CSVLink>
      <div className="employees__action">
        <Search
          type="search"
          style={{
            width: 200,
          }}
          placeholder="Nhập vào đây để tìm kiếm"
          className="employees__search-inp"
          onChange={e => setTextSearch(e.target.value)}
          onSearch={() => textSearch ? fetchSearchEmployees() : fetchEmployees()}
        />
        <Button
          className="employees__search-btn"
          rightIcon={<PlusOutlined />}
          onClick={() => setIsModalOpen(true)}
        >
          Thêm nhân viên
        </Button>
      </div>
      <div className="employees__container">
        <Table columns={columns} dataSource={listEmployees} rowKey={record => record._id} pagination={{ total: totalEmployee, current: activePage, pageSize: 4, onChange: activePage => fetchEmployees(activePage) }} />
      </div>
      <Modal
        style={{ width: 10000 }}
        title="Add employees"
        wrapClassName="add__employees-modal"
        okText="Add"
        open={isModalOpen}
        onOk={() => fetchAddEmployees()}
        onCancel={() => setIsModalOpen(false)}
      >
        <div className='add_employees_modal'>
          <div className='add__employees_left'>
            <div className="add__employees-label">Name:</div>
            <CustomInput ref={employeesNameRef} placeholder="Enter employees name" />
            <div className="add__employees-label">Email:</div>
            <CustomInput ref={employeesEmailRef} placeholder="Enter employees email" />
            <div className="add__employees-label">Your birthday :</div>
            <CustomInput ref={employeesBirthdayRef} placeholder="Your birthday " />
            <div className="add__employees-label">phoneNumber:</div>
            <CustomInput ref={employeesPhoneRef} placeholder="Your number" />
            <Select placeholder="Depratment"
              style={{ width: 120 }}
            >
              {departmentList.map((list, idx) => {
                return (
                  <Option key={idx} value={list._id}>{list.name}</Option>
                )
              })}
            </Select>
            <Select placeholder="Benefit"
              style={{ width: 120 }}>
              {benefitList.map((list, idx) => {
                return (
                  <Option key={idx} value={list._id}>{list.name}</Option>
                )
              })}
            </Select>
            <Upload
              name="avatar"
              listType="picture-circle"
              className="avatar-uploader"
              showUploadList={false}
              beforeUpload={beforeUpload}
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
          <div className='add__employees_right'>
            <div className="add__employees-label">Gender:</div>
            <CustomInput ref={employeesGenderRef} placeholder="Male or Female" />
            <div className="add__employees-label">Employee code :</div>
            <CustomInput ref={employeesCodeRef} placeholder="Enter employees code" />
            <div className="add__employees-label">Address: </div>
            <CustomInput ref={employeesAddressRef} placeholder="Address" />
            <div className="add__employees-label">salaryRank: </div>
            <InputNumber type={'number'} defaultValue={salaryRanks} onChange={(value) => setSalaryRanks(value)} />

          </div>
        </div>
      </Modal>

      <Modal title="Update Employees" open={editModalOpen} onOk={() => fetchUpdateEmployees()} onCancel={() => setEditModalOpen(false)}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div className='add__employees_left'>
            <div className="add__employees-label">Name:</div>
            <CustomInput onChange={e => setName(e.target.value)} placeholder="Enter employees name" />
            <div className="add__employees-label">Email:</div>
            <CustomInput onChange={e => setEmail(e.target.value)} placeholder="Enter employees email" />
            <div className="add__employees-label">Your birthday :</div>
            <CustomInput onChange={e => setBirthday(e.target.value)} placeholder="Your birthday " />
            <div className="add__employees-label">phoneNumber:</div>
            <CustomInput onChange={e => setPhone(e.target.value)} placeholder="Your number" />
            <div className="add__employees-label">startDate:</div>
            <CustomInput onChange={e => setStartDate(e.target.value)} placeholder="Your number" />
          </div>
          <div className='add__employees_right'>
            <div className="add__employees-label">Gender:</div>
            <CustomInput onChange={e => setGender(e.target.value)} placeholder="Male or Female" />
            <div className="add__employees-label">Address: </div>
            <CustomInput onChange={e => setAddress(e.target.value)} placeholder="Address" />
            <div className="add__employees-label">salaryRank: </div>
            <InputNumber onChange={value => setSalaryRanks(value)} type={'number'} defaultValue={salaryRanks} />
            <div className='select'>
              <div>
                <Select onChange={value => setDepartment(value)} placeholder="Depratment" style={{ width: 120 }}
                >
                  {departmentList.map((list, idx) => {
                    return (
                      <Option key={idx} value={list._id}>{list.name}</Option>
                    )
                  })}
                </Select>
              </div>
              <div>
                <Select onChange={value => setBenefit(value)} placeholder="Benefit"
                  style={{ width: 120 }}>
                  {benefitList.map((list, idx) => {
                    return (
                      <Option key={idx} value={list._id}>{list.name}</Option>
                    )
                  })}
                </Select>
              </div>

            </div>
            <Upload
              name="avatar"
              listType="picture-circle"
              className="avatar-uploader"
              showUploadList={false}
              beforeUpload={beforeUpload}
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
      <Modal
        title="delete employees"
        wrapClassName="delete__employees-modal"
        okText="delete"
        open={deleteModalOpen}
        onOk={() => fetchDeleteEmployees()}
        onCancel={() => setDeleteModalOpen(false)}
      >
        <p>{modalText}</p>
      </Modal>
    </div>
  );
};

export default EmployeesPage;

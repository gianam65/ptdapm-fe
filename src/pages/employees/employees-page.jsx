import './employees-page.scss';
import { Table, notification, Modal, Tooltip, InputNumber, Select, Input } from 'antd';
import { useEffect, useState, useRef } from 'react';
import { httpGet, httpPost, httpDelete } from '../../services/request';
import { getAPIHostName } from '../../utils';
import { loadingState } from '../../recoil/store/app';
import { useSetRecoilState, useRecoilValue } from 'recoil';
import { fallbackToDefaultAvatar, removeTimeFromDate, randomText, translateStatus } from '../../utils/';
import { CSVLink } from 'react-csv';
import { CloudDownloadOutlined } from '@ant-design/icons';
import CustomInput from '../../components/custom-input/custom-input';
import { accessTokenState } from '../../recoil/store/account';
import { PlusOutlined, EditOutlined, DeleteOutlined, CloudUploadOutlined } from '@ant-design/icons';
import Button from '../../components/button/button';
import classNames from 'classnames';

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
const { Search } = Input;
const { Option } = Select;
const EmployeesPage = () => {
  const [departmentList, setDepartmentList] = useState([]);
  const [benefitList, setBenefitList] = useState([]);
  const [activePage, setActivePage] = useState(1);
  const [listEmployees, setListEmployees] = useState([]);
  const setPageLoading = useSetRecoilState(loadingState);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const accessToken = useRecoilValue(accessTokenState);
  const employeesNameRef = useRef(null);
  const employeesCodeRef = useRef(null);
  const employeesEmailRef = useRef(null);
  const employeesBirthdayRef = useRef(null);
  const employeesPhoneRef = useRef(null);
  const employeesGenderRef = useRef(null);
  const employeesAddressRef = useRef(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [birthday, setBirthday] = useState('');
  const [phone, setPhone] = useState('');
  const [gender, setGender] = useState('');
  const [address, setAddress] = useState('');
  const [salaryRanks, setSalaryRanks] = useState(1);
  const [department, setDepartment] = useState();
  const [benefit, setBenefit] = useState();
  const [startDate, setStartDate] = useState();
  const [id, setID] = useState();
  const [textSearch, setTextSearch] = useState('');
  useEffect(() => {
    Promise.all([fetchEmployees(activePage), getDepartment(), getBenefit()]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
          title: 'Lỗi',
          message: 'Không thể lấy thông tin phòng ban'
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

  const handleChangeFile = e => {
    const fileUploaded = e.target.files?.[0];
    if (!fileUploaded) return;
    const url = `${getAPIHostName()}/import_excel`;

    httpPost(url, { file: fileUploaded })
      .then(res => {
        if (res.success) {
          setListEmployees([...res.data, ...listEmployees]);
          notification.success({
            title: 'Thành công',
            message: 'Thêm nhân viên từ file thành công'
          });
        } else {
          notification.error({
            title: 'Thất bại',
            message: res.message || 'Thêm nhân viên từ file thất bại'
          });
        }
      })
      .catch(err => {
        notification.error({
          title: 'Thất bại',
          message: err || 'Thêm nhân viên từ file thất bại'
        });
      });
  };

  const fetchEmployees = activePage => {
    setPageLoading(true);
    const url = `${getAPIHostName()}/employees`;
    httpGet(url)
      .then(res => {
        if (res.success) {
          const { employeeList } = res.data;
          setListEmployees(employeeList);
          setActivePage(activePage);
        }
        setPageLoading(false);
      })
      .catch(() => {
        setPageLoading(false);
      });
  };

  const handleAddEmployees = () => {
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
            title: 'Thành công',
            message: 'Thêm nhân viên thành công'
          });
          fetchEmployees();
          setIsModalOpen(false);
        } else {
          notification.error({
            title: 'Thất bại',
            message: 'Thêm nhân viên thất bại'
          });
        }
        setPageLoading(false);
      })
      .catch(() => {
        setPageLoading(false);
      });
  };

  const handleCodeEmployee = codeEmployee => {
    setCode(codeEmployee);
    setEditModalOpen(true);
  };

  const handleUpdateEmployees = () => {
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
            title: 'Thành công',
            message: 'Cập nhật nhân viên thành công'
          });
          setEditModalOpen(false);
          fetchEmployees();
        } else {
          notification.error({
            title: 'Thất bại',
            message: 'Cập nhật nhân viên thất bại'
          });
        }
        setPageLoading(false);
      })
      .catch(() => {
        setPageLoading(false);
      });
  };

  const handleDeleteEmployees = () => {
    setPageLoading(true);
    const url = `${getAPIHostName()}/employees/delete/${id}`;
    httpDelete(url, accessToken)
      .then(res => {
        if (res.success) {
          notification.success({
            title: 'Thành công',
            message: 'Xoá nhân viên thành công'
          });
          fetchEmployees();
          setDeleteModalOpen(false);
        } else {
          notification.error({
            title: 'Thất bại',
            message: 'Xoá nhân viên thất bại'
          });
        }
        setPageLoading(false);
      })
      .catch(() => {
        setPageLoading(false);
      });
  };

  // Hàm này sửa sau, data chưa nhiều nên k cần search trên DB
  // const fetchSearchEmployees = activePage => {
  //   setPageLoading(true);
  //   const url = `${getAPIHostName()}/employees?text=${textSearch}&is_deleted=false&page=${activePage}`;
  //   httpGet(url, accessToken)
  //     .then(res => {
  //       if (res.success) {
  //         const { employeeList } = res.data;
  //         setListEmployees(employeeList);
  //       } else {
  //         notification.error({
  //           title: 'Error'
  //         });
  //       }
  //       setPageLoading(false);
  //     })
  //     .catch(() => {
  //       setPageLoading(false);
  //     });
  // };

  const columns = [
    {
      title: 'Hành động',
      render: (_, item) => (
        <div className="action manipulated__action employee__actions">
          <div onClick={() => handleCodeEmployee(item.codeEmployee)} className="action__edit">
            <Tooltip title="Sửa">
              <EditOutlined />
            </Tooltip>
          </div>
          <div onClick={() => handleID(item._id)} className="action__delete">
            <Tooltip title="Xoá">
              <DeleteOutlined />
            </Tooltip>
          </div>
        </div>
      )
    },
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
      render: status => (
        <span
          className={classNames('employee__status', {
            employee__inactive: status === 'inActive',
            employee__active: status?.toLowerCase() === 'active',
            employee__onboarding: status === 'onBoarding'
          })}
        >
          {translateStatus(status)}
        </span>
      )
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
    }
  ];

  const handleID = id => {
    setID(id);
    setDeleteModalOpen(true);
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

  const provideDatasource = () => {
    let employees = listEmployees.filter(item => !item.is_deleted);

    return employees.filter(
      item =>
        item.name?.indexOf(textSearch) >= 0 ||
        item.address?.indexOf(textSearch) >= 0 ||
        item.email?.indexOf(textSearch) >= 0 ||
        item.phoneNumber?.indexOf(textSearch) >= 0 ||
        item.code?.indexOf(textSearch) >= 0
    );
  };

  return (
    <div className="employess__section">
      <div className="file__actions">
        <CSVLink data={buildDataToExport()} headers={HEADERS}>
          <div className="download__btn">
            Tải xuống excel
            <CloudDownloadOutlined />
          </div>
        </CSVLink>
        <div className="upload__btn">
          Tải lên file
          <CloudUploadOutlined />
          <input type="file" accept=".xlsx, .xls, .csv" onChange={handleChangeFile} />
        </div>
      </div>
      <div className="employees__action">
        <Search
          type="search"
          style={{
            width: 200
          }}
          placeholder="Tìm kiếm"
          className="employees__search-inp"
          onChange={e => setTextSearch(e.target.value)}
        />
        <Button className="employees__search-btn" rightIcon={<PlusOutlined />} onClick={() => setIsModalOpen(true)}>
          Thêm nhân viên
        </Button>
      </div>
      <div className="employees__container">
        <Table
          columns={columns}
          dataSource={provideDatasource()}
          scroll={{ y: 'calc(100vh - 420px)' }}
          rowKey={record => record._id}
          pagination={true}
        />
      </div>
      <Modal
        title="Thêm nhân viên"
        wrapClassName="add__employees-modal"
        okText="Thêm"
        cancelText="Huỷ"
        open={isModalOpen}
        onOk={() => handleAddEmployees()}
        onCancel={() => setIsModalOpen(false)}
      >
        <div className="add_employees_modal">
          <div className="add__employees_left">
            <div className="add__employees-label">Tên:</div>
            <CustomInput ref={employeesNameRef} placeholder="Tên nhân viên" />
            <div className="add__employees-label">Email:</div>
            <CustomInput ref={employeesEmailRef} placeholder="Email" />
            <div className="add__employees-label">Ngày sinh:</div>
            <CustomInput ref={employeesBirthdayRef} placeholder="Ngày sinh" />
            <div className="add__employees-label">Điện thoại:</div>
            <CustomInput ref={employeesPhoneRef} placeholder="Điện thoại" />
            <div className="add__employees-selects">
              <Select placeholder="Phòng ban" style={{ width: 120 }}>
                {departmentList.map((list, idx) => {
                  return (
                    <Option key={idx} value={list._id}>
                      {list.name}
                    </Option>
                  );
                })}
              </Select>
              <Select placeholder="Quyền lợi" style={{ width: 120 }}>
                {benefitList.map((list, idx) => {
                  return (
                    <Option key={idx} value={list._id}>
                      {list.name}
                    </Option>
                  );
                })}
              </Select>
            </div>
          </div>
          <div className="add__employees_right">
            <div className="add__employees-label">Giới tính:</div>
            <CustomInput ref={employeesGenderRef} placeholder="Nam hoặc nữ" />
            <div className="add__employees-label">Mã nhân viên:</div>
            <CustomInput ref={employeesCodeRef} placeholder="Mã nhân viên" value={randomText(6)} disabled />
            <div className="add__employees-label">Địa chỉ: </div>
            <CustomInput ref={employeesAddressRef} placeholder="Địa chỉ" />
            <div className="add__employees-label">Bậc lương: </div>
            <InputNumber type={'number'} defaultValue={salaryRanks} onChange={value => setSalaryRanks(value)} />
          </div>
        </div>
      </Modal>

      <Modal
        title="Cập nhật nhân viên"
        open={editModalOpen}
        onOk={() => handleUpdateEmployees()}
        onCancel={() => setEditModalOpen(false)}
        okText="Sửa"
        cancelText="Huỷ"
      >
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div className="add__employees_left">
            <div className="add__employees-label">Tên:</div>
            <CustomInput onChange={e => setName(e.target.value)} placeholder="Tên nhân viên" />
            <div className="add__employees-label">Email:</div>
            <CustomInput onChange={e => setEmail(e.target.value)} placeholder="Email" />
            <div className="add__employees-label">Ngày sinh :</div>
            <CustomInput onChange={e => setBirthday(e.target.value)} placeholder="Ngày sinh VD: 06/05/2001" />
            <div className="add__employees-label">Điện thoại:</div>
            <CustomInput onChange={e => setPhone(e.target.value)} placeholder="Điện thoại" />
            <div className="add__employees-label">Ngày bắt đầu:</div>
            <CustomInput onChange={e => setStartDate(e.target.value)} placeholder="Ngày vào làm" />
          </div>
          <div className="add__employees_right">
            <div className="add__employees-label">Giới tính:</div>
            <CustomInput onChange={e => setGender(e.target.value)} placeholder="Nam hoặc nữ" />
            <div className="add__employees-label">Địa chỉ: </div>
            <CustomInput onChange={e => setAddress(e.target.value)} placeholder="Địa chỉ" />
            <div className="add__employees-label">Bậc lương: </div>
            <InputNumber onChange={value => setSalaryRanks(value)} type={'number'} defaultValue={salaryRanks} />
            <div className="select">
              <Select onChange={value => setDepartment(value)} placeholder="Phòng ban" style={{ width: 120 }}>
                {departmentList.map((list, idx) => {
                  return (
                    <Option key={idx} value={list._id}>
                      {list.name}
                    </Option>
                  );
                })}
              </Select>
              <Select onChange={value => setBenefit(value)} placeholder="Quyền lợi" style={{ width: 120 }}>
                {benefitList.map((list, idx) => {
                  return (
                    <Option key={idx} value={list._id}>
                      {list.name}
                    </Option>
                  );
                })}
              </Select>
            </div>
          </div>
        </div>
      </Modal>
      <Modal
        title="Xoá nhân viên"
        wrapClassName="delete__employees-modal"
        open={deleteModalOpen}
        onOk={() => handleDeleteEmployees()}
        onCancel={() => setDeleteModalOpen(false)}
        okText="Xoá"
        cancelText="Huỷ"
      >
        <p>Bạn có thật sự muốn xoá nhân viên</p>
      </Modal>
    </div>
  );
};

export default EmployeesPage;

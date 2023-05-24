import './employees-page.scss';
import { Table, notification, Modal, Tooltip, InputNumber, Select, Input, DatePicker } from 'antd';
import { useEffect, useState, useRef } from 'react';
import { httpGet, httpPost, httpPut, httpDelete } from '../../services/request';
import { getAPIHostName } from '../../utils';
import { loadingState } from '../../recoil/store/app';
import { useSetRecoilState, useRecoilValue } from 'recoil';
import {
  removeTimeFromDate,
  randomText,
  translateStatus,
  convertDateStringToUnixDateTime,
<<<<<<< HEAD
  checkIsEmpty,
  locale
} from '../../utils/';
import { removeTimeFromDate, randomText, translateStatus, convertDateStringToUnixDateTime } from '../../utils/';
=======
  checkIsEmpty
} from '../../utils/';
>>>>>>> parent of b9acf48 (#)
import { CSVLink } from 'react-csv';
import { CloudDownloadOutlined } from '@ant-design/icons';
import CustomInput from '../../components/custom-input/custom-input';
import { accessTokenState } from '../../recoil/store/account';
import { PlusOutlined, EditOutlined, DeleteOutlined, CloudUploadOutlined } from '@ant-design/icons';
import Button from '../../components/button/button';
import classNames from 'classnames';
import dayjs from 'dayjs';

const HEADERS = [
  { label: 'Tên nhân viên', key: 'name' },
  { label: 'Email', key: 'email' },
  { label: 'Điện thoại', key: 'phoneNumber' },
  { label: 'Địa chỉ', key: 'address' },
  { label: 'Bậc lương', key: 'salaryRank' },
  { label: 'Giới tính', key: 'gender' },
  { label: 'Mã nhân viên', key: 'codeEmployee' },
  { label: 'Tình trạng hoạt động', key: 'status' },
  { label: 'Ngày sinh', key: 'BirthOfDate' },
  { label: 'Khoa', key: 'faculty' }
];
const { Search } = Input;
const { Option } = Select;
const EmployeesPage = () => {
  const [departmentList, setDepartmentList] = useState([]);
  const [benefitList, setBenefitList] = useState([]);
  const [listEmployees, setListEmployees] = useState([]);
  const setPageLoading = useSetRecoilState(loadingState);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [employeeGender, setEmployeeGender] = useState('nam');
  const accessToken = useRecoilValue(accessTokenState);
  const employeesCodeRef = useRef(null);
  const employeesEmailRef = useRef(null);
  const employeesPhoneRef = useRef(null);
  const employeesAddressRef = useRef(null);
  const employeesPositionRef = useRef(null);
  const employeesFacultyRef = useRef(null);
  const [salaryRanks, setSalaryRanks] = useState(1);
  const [department, setDepartment] = useState('');
  const [benefit, setBenefit] = useState('');
  const [id, setID] = useState();
  const [textSearch, setTextSearch] = useState('');
  const [number, setNumber] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState({});
  useEffect(() => {
    fetchEmployees();
    getDepartment();
    getBenefit();
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
    console.log('e :>> ', e);
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
            message: 'Thêm nhân viên từ file thất bại'
          });
        }
      })
      .catch(err => {
        notification.error({
          title: 'Thất bại',
          message: 'Thêm nhân viên từ file thất bại'
        });
      });
  };

  const fetchEmployees = () => {
    setPageLoading(true);
    const url = `${getAPIHostName()}/employees`;
    httpGet(url)
      .then(res => {
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

  const handleAddEmployees = () => {
    const name = employeeName;
    const codeEmployee = employeesCodeRef.current.input.value;
    const email = employeesEmailRef.current.input.value;
    const phoneNumber = employeesPhoneRef.current.input.value;
    const address = employeesAddressRef.current.input.value;
    const position = employeesPositionRef.current.input.value;
    const faculty = employeesFacultyRef.current.input.value;
    if (
      checkIsEmpty(name) ||
      checkIsEmpty(codeEmployee) ||
      checkIsEmpty(phoneNumber) ||
      checkIsEmpty(email) ||
      checkIsEmpty(address) ||
      checkIsEmpty(position) ||
      checkIsEmpty(faculty)
    ) {
      notification.error({
        title: 'Thất bại',
        message: 'Vui lòng điền đầy đủ thông tin'
      });
      return;
    }
    setPageLoading(true);
    let url = `${getAPIHostName()}/employees?`;
    if (department) url += `&department=${department}`;
    if (benefit) url += `&benefit=${benefit}`;
    if (url.endsWith('?')) url = url.replace('', '?');

    httpPost(
      url,
      { name, codeEmployee, email, phoneNumber, gender: employeeGender, address, salaryRanks, position, faculty },
      accessToken
    )
      .then(res => {
        if (res.success) {
          notification.success({
            title: 'Thành công',
            message: 'Thêm nhân viên thành công'
          });
          fetchEmployees();
          refreshInputValue('');
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

  const handleOpenUpdateModal = codeEmployee => {
    setSelectedEmployee(listEmployees.find(e => e.codeEmployee === codeEmployee) || {});
    setEditModalOpen(true);
  };

  const handleUpdateEmployees = () => {
    const benefitId = selectedEmployee.benefitId[0]?._id || selectedEmployee.benefitId[0];
    const departmentId = selectedEmployee.departMentId[0]?._id || selectedEmployee.departMentId[0];
    let url = `${getAPIHostName()}/employees/${selectedEmployee._id}?`;
    if (benefitId) url += `&benefit=${benefitId}`;
    if (departmentId) url += `&department=${departmentId}`;
    if (
      checkIsEmpty(selectedEmployee.name) ||
      checkIsEmpty(selectedEmployee.codeEmployee) ||
      checkIsEmpty(selectedEmployee.phoneNumber) ||
      checkIsEmpty(selectedEmployee.email) ||
      checkIsEmpty(selectedEmployee.address) ||
      checkIsEmpty(selectedEmployee.position) ||
      checkIsEmpty(selectedEmployee.faculty)
    ) {
      notification.error({
        title: 'Thất bại',
        message: 'Vui lòng điền đầy đủ thông tin'
      });
      return;
    }
    setPageLoading(true);
    let buildBodyToUpdate = {
      name: selectedEmployee.name,
      email: selectedEmployee.email,
      codeEmployee: selectedEmployee.codeEmployee,
      phoneNumber: selectedEmployee.phoneNumber,
      gender: selectedEmployee.gender,
      address: selectedEmployee.address,
      salaryRank: selectedEmployee.salaryRank,
      startDate: convertDateStringToUnixDateTime(selectedEmployee.startDate),
      position: selectedEmployee.position,
      faculty: selectedEmployee.faculty
    };

    httpPut(url, buildBodyToUpdate, accessToken)
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
    const url = `${getAPIHostName()}/employees/delete/${id}/${selectedEmployee.contractId}`;
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

  const columns = [
    {
      title: 'Mã nhân viên',
      key: 'codeEmployee',
      dataIndex: 'codeEmployee',
      width: 200,
      render: codeEmployee => <span className="employee__position">{codeEmployee}</span>
    },
    {
      title: 'Tên nhân viên',
      dataIndex: 'name',
      key: 'name',
      width: 200,
      render: text => <span className="employee__name">{text}</span>
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      width: 300
    },
    {
      title: 'Điện thoại',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
      width: 150,
      render: phoneNumber => <span className="employee__phone">{phoneNumber}</span>
    },
    {
      title: 'Địa chỉ',
      key: 'address',
      dataIndex: 'address',
      width: 150,
      render: address => <span className="employee__address">{address}</span>
    },
    {
      title: 'Bậc lương',
      dataIndex: 'salaryRank',
      key: 'salaryRank',
      width: 100,
      render: salaryRank => <span className="employee__salary">{salaryRank}</span>
    },
    {
      title: 'Chức vụ',
      key: 'position',
      dataIndex: 'position',
      width: 150,
      render: item => item
    },
    {
      title: 'Khoa',
      key: 'faculty',
      dataIndex: 'faculty',
      width: 150
    },
    {
      title: 'Ngày làm việc',
      key: 'startDate',
      dataIndex: 'startDate',
      width: 150,
      render: startDate => <span className="employee__birthday">{removeTimeFromDate(startDate)}</span>
    },
    {
      title: 'Tình trạng hoạt động',
      key: 'status',
      dataIndex: 'status',
      width: 200,
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
      title: 'Hành động',
      width: 120,
      render: (_, item) => (
        <div className="action manipulated__action employee__actions">
          <div onClick={() => handleOpenUpdateModal(item.codeEmployee)} className="action__edit">
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
      ),
      fixed: 'right'
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
        faculty: listEmployees[i].faculty,
        gender: listEmployees[i].gender,
        codeEmployee: listEmployees[i].codeEmployee,
        status: translateStatus(listEmployees[i].status),
        BirthOfDate: removeTimeFromDate(listEmployees[i].startDate)
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
        item.code?.indexOf(textSearch) >= 0
    );
  };

  const restrictAlphabets = e => {
    setNumber(e.target.value.replace(/\D/g, ''));
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
          placeholder="Tìm kiếm"
          className="employees__search-inp"
          onChange={e => setTextSearch(e.target.value)}
        />
        <Button
          className="employees__search-btn"
          rightIcon={<PlusOutlined />}
          onClick={() => {
            setIsModalOpen(true);
          }}
        >
          Thêm nhân viên
        </Button>
      </div>
      <div className="employees__container">
        <Table
          columns={columns}
          dataSource={provideDatasource()}
          scroll={{ y: 'calc(100vh - 420px)', x: 'max-content' }}
          rowKey={record => record._id}
          pagination={true}
          locale={locale}
        />
      </div>
      <Modal
        title="Thêm nhân viên"
        wrapClassName="add__employees-modal"
        okText="Thêm"
        cancelText="Huỷ"
        open={isModalOpen}
        onOk={() => {
          handleAddEmployees();
        }}
        onCancel={() => {
          refreshInputValue();
          setIsModalOpen(false);
        }}
      >
        <div className="add_employees_modal">
          <div className="add__employees_left">
            <div className="add__employees-label">Tên:</div>
            <CustomInput
              maxLength={50}
              onChange={e => setEmployeeName(e.target.value)}
              value={employeeName}
              placeholder="Tên nhân viên"
            />
            <div className="add__employees-label">Email:</div>
            <CustomInput
              maxLength={50}
              type="email"
              onChange={e => setEmployeeEmail(e.target.value)}
              value={employeeEmail}
              placeholder="Email"
            />
            <div className="add__employees-label">Điện thoại:</div>
            <CustomInput
              value={number}
              onChange={restrictAlphabets.bind()}
              type="number"
              maxLength={10}
              ref={employeesPhoneRef}
              placeholder="Điện thoại"
            />
            <div className="add__employees-label">Chức vụ:</div>
            <CustomInput
              maxLength={50}
              onChange={e => setEmployeePosition(e.target.value)}
              value={employeePosition}
              placeholder="Chức vụ"
            />
            <div className="add__employees-selectts">
              <div className="add__employees-label">Phòng ban:</div>
              <Select
                value={department}
                onChange={value => setDepartment(value)}
                placeholder="Phòng ban"
                showSearch
                optionFilterProp="children"
                filterOption={(input, option) => (option?.children ?? '').toLowerCase().includes(input.toLowerCase())}
                notFoundContent={'Không có dữ liệu'}
              >
                {departmentList.map((list, idx) => {
                  return (
                    <Option key={idx} value={list._id}>
                      {list.name}
                    </Option>
                  );
                })}
              </Select>
              <div className="add__employees-label">Quyền lợi:</div>
              <Select
                value={benefit}
                onChange={value => setBenefit(value)}
                placeholder="Quyền lợi"
                showSearch
                optionFilterProp="children"
                filterOption={(input, option) => (option?.children ?? '').toLowerCase().includes(input.toLowerCase())}
                notFoundContent={'Không có dữ liệu'}
              >
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
            <Select placeholder="Giới tính" value={employeeGender} onChange={e => setEmployeeGender(e)}>
              <Option key={'male__gender'} value={'nam'}>
                Nam
              </Option>
              <Option key={'female__gender'} value={'nữ'}>
                Nữ
              </Option>
            </Select>
            <div className="add__employees-label">Mã nhân viên:</div>
            <CustomInput
              maxLength={50}
              ref={employeesCodeRef}
              placeholder="Mã nhân viên"
              value={randomText(6)}
              disabled
            />
            <div className="add__employees-label">Địa chỉ: </div>
            <CustomInput
              maxLength={50}
              onChange={e => setEmployeeAddress(e.target.value)}
              value={employeeAddress}
              placeholder="Địa chỉ"
            />
            <div className="add__employees-label">Bậc lương: </div>
            <InputNumber type={'number'} defaultValue={salaryRanks} onChange={value => setSalaryRanks(value)} />
            <div className="add__employees-label">Khoa: </div>
            <CustomInput
              maxLength={50}
              onChange={e => setEmployeeFaculty(e.target.value)}
              value={employeeFaculty}
              placeholder="Tên khoa"
            />
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
        <div className="update__emp-container">
          <div className="add__employees_left">
            <div className="add__employees-label">Tên:</div>
            <CustomInput
              maxLength={50}
              value={selectedEmployee.name}
              onChange={e => setSelectedEmployee({ ...selectedEmployee, name: e.target.value })}
              placeholder="Tên nhân viên"
            />
            <div className="add__employees-label">Email:</div>
            <CustomInput
              maxLength={50}
              value={selectedEmployee.email}
              onChange={e => setSelectedEmployee({ ...selectedEmployee, email: e.target.value })}
              placeholder="Email"
            />
            <div className="add__employees-label">Điện thoại:</div>
            <CustomInput
              maxLength={10}
              type="number"
              value={selectedEmployee.phoneNumber}
              onChange={e => setSelectedEmployee({ ...selectedEmployee, phoneNumber: e.target.value })}
              placeholder="Điện thoại"
            />
            <div className="add__employees-label">Chức vụ:</div>
            <CustomInput
              value={selectedEmployee.position}
              onChange={e => setSelectedEmployee({ ...selectedEmployee, position: e.target.value })}
              placeholder="Chức vụ"
            />
            <div className="add__employees-label">Ngày bắt đầu:</div>
            <DatePicker
              value={dayjs(selectedEmployee.startDate)}
              size={'middle'}
              format="YYYY-MM-DD"
              onChange={(_, dateString) => {
                setSelectedEmployee({ ...selectedEmployee, startDate: dateString });
              }}
            />
          </div>
          <div className="add__employees_right">
            <div className="add__employees-label">Giới tính:</div>
            <Select
              placeholder="Giới tính"
              value={selectedEmployee.gender}
              onChange={e => setSelectedEmployee({ ...selectedEmployee, gender: e })}
            >
              <Option key={'male__gender'} value={'nam'}>
                Nam
              </Option>
              <Option key={'female__gender'} value={'nữ'}>
                Nữ
              </Option>
            </Select>
            <div className="add__employees-label">Địa chỉ: </div>
            <CustomInput
              value={selectedEmployee.address}
              onChange={e => setSelectedEmployee({ ...selectedEmployee, address: e.target.value })}
              placeholder="Địa chỉ"
            />
            <div className="add__employees-label">Bậc lương: </div>
            <InputNumber
              value={selectedEmployee.salaryRank}
              onChange={value => setSelectedEmployee({ ...selectedEmployee, salaryRank: value })}
              type={'number'}
            />
            <div className="add__employees-selects">
              <div className="add__employees-label">Phòng ban:</div>
              <Select
                value={selectedEmployee?.departMentId?.[0]?._id}
                onChange={value => {
                  setSelectedEmployee({
                    ...selectedEmployee,
                    departMentId: departmentList.filter(dp => dp._id === value)
                  });
                }}
                placeholder="Phòng ban"
              >
                {departmentList.map((list, idx) => {
                  return (
                    <Option key={idx} value={list._id}>
                      {list.name}
                    </Option>
                  );
                })}
              </Select>
              <div className="add__employees-label">Quyền lợi:</div>
              <Select
                value={selectedEmployee?.benefitId?.[0]?._id || selectedEmployee?.benefitId?.[0]}
                onChange={value => {
                  setSelectedEmployee({
                    ...selectedEmployee,
                    benefitId: benefitList.filter(bnf => bnf._id === value)
                  });
                }}
                placeholder="Quyền lợi"
              >
                {benefitList.map((list, idx) => {
                  return (
                    <Option key={idx} value={list._id}>
                      {list.name}
                    </Option>
                  );
                })}
              </Select>
            </div>
            <div className="add__employees-label">Khoa:</div>
            <CustomInput
              maxLength={50}
              value={selectedEmployee.faculty}
              onChange={e => setSelectedEmployee({ ...selectedEmployee, faculty: e.target.value })}
              placeholder="Tên Khoa"
            />
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

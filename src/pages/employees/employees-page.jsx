import './employees-page.scss';
import { Table, notification, Modal, Popover, message, Upload } from 'antd';
import { useEffect, useState, useRef } from 'react';
import { httpGet, httpPost } from '../../services/request';
import { getAPIHostName } from '../../utils';
import { loadingState } from '../../recoil/store/app';
import { useSetRecoilState, useRecoilValue } from 'recoil';
import { fallbackToDefaultAvatar, removeTimeFromDate } from '../../utils/';
import { PlusOutlined, MoreOutlined, EditOutlined, DeleteOutlined, ExclamationCircleFilled, LoadingOutlined } from '@ant-design/icons';
import Button from '../../components/button/button';
import CustomInput from '../../components/custom-input/custom-input';
import { accessTokenState } from '../../recoil/store/account';
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
      title: 'Name',
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
      title: 'Phone',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
      render: phoneNumber => <span className="employee__phone">{phoneNumber}</span>
    },
    {
      title: 'Salary rank',
      dataIndex: 'salaryRank',
      key: 'salaryRank',
      render: salaryRank => <span className="employee__salary">{salaryRank}</span>
    },
    {
      title: 'Gender',
      dataIndex: 'gender',
      key: 'gender',
      render: gender => <span className="employee__gender">{gender}</span>
    },
    {
      title: 'Code employee',
      key: 'codeEmployee',
      dataIndex: 'codeEmployee',
      render: codeEmployee => <span className="employee__position">{codeEmployee}</span>
    },
    {
      title: 'Birth day',
      key: 'BirthOfDate',
      dataIndex: 'BirthOfDate',
      render: BirthOfDate => <span className="employee__birthday">{removeTimeFromDate(BirthOfDate)}</span>
    },
    {
      title: 'Avatar',
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
          <Popover content={content(item._id)} trigger="click">
            <MoreOutlined />
          </Popover>
        </div>
      )
    }
  ];

  const content = id => {
    return (
      <div className="action manipulated__action">
        <div className="action__edit">
          <EditOutlined />
          <div>Edit</div>
        </div>
        <div
          className="action__delete"
        >
          <DeleteOutlined />
          <div>Delete</div>
        </div>
      </div>
    );
  };
  //Modal 
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };


  const getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
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
  const handleChange = (info) => {
    if (info.file.status === 'uploading') {
      setPageLoading(true);
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, (url) => {
        setPageLoading(false);
        setImageUrl(url);
      });
    }
  };
  const uploadButton = (
    <div>
      {setPageLoading(false) ? <LoadingOutlined /> : <PlusOutlined />}
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
    <div>
      <div className="employees__action">
        <CustomInput
          type="search"
          placeholder="Type here to search"
          className="employees__search-inp"
        />
        <Button
          className="employees__search-btn"
          rightIcon={<PlusOutlined />}
          onClick={showModal}
        >
          Add employees
        </Button>
      </div>
      <div className="employees__container">
        <Table columns={columns} dataSource={listEmployees} rowKey={record => record._id} pagination={false} />
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
              action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
              beforeUpload={beforeUpload}
              onChange={handleChange}
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

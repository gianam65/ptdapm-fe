import './employees-page.scss';
import { notification, Table } from 'antd';
import { useEffect, useState } from 'react';
import { httpGet, httpPost } from '../../services/request';
import { getAPIHostName } from '../../utils';
import { loadingState } from '../../recoil/store/app';
import { useSetRecoilState } from 'recoil';
import { fallbackToDefaultAvatar, removeTimeFromDate, translateStatus } from '../../utils/';
import { CSVLink } from 'react-csv';
import { CloudDownloadOutlined, CloudUploadOutlined } from '@ant-design/icons';
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

const EmployeesPage = () => {
  const [listEmployees, setListEmployees] = useState([]);
  const setPageLoading = useSetRecoilState(loadingState);
  useEffect(() => {
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
    fetchEmployees();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      <div className="employees__container">
        <Table
          columns={columns}
          dataSource={listEmployees}
          scroll={{ y: 'calc(100vh - 320px)' }}
          rowKey={record => record._id}
          pagination={true}
        />
      </div>
    </div>
  );
};

export default EmployeesPage;

import './settings.scss';
import { httpGet, httpPut } from '../../services/request';
import { getAPIHostName, normalizeDate, getPriorityRole, fallbackToDefaultAvatar } from '../../utils';
import { useEffect, useState } from 'react';
import { loadingState } from '../../recoil/store/app';
import { accessTokenState } from '../../recoil/store/account';
import { useSetRecoilState, useRecoilValue } from 'recoil';
import { Table, Tooltip, Modal, notification } from 'antd';
import { DoubleRightOutlined, PlusOutlined } from '@ant-design/icons';
import classNames from 'classnames';
import CustomInput from '../../components/custom-input/custom-input';
import Button from '../../components/button/button';

const SettingsPage = () => {
  const [users, setUsers] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const setPageLoading = useSetRecoilState(loadingState);
  const accessToken = useRecoilValue(accessTokenState);
  useEffect(() => {
    const getUsers = () => {
      const url = `${getAPIHostName()}/users`;
      setPageLoading(true);
      httpGet(url)
        .then(res => {
          if (res.success) {
            const { userList } = res.data;
            setUsers(userList);
          }
          setPageLoading(false);
        })
        .catch(err => {
          setPageLoading(false);
        });
    };
    getUsers();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const columns = [
    {
      title: 'Tên nhân viên',
      dataIndex: 'username',
      key: 'username',
      render: text => <span className="settings__username">{text}</span>
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email'
    },
    {
      title: 'Ngày vào làm',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: date => <span className="settings__working-date">{normalizeDate(date)}</span>
    },
    {
      title: 'Quyền hạn',
      dataIndex: 'role',
      key: 'role',
      render: role => (
        <span className={classNames('settings__role', { admin__role: getPriorityRole(role) === 'Admin' })}>
          {getPriorityRole(role)}
        </span>
      )
    },
    {
      title: 'Ảnh đại diện',
      dataIndex: 'user_avatar',
      key: 'user_avatar',
      render: avatarURL => {
        return <img src={fallbackToDefaultAvatar(avatarURL)} alt="User avatar" className="settings__user-avatar" />;
      }
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => {
        const userRole = getPriorityRole(record.role);
        return (
          <span className="settings__action" onClick={() => handleToggleUserRole(record, userRole !== 'Admin')}>
            {
              <Tooltip placement="top" title={userRole === 'Admin' ? 'Giảm quyền' : 'Nâng quyền'}>
                <DoubleRightOutlined className={userRole === 'Admin' ? 'settings__down' : 'settings__up'} />
              </Tooltip>
            }
          </span>
        );
      }
    }
  ];

  const provideDataSource = () => {
    let dataSource = users.filter(item => !item.is_deleted);

    return dataSource.filter(item => item.username?.indexOf(searchValue) >= 0 || item.email?.indexOf(searchValue) >= 0);
  };

  const handleToggleUserRole = (user, upgradeRole) => {
    const { username, _id, role } = user;
    const updateMessage = `Bạn có muốn ${
      upgradeRole ? 'nâng quyền' : 'giảm quyền'
    } <span class="bolder__name">${username}</span>?`;
    Modal.confirm({
      title: <div dangerouslySetInnerHTML={{ __html: updateMessage }} />,
      onCancel: () => {
        return;
      },
      onOk: () => {
        const url = `${getAPIHostName()}/users/${_id}`;
        const buildRoleToBody = upgradeRole ? [...role, 'Admin'] : ['HR'];
        const body = { ...user, role: buildRoleToBody };
        httpPut(url, body, accessToken)
          .then(res => {
            if (res.success) {
              const copyListUsers = [...users];
              const updatedIdx = copyListUsers.findIndex(u => u._id === _id);
              copyListUsers.splice(updatedIdx, 1, res.data);
              setUsers(copyListUsers || []);
              notification.success({
                title: 'Thành công',
                message: 'Cập nhật quyền người dùng thành công'
              });
            }
          })
          .catch(() => {
            notification.error({
              title: 'Lỗi',
              message: 'Cập nhật quyền của người dùng thất bại'
            });
          });
      }
    });
  };

  return (
    <div className="settings__page-container">
      <div className="department__action">
        <CustomInput
          type="search"
          placeholder="Tìm kiếm"
          onChange={e => setSearchValue(e.target.value)}
          className="department__search-inp"
        />
        {/* <Button
          className="department__search-btn"
          // onClick={() => openModalUpSertDepartment()}
          rightIcon={<PlusOutlined />}
        >
          Thêm tài khoản
        </Button> */}
      </div>
      <Table
        dataSource={provideDataSource()}
        columns={columns}
        rowKey={record => record._id}
        pagination={true}
        scroll={{ y: 'calc(100vh - 320px)' }}
      />
    </div>
  );
};

export default SettingsPage;

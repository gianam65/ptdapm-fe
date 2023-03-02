import './settings.scss';
import { httpGet } from '../../services/request';
import { getAPIHostName, normalizeDate, getPriorityRole, fallbackToDefaultAvatar } from '../../utils';
import { useEffect, useState } from 'react';
import { loadingState } from '../../recoil/store/app';
import { useSetRecoilState } from 'recoil';
import { Table } from 'antd';
import { DoubleRightOutlined } from '@ant-design/icons';

const SettingsPage = () => {
  const [users, setUsers] = useState([]);
  const setPageLoading = useSetRecoilState(loadingState);
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
      title: 'User name',
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
      title: 'Working day',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: date => <span className="settings__working-date">{normalizeDate(date)}</span>
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: role => <span className="settings__role">{getPriorityRole(role)}</span>
    },
    {
      title: 'User avatar',
      dataIndex: 'user_avatar',
      key: 'user_avatar',
      render: avatarURL => {
        return <img src={fallbackToDefaultAvatar(avatarURL)} alt="User avatar" className="settings__user-avatar" />;
      }
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => {
        const userRole = getPriorityRole(record.role);
        return (
          <span className="settings__action">
            <DoubleRightOutlined className={userRole === 'Admin' ? 'settings__down' : 'settings__up'} />
          </span>
        );
      }
    }
  ];

  return (
    <div className="settings__page-container">
      <Table dataSource={users} columns={columns} rowKey={record => record._id} pagination={false} />
    </div>
  );
};

export default SettingsPage;

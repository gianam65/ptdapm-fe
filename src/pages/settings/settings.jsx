import './settings.scss';
import { httpGet, httpPut } from '../../services/request';
import { getAPIHostName, normalizeDate, getPriorityRole, fallbackToDefaultAvatar } from '../../utils';
import { useEffect, useState } from 'react';
import { loadingState } from '../../recoil/store/app';
import { accessTokenState } from '../../recoil/store/account';
import { useSetRecoilState, useRecoilValue } from 'recoil';
import { Table, Tooltip, Modal, notification } from 'antd';
import { DoubleRightOutlined } from '@ant-design/icons';
import classNames from 'classnames';

const SettingsPage = () => {
  const [users, setUsers] = useState([]);
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
      render: role => (
        <span className={classNames('settings__role', { admin__role: getPriorityRole(role) === 'Admin' })}>
          {getPriorityRole(role)}
        </span>
      )
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
          <span className="settings__action" onClick={() => handleToggleUserRole(record, userRole !== 'Admin')}>
            {
              <Tooltip placement="top" title={userRole === 'Admin' ? 'Downgrade role' : 'Upgrade role'}>
                <DoubleRightOutlined className={userRole === 'Admin' ? 'settings__down' : 'settings__up'} />
              </Tooltip>
            }
          </span>
        );
      }
    }
  ];

  const handleToggleUserRole = (user, upgradeRole) => {
    const { username, _id, role } = user;
    const updateMessage = `Do you want to ${
      upgradeRole ? 'upgrade' : 'downgrade'
    } <span class="bolder__name">${username}</span> role ?`;
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
                title: 'Success',
                message: res.message || 'Update user success'
              });
            }
          })
          .catch(err => {
            notification.error({
              title: 'Failed',
              message: err || 'Failed to update user'
            });
          });
      }
    });
  };

  return (
    <div className="settings__page-container">
      <Table dataSource={users} columns={columns} rowKey={record => record._id} pagination={false} />
    </div>
  );
};

export default SettingsPage;

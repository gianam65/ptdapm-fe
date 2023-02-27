import './settings.scss';
import { httpGet } from '../../services/request';
import { getAPIHostName } from '../../utils';
import { useEffect, useState } from 'react';
import { loadingState } from '../../recoil/store/app';
import { useSetRecoilState } from 'recoil';
import { notification } from 'antd';

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
            setUsers(res.data);
          }
          setPageLoading(false);
        })
        .catch(err => {
          setPageLoading(false);
          notification.error({
            title: 'Error',
            message: 'Get users failed'
          });
        });
    };
    getUsers();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  console.log('users :>> ', users);

  return <div className="settings__page-container">This is settings page</div>;
};

export default SettingsPage;

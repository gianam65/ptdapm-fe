import './home.scss';
import { useRecoilValue, useSetRecoilState, useRecoilState } from 'recoil';
import { accessTokenState, accountIdState, accountNameState, accountAvatarState } from '../../recoil/store/account';
import { useEffect, useState } from 'react';
import { httpGet, httpPut } from '../../services/request';
import { getAPIHostName } from '../../utils';
import { loadingState } from '../../recoil/store/app';
import { notification, Input } from 'antd';
import { EditOutlined, CameraOutlined } from '@ant-design/icons';
import Button from '../../components/button/button';
import { fallbackToDefaultAvatar } from '../../utils';

const Home = () => {
  const accessToken = useRecoilValue(accessTokenState);
  const userId = useRecoilValue(accountIdState);
  const [accountAvatar, setAccountAvatar] = useRecoilState(accountAvatarState);
  const [userName, setUsername] = useState('');
  const accountName = useSetRecoilState(accountNameState);
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [status, setStatus] = useState('');
  const setPageLoading = useSetRecoilState(loadingState);
  const [isEdit, setIsEdit] = useState(true);
  const [id, setId] = useState('');
  const [previewImg, setPreviewImg] = useState();
  const [img, setImg] = useState([]);

  const handleUpdateUser = id => {
    const url = `${getAPIHostName()}/users/${id}`;
    let buildBody = {};
    if (userName) buildBody = { ...buildBody, username: userName };
    if (img && img[0]) buildBody = { ...buildBody, image: img[0] };
    httpPut(url, buildBody, accessToken)
      .then(res => {
        if (res.success) {
          const { username, user_avatar } = res.data;
          setAccountAvatar(user_avatar);
          accountName(username);
          notification.success({
            title: 'Success',
            message: 'Successfully updated user'
          });
        }
      })
      .catch(() => {
        notification.error({
          title: 'Error',
          message: 'Failed to update user'
        });
      });
  };
  const handlePreview = img => {
    setImg(img);
    const url = URL.createObjectURL(img[0]);
    setPreviewImg(url);
  };

  useEffect(() => {
    const getUserDetail = () => {
      const url = `${getAPIHostName()}/users/find/${userId}`;
      setPageLoading(true);
      httpGet(url)
        .then(res => {
          if (res.success) {
            let { username, email, role, status, _id, user_avatar } = res.data;
            setUsername(username);
            setEmail(email);
            setRole(role);
            setStatus(status);
            setId(_id);
            setAccountAvatar(user_avatar);
          }
          setPageLoading(false);
        })
        .catch(() => {
          notification.error({
            title: 'Error',
            message: 'Can not get users data'
          });
          setPageLoading(false);
        });
    };
    getUserDetail();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="overview-wrapper">
      <div className="overview__heading">Employees detail </div>
      <div className="overview__content">
        <div className="overview__content-avatar">
          <input
            className="overview__inp-change-avatar"
            type="file"
            onChange={e => handlePreview(e.target.files)}
          ></input>
          <img
            src={previewImg ? previewImg : fallbackToDefaultAvatar(accountAvatar)}
            alt="User avatar"
            className="avatar__img"
          />
          <CameraOutlined className="avatar__camera" />
        </div>

        <div className="overview__content-detail">
          <div className="overview__content-detail-wrapper">
            <div className="overview__content-detail-heading">
              <div>Personal Data</div>
              <EditOutlined onClick={() => setIsEdit(false)} />
            </div>
            <div>
              <div>UserName</div>
              <input
                defaultValue={userName}
                disabled={isEdit}
                onChange={e => {
                  setUsername(e.target.value);
                }}
              />
            </div>
            <div>
              <div>Email</div>
              <Input size={'medium'} value={email} disabled></Input>
            </div>
            <div>
              <div>Role</div>
              <Input size={'medium'} value={role} disabled></Input>
            </div>
            <div>
              <div>Status</div>
              <Input size={'medium'} value={status} disabled></Input>
            </div>
            {isEdit || (
              <div className="overview__edit">
                <Button
                  className="overview__edit-cancel"
                  onClick={() => {
                    setIsEdit(true);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  className="overview__edit-ok"
                  onClick={() => {
                    handleUpdateUser(id);
                    setIsEdit(true);
                  }}
                >
                  Edit
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

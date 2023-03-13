import './home.scss';
import { useRecoilValue, useSetRecoilState, useRecoilState } from 'recoil';
import { accessTokenState, accountIdState, accountNameState, accountAvatarState } from '../../recoil/store/account';
import { useEffect, useState } from 'react';
import { httpGet, httpPut } from '../../services/request';
import { getAPIHostName } from '../../utils';
import { loadingState } from '../../recoil/store/app';
import { notification, Input } from 'antd';
import { CameraOutlined } from '@ant-design/icons';
import Button from '../../components/button/button';
import { fallbackToDefaultAvatar } from '../../utils';
import { uploadImage } from '../../config/aws';

const Home = () => {
  const accessToken = useRecoilValue(accessTokenState);
  const userId = useRecoilValue(accountIdState);
  const [accountAvatar, setAccountAvatar] = useRecoilState(accountAvatarState);
  const [userName, setUsername] = useState('');
  const setAccountName = useSetRecoilState(accountNameState);
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [status, setStatus] = useState('');
  const setPageLoading = useSetRecoilState(loadingState);
  const [id, setId] = useState('');
  const [previewImg, setPreviewImg] = useState();
  const [img, setImg] = useState(null);
  const handleUpdateUser = async id => {
    const url = `${getAPIHostName()}/users/${id}`;
    let buildBodyToUpdate = {
      username: userName
    };
    if (img) {
      const imageName = img[0].name?.split('.');
      const fileNameRandom = `${imageName[0]}-${Date.now()}.${imageName[1]}`;
      const publicUrl = await uploadImage(fileNameRandom, img[0]);

      buildBodyToUpdate = { ...buildBodyToUpdate, user_avatar: publicUrl };
    }

    httpPut(url, buildBodyToUpdate, accessToken)
      .then(res => {
        if (res.success) {
          const { user_avatar, username } = res.data;
          setAccountAvatar(user_avatar);
          setAccountName(username);
          setImg(null);
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
      <div className="overview__heading">Home page detail</div>
      <div className="overview__content">
        <div className="overview__content-avatar">
          <input
            className="overview__inp-change-avatar"
            type="file"
            onChange={e => handlePreview(e.target.files)}
            accept="image/*"
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
            </div>
            <div>
              <div>User name</div>
              <input
                defaultValue={userName}
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

            <div className="overview__edit">
              <Button className="overview__edit-cancel" onClick={() => setImg(null)}>
                Cancel
              </Button>
              <Button
                className="overview__edit-ok"
                onClick={() => {
                  handleUpdateUser(id);
                }}
                disable={!userName && !img}
              >
                Update
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

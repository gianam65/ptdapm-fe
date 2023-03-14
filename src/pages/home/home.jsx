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
import { uploadImage } from '../../config/aws';



const Home = () => {
  const accessToken = useRecoilValue(accessTokenState);
  const userId = useRecoilValue(accountIdState);
  const [accountAvatar, setAccountAvatar] = useRecoilState(accountAvatarState);
  const setAccountName = useSetRecoilState(accountNameState);
  const setPageLoading = useSetRecoilState(loadingState);
  const [previewImg, setPreviewImg] = useState();
  const [img, setImg] = useState(null);
  const [userInfor,setUserInfor]=useState({})



  const handleUpdateUser = async (userId) => {
    const url = `${getAPIHostName()}/users/${userId}`;
    let buildBodyToUpdate = {
      username: userInfor.username
    };
    if (img) {
      const imageName = img[0].name?.split('.');
      const fileNameRandom = `${imageName[0]}-${Date.now()}.${imageName[1]}`;
      const publicUrl =  await uploadImage(fileNameRandom, img[0]);
      console.log(publicUrl)
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
    const imgSize =  img[0].size
    if(imgSize>10000000){
      alert('file too big, pls choose another file')
    }else{
      setImg(img);
      const url = URL.createObjectURL(img[0]);
      setPreviewImg(url);
    }
  };



  useEffect(() => {
    const getUserDetail = () => {
      const url = `${getAPIHostName()}/users/find/${userId}`;
      setPageLoading(true);
      httpGet(url)
        .then(res => {
          if (res.success) {
            let { username, email, role, status, _id, user_avatar } = res.data;
           setUserInfor({username,email,role,status,_id,user_avatar})
           setImg(user_avatar)
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
            src={previewImg ? previewImg : img}
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
                defaultValue={userInfor.username}
                onChange={e => {
                  setUserInfor(prevUser=>({...prevUser,username:e.target.value}));
                }}
              />
            </div>
            <div>
              <div>Email</div>
              <Input size={'medium'} value={userInfor.email} disabled></Input>
            </div>
            <div>
              <div>Role</div>
              <Input size={'medium'} value={userInfor.role} disabled></Input>
            </div>
            <div>
              <div>Status</div>
              <Input size={'medium'} value={userInfor.status} disabled></Input>
            </div>

            <div className="overview__edit">
              <Button className="overview__edit-cancel" onClick={() => setImg(null)}>
                Cancel
              </Button>
              <Button
                className="overview__edit-ok"
                onClick={() => {
                  handleUpdateUser(userInfor._id);
                }}
                // disable={userInfor?.username.length===0 }
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

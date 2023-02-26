import { notification } from 'antd';
import { EyeTwoTone, EyeInvisibleOutlined } from '@ant-design/icons';
import Button from '../../components/button/button';
import './login.scss';
import loginBg from '../../assets/images/login_bg.jpg';
import { useRef } from 'react';
import { useSetRecoilState } from 'recoil';
import {
  accessTokenState,
  accountIdState,
  accountNameState,
  accountEmailState,
  accountRoleState,
  accountStatusState,
  accountAvatarState
} from '../../recoil/store/account';
import { loadingState } from '../../recoil/store/app';
import { getAPIHostName } from '../../utils/';
import { httpPost } from '../../services/request';
import CustomInput from '../../components/custom-input/custom-input';
const LoginPage = () => {
  const emailRef = useRef();
  const passwordRef = useRef();
  const setAccessToken = useSetRecoilState(accessTokenState);
  const setAccountId = useSetRecoilState(accountIdState);
  const setAccountName = useSetRecoilState(accountNameState);
  const setAccountEmail = useSetRecoilState(accountEmailState);
  const setAccountRole = useSetRecoilState(accountRoleState);
  const setAccountStatus = useSetRecoilState(accountStatusState);
  const setAccountAvatar = useSetRecoilState(accountAvatarState);
  const setPageLoading = useSetRecoilState(loadingState);

  const handleLogin = () => {
    const email = emailRef?.current.input.value;
    const password = passwordRef?.current.input.value;
    const url = `${getAPIHostName()}/auth/login`;

    setPageLoading(true);
    httpPost(url, {
      email,
      password
    })
      .then(res => {
        if (res.success) {
          const { accessToken, email, username, _id, role, status, user_avatar } = res.data;
          setAccessToken(accessToken);
          setAccountId(_id);
          setAccountName(username);
          setAccountEmail(email);
          setAccountRole(role);
          setAccountStatus(status);
          setAccountAvatar(user_avatar);
        } else {
          notification.error({
            message: res.message,
            placement: 'topRight'
          });
        }
        setPageLoading(false);
      })
      .catch(err => {
        notification.error({
          message: err.message.data,
          placement: 'topRight'
        });
        setPageLoading(false);
      });
  };

  return (
    <div className="login__container">
      <div className="login__container-inner">
        <div className="login__left">
          <img src={loginBg} alt="Login background" />
        </div>
        <div className="login__right">
          <div className="login__right-title">Welcome back</div>
          <div className="login__right-desc">Nice to see you again</div>
          <div className="login__right-form">
            <span className="login__right-label">Email</span>
            <CustomInput
              size="large"
              className="login__right-inp"
              placeholder="Please enter your email"
              ref={emailRef}
            />

            <span className="login__right-label">Password</span>
            <CustomInput
              size="large"
              type="password"
              className="login__right-inp"
              id="login__password"
              placeholder="Please enter your password"
              iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
              ref={passwordRef}
              onPressEnter={handleLogin}
            />

            <Button className="login__right-btn" large onClick={handleLogin}>
              Login
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

import { notification } from 'antd';
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
            message: 'Sai tài khoản hoặc mật khẩu',
            placement: 'topRight'
          });
        }
        setPageLoading(false);
      })
      .catch(err => {
        notification.error({
          message: err.message.data || err,
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
          <div className="login__right-title">Chào mừng trở lại</div>
          <div className="login__right-desc">Rất vui được gặp lại</div>
          <div className="login__right-form">
            <span className="login__right-label">Email</span>
            <CustomInput size="large" className="login__right-inp" placeholder="Vui lòng nhập email" ref={emailRef} />

            <span className="login__right-label">Mật khẩu</span>
            <CustomInput
              size="large"
              type="password"
              className="login__right-inp"
              id="login__password"
              placeholder="Vui lòng nhập mật khẩu"
              ref={passwordRef}
              onPressEnter={handleLogin}
            />

            <Button className="login__right-btn" large onClick={handleLogin}>
              Đăng nhập
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

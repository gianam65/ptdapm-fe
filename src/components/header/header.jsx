import './header.scss';
import { Dropdown, Modal, notification } from 'antd';
import {
  UserOutlined,
  EllipsisOutlined,
  FormOutlined,
  SecurityScanOutlined,
  SafetyCertificateOutlined
} from '@ant-design/icons';
import HomeIcon from '../svg/homeIcon';
import { useRecoilValue, useRecoilState } from 'recoil';
import {
  accountNameState,
  accountStatusState,
  // accountRoleState,
  accountAvatarState,
  accountIdState,
  accessTokenState
} from '../../recoil/store/account';
import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useRef } from 'react';
import CustomInput from '../custom-input/custom-input';
import { getAPIHostName } from '../../utils';
import { httpPut } from '../../services/request';

const items = [
  {
    key: '/',
    label: (
      <span className="dropdown__item">
        <FormOutlined />
        Thay đổi thông tin
      </span>
    )
  },
  {
    key: 'change_password',
    label: (
      <span className="dropdown__item">
        <SecurityScanOutlined />
        Đổi mật khẩu
      </span>
    )
  }
];

const Header = () => {
  const accountName = useRecoilValue(accountNameState);
  const accountStatus = useRecoilValue(accountStatusState);
  // const accountRole = useRecoilValue(accountRoleState);
  const accountAvatar = useRecoilValue(accountAvatarState);
  const accountId = useRecoilValue(accountIdState);
  const [accessToken, setAccessToken] = useRecoilState(accessTokenState);
  const navigation = useNavigate();
  const location = useLocation();
  const { pathname } = location;
  const [isOpenModal, setIsOpenModal] = useState(false);
  const oldPasswordRef = useRef(null);
  const newPasswordRef = useRef(null);
  const confirmPasswordRef = useRef(null);
  const handleHeaderAction = ({ key }) => {
    switch (key) {
      case 'change_password':
        setIsOpenModal(true);
        break;
      case '/':
        navigation('/');
        break;
      default:
        break;
    }
  };

  const validatePassword = (oldPassword, newPassword, confirmPassword) => {
    if (oldPassword === newPassword)
      return {
        valid: false,
        errorMessage: 'Mật khẩu mới phải khác với mật khẩu cũ'
      };
    if (newPassword !== confirmPassword)
      return {
        valid: false,
        errorMessage: 'Mật khẩu mới và mật khẩu xác nhận không khớp'
      };

    return { valid: true };
  };

  const handleChangePassword = () => {
    const oldPassword = oldPasswordRef.current.input.value;
    const newPassword = newPasswordRef.current.input.value;
    const confirmPassword = confirmPasswordRef.current.input.value;
    const { valid, errorMessage } = validatePassword(oldPassword, newPassword, confirmPassword);
    if (!valid) {
      notification.error({
        title: 'Lỗi',
        message: errorMessage
      });
      return;
    }

    const url = `${getAPIHostName()}/users/${accountId}?changePassword=${true}`;
    httpPut(
      url,
      {
        oldPassword,
        newPassword
      },
      accessToken
    )
      .then(res => {
        if (res.success) {
          notification.success({
            title: 'Thành công',
            message: res.message || 'Đổi mật khẩu thành công'
          });
          setAccessToken('');
        }
      })
      .catch(err => {
        notification.error({
          title: 'Thất bại',
          message: err || 'Đổi mật khẩu thất bại'
        });
      });
  };

  const handleCloseModal = () => {
    setIsOpenModal(false);
  };

  return (
    <div className="page__content-header">
      <div className="header__bread-cum">
        <HomeIcon size={20} />
        <span className="bread__cum-path">{pathname === '/' ? ' >> Dashboard' : pathname.replace('/', ' >> ')}</span>
      </div>
      <div className="header__user-info">
        <div className="name_and_status">
          <div className="header__user-name">{accountName}</div>
          <span className="header__user-status">{accountStatus}</span>
        </div>
        {accountAvatar ? (
          <img src={accountAvatar} alt="account avatar" className="header__user-img" />
        ) : (
          <div className="header__user-ava">
            <UserOutlined />
          </div>
        )}
        <Dropdown
          overlayClassName="header__action-dropdown"
          menu={{
            items,
            onClick: handleHeaderAction
          }}
          placement="bottomLeft"
        >
          <div className="header__action">
            <EllipsisOutlined />
          </div>
        </Dropdown>
      </div>
      <Modal
        title={
          <div className="change__password-title">
            <SafetyCertificateOutlined />
            Đổi mật khẩu
          </div>
        }
        open={isOpenModal}
        onOk={handleChangePassword}
        onCancel={handleCloseModal}
        okText="Cập nhật"
        cancelText="Huỷ"
      >
        <div className="change__password-container">
          <div className="change__password-label">Mật khẩu cũ</div>
          <CustomInput ref={oldPasswordRef} customClass="change__password-inp" type="password" />
          <div className="change__password-label">Mật khẩu mới</div>
          <CustomInput ref={newPasswordRef} customClass="change__password-inp" type="password" />
          <div className="change__password-label">Xác nhận mật khẩu mới</div>
          <CustomInput ref={confirmPasswordRef} customClass="change__password-inp" type="password" />
        </div>
      </Modal>
    </div>
  );
};

export default Header;

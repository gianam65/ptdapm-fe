import './header.scss';
import { Dropdown, Modal, notification } from 'antd';
import { EllipsisOutlined, SecurityScanOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import HomeIcon from '../svg/homeIcon';
import { useRecoilValue, useRecoilState } from 'recoil';
import {
  accountNameState,
  accountAvatarState,
  accountIdState,
  accessTokenState,
  accountStatusState
} from '../../recoil/store/account';
import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import CustomInput from '../custom-input/custom-input';
import { getAPIHostName, convertRouteToVNS, fallbackToDefaultAvatar } from '../../utils';
import { httpPut, httpGet } from '../../services/request';

const items = [
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
  const accountAvatar = useRecoilValue(accountAvatarState);
  const accountId = useRecoilValue(accountIdState);
  const [currentAccountName, setCurrentAccountName] = useState(accountName || '');
  const [currentAccountAvatar, setCurrentAccountAvatar] = useState(accountAvatar || '');
  const [accessToken, setAccessToken] = useRecoilState(accessTokenState);
  const accountStatus = useRecoilValue(accountStatusState);
  const navigation = useNavigate();
  const location = useLocation();
  const { pathname } = location;
  const [isOpenModal, setIsOpenModal] = useState(false);
  const oldPasswordRef = useRef(null);
  const newPasswordRef = useRef(null);
  const confirmPasswordRef = useRef(null);

  useEffect(() => {
    const getUserDetail = () => {
      const url = `${getAPIHostName()}/users/find/${accountId}`;
      httpGet(url)
        .then(res => {
          if (res.success) {
            setCurrentAccountName(res.data.username);
            setCurrentAccountAvatar(res.data.user_avatar);
          }
        })
        .catch(() => {
          notification.error({
            title: 'Lỗi',
            message: 'Không thể lấy thông tin người dùng'
          });
        });
    };
    getUserDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accountName, accountAvatar]);

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

    if (newPassword?.length < 6) {
      return {
        valid: false,
        errorMessage: 'Mật khẩu mới phải ít nhất 6 kí tự'
      };
    }

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

    const url = `${getAPIHostName()}/users/change-password/${accountId}`;
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
            message: 'Đổi mật khẩu thành công'
          });
          setAccessToken('');
        } else {
          notification.error({
            title: 'Thất bại',
            message: 'Đổi mật khẩu thất bại'
          });
        }
      })
      .catch(() => {
        notification.error({
          title: 'Thất bại',
          message: 'Đổi mật khẩu thất bại'
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
        <span className="bread__cum-path">
          {pathname === '/' ? ' >> Trang chủ' : convertRouteToVNS(pathname).replace('/', ' >> ')}
        </span>
      </div>
      <div className="header__user-info">
        <div className="name_and_status">
          <div className="header__user-name">{currentAccountName || accountName}</div>
          <span className="header__user-status">
            {accountStatus === 'Active' ? 'Đang hoạt động' : 'Chưa hoạt động'}
          </span>
        </div>
        {currentAccountAvatar || accountAvatar ? (
          <img src={currentAccountAvatar || accountAvatar} alt="account avatar" className="header__user-img" />
        ) : (
          <img src={fallbackToDefaultAvatar(accountAvatar)} alt="account__avatar" className="header__user-img" />
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

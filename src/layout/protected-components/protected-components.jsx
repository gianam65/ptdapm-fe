import { useRecoilValue } from 'recoil';
import { useEffect, useState } from 'react';
import { accessTokenState } from '../../recoil/store/account';
import { useLocation, useNavigate } from 'react-router-dom';

const PUBLIC_ROUTES = ['/login'];
const ProtectedComponents = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { pathname } = location;
  const accessToken = useRecoilValue(accessTokenState);
  const [isRender, setIsRender] = useState(false);

  useEffect(() => {
    if (accessToken) {
      if (pathname === '/login') {
        navigate('/');
      } else {
        setIsRender(true);
      }
    } else {
      if (!PUBLIC_ROUTES.includes(pathname)) {
        navigate('/login');
      } else {
        setIsRender(true);
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, accessToken]);

  return <>{isRender ? children : null}</>;
};

export default ProtectedComponents;

import './index.scss';
import SideMenu from '../components/side-menu/side-menu';
import Header from '../components/header/header';

const PageLayout = ({ children }) => {
  return (
    <div className="default__layout-container">
      <div className="menu__side">
        <SideMenu />
      </div>
      <div className="page__content">
        <Header />
        {children}
      </div>
    </div>
  );
};

export default PageLayout;

import './index.scss';
const PageLayout = ({ children }) => {
  return (
    <div className="default__layout-container">
      <div className="menu__side">Test menu</div>
      <div className="page__content">{children}</div>
    </div>
  );
};

export default PageLayout;

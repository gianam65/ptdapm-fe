import './error-page.scss';
import errorBg from '../../assets/images/error_bg.jpg';
import Button from '../../components/button/button';
import config from '../../config';

const ErrorPage = () => {
  return (
    <div className="error__page-container">
      <img src={errorBg} alt="Error background" />

      <div className="error__text">
        Something went
        <span className="bolder-txt">WRONG!</span>
        <Button className="error__btn" to={config.routes.home || '/'}>
          Back to home
        </Button>
      </div>
    </div>
  );
};

export default ErrorPage;

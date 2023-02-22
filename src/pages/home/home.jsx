import './home.scss';
import Button from '../../components/common/button/button';
import Checkboxes from '../../components/common/checkbox/checkbox';
import Input from '../../components/common/input/input';
import Notify from '../../components/common/nofity/notify';
import { useState } from 'react';
const Home = () => {
  const [showNotify, setShowNotify] = useState(false);
  const handleClose = () => {
    setShowNotify(false);
  };
  return (
    <div className="home__container">
      This is home page
      <h1>hello</h1>
      <Button
        className="hehehe"
        onClick={() => {
          setShowNotify(true);
        }}
      >
        Test btn
      </Button>
      <Checkboxes large />
      <Input large />
      <Notify
        showNotify={showNotify}
        onClose={handleClose}
        autoHideDuration={3000}
        severity={'success'}
        message={'add thanh cong'}
        position="top right"
      />
      <div>HEHEHE</div>
    </div>
  );
};

export default Home;

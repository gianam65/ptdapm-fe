import './home.scss';
import Button from '../../components/common/button/button';
import Input from '../../components/common/input/input';
import Notify from '../../components/common/nofity/notify';
import { useState } from 'react';
const Home = () => {
  const [showNotify, setShowNotify] = useState(false)
  const handleClose = ()=>{
  setShowNotify(false)
 }
  return (
    <div className="home__container">
      This is home page
      <h1>hello</h1>
      <Button onClick={()=>{setShowNotify(true)}}>Test btn</Button>
      <Input />
      <Notify showNotify={showNotify} closeNotify={handleClose} warning message={'add that bai'}/>
    </div>
  );
};

export default Home;

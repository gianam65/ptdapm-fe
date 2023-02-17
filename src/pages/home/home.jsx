import './home.scss';
import Button from '../../components/common/button/button';
import Checkboxes from '../../components/common/checkbox/checkbox'
  const Home = () => {
  return (
    <div className="home__container">
      This is home page
      <h1>hello</h1>
      <Button className="hehehe">Test btn</Button>
      <Checkboxes large />
    </div>
  );
};

export default Home;

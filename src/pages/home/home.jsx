import './home.scss';
import Button from '../../components/common/button/button';
import Input from '../../components/common/input/input';
const Home = () => {
  return (
    <div className="home__container">
      This is home page
      <h1>hello</h1>
      <Button >Test btn</Button>
      <Input />
    </div>
  );
};

export default Home;

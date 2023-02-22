import './home.scss';
import Button from '../../components/common/button/button';
import Checkboxes from '../../components/common/checkbox/checkbox'
import Select from '../../components/common/select/select';
import { useState } from "react"
const Home = () => {
  const [age, setAge] = useState('');

  const handleChange = (event) => {
    setAge(event.target.value);
  };

  const data = [
    {
      "id": 1,
      "name": "Nguyễn Đức Thắng"
    },
    {
      "id": 2,
      "name": "Nguyễn Đức Phúc Anh"
    },
    {
      "id": 3,
      "name": "Đinh Thị Phương Dung"
    },
    {
      "id": 4,
      "name": "Nguyễn Thị Bích Hường"
    },
    {
      "id": 5,
      "name": "Nguyễn Thị Bích Hường"
    }

  ]
  return (
    <div className="home__container">
      This is home page
      <h1>hello</h1>
      <Button className="hehehe">Test btn</Button>
      <Checkboxes large />
      <Select value={age} className="hahaha" inputValue={"Hoàng"} sx menuValue={data} onChange={handleChange} />
    </div>
  );
};

export default Home;

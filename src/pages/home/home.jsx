import './home.scss';
import Button from '../../components/common/button/button';
import Checkboxes from '../../components/common/checkbox/checkbox'
import Select from '../../components/common/select/select';
import { MenuItem } from '@mui/material';
import { useState } from "react"
import DataSelect from "../../components/common/dateSelect/dateSelect"
const Home = () => {
  const [age, setAge] = useState('');
  const [date, setDate] = useState('')
console.log(date, "123")
  const handleChange = (event) => {
    setAge(event.target.value);
  };
  console.log(age)
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
    }

  ]
  return (
    <div className="home__container">
      This is home page
      <h1>hello</h1>
      <Button className="hehehe">Test btn</Button>
      <Checkboxes large />
      <Select value={age} className="hahaha" inputValue={"Hoàng"} sx onChange={handleChange}>
        {data.map(data => <MenuItem value={data.id} key={data.id}>{data.name}</MenuItem>)}
      </Select>
    </div>
  );
};

export default Home;

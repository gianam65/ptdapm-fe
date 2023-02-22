import './home.scss';
import Button from '../../components/common/button/button';
import Checkboxes from '../../components/common/checkbox/checkbox';
import Input from '../../components/common/input/input';
import Notify from '../../components/common/nofity/notify';
import { useState } from 'react';
import DataSelect from '../../components/common/dateSelect/dateSelect';
import Select from '../../components/common/select/select';
import { MenuItem } from '@mui/material';

const Home = () => {
  const [showNotify, setShowNotify] = useState(false);
  const handleClose = () => {
    setShowNotify(false);
  };
  const [age, setAge] = useState('');

  const handleChange = event => {
    setAge(event.target.value);
  };
  const data = [
    {
      id: 1,
      name: 'Nguyễn Đức Thắng'
    },
    {
      id: 2,
      name: 'Nguyễn Đức Phúc Anh'
    },
    {
      id: 3,
      name: 'Đinh Thị Phương Dung'
    },
    {
      id: 4,
      name: 'Nguyễn Thị Bích Hường'
    },
    {
      id: 5,
      name: 'Nguyễn Thị Bích Hường'
    }
  ];
  return (
    <div className="home__container">
      This is home page
      <h1>hello</h1>
      <Button
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
      <Select value={age} className="hahaha" inputValue={'Hoàng'} onChange={handleChange}>
        {data.map(data => (
          <MenuItem value={data.id} key={data.id}>
            {data.name}
          </MenuItem>
        ))}
      </Select>
      <br />
      <DataSelect />
    </div>
  );
};

export default Home;

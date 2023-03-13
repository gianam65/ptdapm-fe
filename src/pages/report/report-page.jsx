import { Chart } from "react-chartjs-2"
import { Button } from "antd/es/radio";
import {
  BarElement,
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { getAPIHostName } from '../../utils';
import React, { useState } from 'react';
import { useEffect } from 'react';
import { useSetRecoilState } from 'recoil';
import { httpGet } from "../../services/request";
import { notification } from 'antd';
import { loadingState } from '../../recoil/store/app';


ChartJS.register(
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);
export default function ReportPage() {
  const [reportList, setreportList] = useState([]);
  const setPageLoading = useSetRecoilState(loadingState);
  const [type, setType] = useState('bar')


  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Employees Chart',
      },
    },
  };
  const labels = reportList.map((item) => item.createdAt.slice(0, 10));


  useEffect(() => {
    const getEmployee = () => {
      const url = `${getAPIHostName()}/employees`;
      setPageLoading(true)
      httpGet(url)
        .then(res => {
          console.log(res, "11111111")
          console.log(res.data)
          if (res.success) {
            const { employeeList } = res.data
            setreportList(employeeList)
          }
          setPageLoading(false)
        })
        .catch(() => {
          notification.error({
            title: "Error",
            message: "can not get report data"
          })
          setPageLoading(false)
        })
    }
    getEmployee()
  }, [])
 
  const data = {
    labels,
    type: type,
    datasets: [
      // type: 'bar' as const,
      {
        type: type,
        label: 'Employees',
        backgroundColor: 'rgb(54, 162, 235)',
        data: reportList.map((item, key) => key),
        borderColor: 'rgb(75, 192, 192)',
        borderWidth: 2,
      }
    ],
  };

  return <div className="reports__container">
    <div>
      <div>
      </div>
      <Chart type='bar' data={data} options={options}/>
      <div style={{textAlign: "center"}}>
        <Button onClick={() => setType('bar')}>Bar Chart</Button>
        <Button onClick={() => setType('line')}>Line Chart</Button>
        <Button onClick={() => setType('doughnut')}>Doughnut Chart</Button>
      </div>
    </div>

  </div>;
}

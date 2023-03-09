import { Line, Bar } from "react-chartjs-2"
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
} from 'chart.js';
import { getAPIHostName } from '../../utils';
import React, { useState } from 'react';
import { useEffect } from 'react';
import { useSetRecoilState } from 'recoil';
import { httpGet } from "../../services/request";
import { notification } from 'antd';
import { loadingState } from '../../recoil/store/app';


ChartJS.register(
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
  const [usersList, setUserList] = useState([])
  const setPageLoading = useSetRecoilState(loadingState);

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
    const getUsers = () => {
      const url = `${getAPIHostName()}/users`;
      setPageLoading(true)
      httpGet(url)
        .then(res => {
          if (res.success) {
            const { userList } = res.data
            setUserList(userList)
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
    getUsers()
  }, [])
  const data = {
    labels,
    datasets: [
      {
        label: 'Employees',
        data: reportList.map((item, key) => item),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
      {
        label: 'Users',
        data: usersList.map((item, key) => key),
        borderColor: 'rgb(75,192,192)',
        backgroundColor: 'rgb(75,192,192)',
      }
    ],
  };
  return <div className="reports__container">
    <div style={{ width: 600 }}>
      <Line data={data} options={options} />
    </div>
    <div style={{ width: 600 }}>
      <Bar data={data} options={options} />
    </div>
  </div>;
}

import { Line, Bar, Doughnut } from "react-chartjs-2"
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
  const LineChartdata = {
    labels,
    datasets: [
      {
        label: 'Employees',
        data: reportList.map((item, key) => key),
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
  const barChartdata = {
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
  const doughnutData = {
    labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
    datasets: [
      {
        label: '# of Votes',
        data: [12, 19, 3, 5, 2, 3],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };
  return <div className="reports__container">
    <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap" }}>
      <div style={{ width: 600 }}>
        <Line data={LineChartdata} options={options} />
      </div>
      <div style={{ width: 300 }}>
        <Doughnut data={doughnutData} options={options} />
      </div>
      <div style={{ width: 600 }}>
        <Bar data={barChartdata} options={options} />
      </div>
    </div>

  </div>;
}

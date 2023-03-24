import { Chart } from 'react-chartjs-2';
// import { Button } from 'antd/es/radio';
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
  ArcElement,
  LineController,
  BarController
} from 'chart.js';
import { getAPIHostName } from '../../utils';
import React, { useState } from 'react';
import { useEffect } from 'react';
import { useSetRecoilState } from 'recoil';
import { httpGet } from '../../services/request';
import { notification } from 'antd';
import { loadingState } from '../../recoil/store/app';

ChartJS.register(
  ArcElement,
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineController,
  LineElement,
  Title,
  Tooltip,
  Legend
);
const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top'
    },
    title: {
      display: true,
      text: 'Biểu đồ nhân viên'
    }
  }
};
export default function ReportPage() {
  const [reportList, setReportList] = useState([]);
  const setPageLoading = useSetRecoilState(loadingState);
  // const [type, setType] = useState('bar');

  useEffect(() => {
    const getEmployee = () => {
      const url = `${getAPIHostName()}/report`;
      setPageLoading(true);
      httpGet(url)
        .then(res => {
          if (res.success) {
            const { dataEmployee, dataUser } = res.data;

            setReportList([...dataEmployee, ...dataUser]);
          }
          setPageLoading(false);
        })
        .catch(err => {
          notification.error({
            title: 'Lỗi',
            message: 'Không thể lấy dữ liệu'
          });
          setPageLoading(false);
        });
    };
    getEmployee();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const seperateDataByDate = () => {
    console.log("reportList",reportList);
    const groupEmployeesByDateStartWorking = reportList.reduce(
      (acc, curr) => {
        if (curr.createdAt) {
          let fromMap = acc.map[curr.createdAt.split('T')[0]];
          if (!fromMap) {
            acc.map[curr.createdAt.split('T')[0]] = fromMap = {
              totalEmployees: 0,
              workingAt: curr.createdAt.split('T')[0]
            };
            acc.result.push(fromMap);
          }
          fromMap.totalEmployees += 1;
        } else {
          acc.result.push(curr);
        }

        return acc;
      },
      {
        map: {},
        result: []
      }
    ).result;

    console.log("groupEmployeesByDateStartWorking",groupEmployeesByDateStartWorking);

    let result = groupEmployeesByDateStartWorking.sort((a, b) => {
      return Date.parse(a.workingAt) - Date.parse(b.workingAt) > 0 ? 1 : -1;
    });
    return result;
    // return customChartDataByDay('90days', result);
  };

  // Using this function to apply filter by day, month into this charts (week, month, 3 months)
  // eslint-disable-next-line
  const customChartDataByDay = (date = '90days', datas) => {
    const today = new Date().toLocaleDateString();
    const unixADayTime = 86400000; // a day;
    let result = datas;
    switch (date) {
      case '7days':
        const aWeekAgo2UnixTime = Date.parse(today) - 7 * unixADayTime;
        result = datas.filter(data => {
          return Date.parse(data.workingAt) <= Date.parse(today) && Date.parse(data.workingAt) >= aWeekAgo2UnixTime;
        });
        break;
      case '30days':
        const aMonthAgo2UnixTime = Date.parse(today) - 30 * unixADayTime;
        result = datas.filter(data => {
          return Date.parse(data.workingAt) <= Date.parse(today) && Date.parse(data.workingAt) >= aMonthAgo2UnixTime;
        });
        break;
      case '90days':
        const threeMonthAgo2UnixTime = Date.parse(today) - 90 * unixADayTime;
        result = datas.filter(data => {
          return (
            Date.parse(data.workingAt) <= Date.parse(today) && Date.parse(data.workingAt) >= threeMonthAgo2UnixTime
          );
        });
        break;
      default:
        result = datas;
        break;
    }
    return result;
  };

  const data = {
    labels: seperateDataByDate().map(item => item.workingAt),
    type: 'bar',
    datasets: [
      {
        type: 'bar',
        label: 'Nhân viên',
        backgroundColor: 'rgb(54, 162, 235)',
        data: seperateDataByDate().map((_, key) => key),
        borderColor: 'rgb(75, 192, 192)',
        borderWidth: 1
      }
    ]
  };

  return (
    <div className="reports__container">
      <div>
        <Chart type="bar" data={data} options={options} />
        {/* <div style={{ textAlign: 'center' }}>
          <Button onClick={() => setType('bar')}>Biểu đồ cột</Button>
          <Button onClick={() => setType('line')}>Biểu đồ đường</Button>
          <Button onClick={() => setType('doughnut')}>Biểu đồ tròn</Button>
        </div> */}
      </div>
    </div>
  );
}

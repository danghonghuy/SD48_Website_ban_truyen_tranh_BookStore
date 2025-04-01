import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

function orderPercent(obj) {

    const options = {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Order Percently',
          },
        },
      };
  
  
      const orderPercents = ["orderSuccess", "orderCancle", "orderFailed"];
  
      const dataorderPercents = {
        orderPercents,
        datasets: [
          {
            fill: true,
            label: 'Orders',
            data: orderPercents.map((item) => {
              return obj[item] * 100
            }),
            borderColor: 'rgb(53, 162, 235)',
            backgroundColor: 'rgba(53, 162, 235, 0.5)',
          },
        ],
      };

    return ( <Line options={options} data={dataorderPercents} />  );
}

export default orderPercent;
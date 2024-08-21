"use client"

import {Bar} from "react-chartjs-2";
import { useState, useEffect } from "react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';


ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);


const BarChart = ({chartTitle, chartData}) => {
  const [labels, setLabels] = useState([]);
  const [data, setData] = useState([])

  useEffect(() => {
    if(chartData){
      setLabels(chartData.map((data) => data.label));
      setData(chartData.map((data) => data.data));
    }
  }, [chartData]);
  
  

  const sampleData = {
    labels: labels,
    datasets: [
        {
            label: 'TOPLAM',
            data: data,
            backgroundColor: 'rgba(160, 200, 255, 0.8)',
            borderColor: ['rgba(54, 162, 235, 1)'],
            borderWidth: 1
        },
    ],
  };
    
  const options = {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: chartTitle,
        },
      },
    };

  return (<Bar options={options} data={sampleData}/>);


}
export default BarChart;
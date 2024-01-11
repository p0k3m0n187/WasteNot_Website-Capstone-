import React from 'react';
import { Bar } from "react-chartjs-2";
import {Chart as Chartjs} from 'chart.js/auto';


function SalesChart({salesData}) {
    return <Bar data={salesData}/>;
}

export default SalesChart;
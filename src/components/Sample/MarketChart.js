import React from 'react';
import { Pie } from "react-chartjs-2";
import {Chart as Chartjs} from 'chart.js/auto';


function MarketChart({InventoryData}) {
    return <Pie data={InventoryData}/>;
}

export default MarketChart;
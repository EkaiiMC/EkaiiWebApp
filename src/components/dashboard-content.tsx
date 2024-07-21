"use client";

import {Line} from "react-chartjs-2";
import {
  BubbleDataPoint,
  CategoryScale,
  Chart,
  ChartData,
  LinearScale,
  LineElement,
  Point,
  PointElement
} from "chart.js";

Chart.register(LinearScale, CategoryScale, PointElement, LineElement);

const chartData: ChartData<"line", (number | [number, number] | Point | BubbleDataPoint | null)[], unknown> = {
  labels: ['20h', '21h', '22h', '23h', '00h', '01h', '02h', '03h', '04h', '05h', '06h', '07h'],
  datasets: [
    {
      label: 'My First Dataset',
      data: [65, 59, 80, 81, 56, 55, 40],
      fill: false,
      borderColor: '#e25697',
      tension: 0.1
    }
  ],
};

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
      position: 'top' as const,
    },
    title: {
      display: true,
      text: 'Joueurs connectés',
    }
  }
};

export default function DashboardContent() {
  return (
    <div className={'h-full'}>
      <div className={'w-full flex justify-evenly'}>
        <div className={'w-full h-full bg-greenText p-2 relative m-2'}>
          <h1 className="text-xl font-bold">Serveur Minecraft</h1>
          <p className="text-lg">Online</p>
        </div>
        <div className={'w-full h-full bg-redText p-2 relative m-2'}>
          <h1 className="text-xl font-bold">Site web</h1>
          <p className="text-lg">Online</p>
        </div>
        <div className={'w-full h-full bg-bgLighterGray p-2 relative m-2'}>
          <h1 className="text-xl font-bold">Bot Discord</h1>
          <p className="text-lg">Online</p>
        </div>
        <div className={'w-full h-full bg-bgLighterGray p-2 relative m-2'}>
          <h1 className="text-xl font-bold">Joueurs connectés</h1>
          <p className="text-lg">Online</p>
        </div>
      </div>
      <div className={'bg-bgLighterGray m-2 p-2 h-4/5'}>
        <Line options={options} data={chartData}/>
      </div>
    </div>

  );
}
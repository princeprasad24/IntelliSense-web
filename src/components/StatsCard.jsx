import React from 'react';
import { Line } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Tooltip,
  Filler 
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler);

const StatsCard = ({ title, value, unit, goal, icon: Icon, trendData, color , onClick }) => {
  
  const percentage = Math.min((Number(value) / goal) * 100, 100);

  const chartData = {
    labels: trendData.map((_, i) => i),
    datasets: [
      {
        data: trendData,
        borderColor: color,
        borderWidth: 2,
        backgroundColor: (context) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 50);
          gradient.addColorStop(0, `${color}40`); 
          gradient.addColorStop(1, `${color}00`); 
          return gradient;
        },
        fill: true, 
        tension: 0.4, 
        pointRadius: 0, 
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: { display: false },
      y: { 
        display: false,
        suggestedMin: Math.min(...trendData) * 0.9, 
        suggestedMax: Math.max(...trendData) * 1.1  
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false },
    },
  };

  return (
    <div onClick={onClick} className="bg-white p-6 rounded-4xl shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md transition-all">
      {/* Top Section: Icon and Goal */}
      <div className="flex justify-between items-start mb-2">
        <div className="p-2 rounded-xl" style={{ backgroundColor: `${color}15` }}>
          <Icon size={20} style={{ color: color }} />
        </div>
        <div className="text-right">
          <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Goal: {goal}{unit}</p>
        </div>
      </div>

      {/* Middle Section: Label and Value */}
      <div>
        <h3 className="text-gray-400 text-xs font-bold mb-1 uppercase tracking-tight">{title}</h3>
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-black text-slate-800">{value}</span>
          <span className="text-gray-400 text-[10px] font-bold uppercase">{unit}</span>
        </div>
      </div>

      {/* Bottom Section: Area Sparkline */}
      <div className="h-16 w-full -mx-2 mt-2">
        <Line data={chartData} options={chartOptions} />
      </div>

      {/* Progress Bar Footer */}
      <div className="mt-2">
        <div className="flex justify-between items-center mb-1">
          <span className="text-[10px] font-black" style={{ color: color }}>{percentage.toFixed(0)}%</span>
        </div>
        <div className="w-full h-1.5 bg-gray-50 rounded-full overflow-hidden">
          <div 
            className="h-full rounded-full transition-all duration-700" 
            style={{ width: `${percentage}%`, backgroundColor: color }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
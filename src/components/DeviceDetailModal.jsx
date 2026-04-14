import React from 'react';
import { X, Activity, AlertCircle, CheckCheck } from 'lucide-react';
import { Line } from 'react-chartjs-2';

const DeviceDetailModal = ({ isOpen, onClose, data, title, color }) => {
  if (!isOpen) return null;

  const chartData = {
    labels: data.map((_, i) => `${i}s`),
    datasets: [{
      label: title,
      data: data,
      borderColor: color,
      backgroundColor: `${color}20`,
      fill: true,
      tension: 0.4
    }]
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-[2.5rem] w-full max-max-w-2xl overflow-hidden shadow-2xl">
        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-slate-800">{title} Analysis</h2>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
              <X size={24} />
            </button>
          </div>

          <div className="h-64 mb-8">
            <Line data={chartData} options={{ maintainAspectRatio: false }} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 p-6 rounded-3xl">
              <div className="flex items-center gap-2 text-slate-500 mb-2">
                <Activity size={18} />
                <span className="text-xs font-bold uppercase">Pattern Status</span>
              </div>
              <p className="text-sm font-semibold text-slate-800">
                {Math.max(...data) > 0.7 ? "High-Frequency Jitter Detected" : "Stable Sinusoidal Wave"}
              </p>
            </div>

            <div className="bg-slate-50 p-6 rounded-3xl">
              <div className="flex items-center gap-2 text-slate-500 mb-2">
                <AlertCircle size={18} />
                <span className="text-xs font-bold uppercase">AI Recommendation</span>
              </div>
              <p className="text-sm font-semibold text-slate-800">
                {Math.max(...data) > 0.7 ? "Check bearing lubrication immediately." : "No action required. Monitoring."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeviceDetailModal;
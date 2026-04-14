import React from "react";
import {
  Activity,
  Droplets,
  Lightbulb,
  AlertOctagon,
  Settings,
  CircleDot,
  X,
  Fan,
} from "lucide-react";

const Sidebar = ({ activeId, setActiveId, isOpen }) => {
  const devices = [
    { id: "pump", label: "Water Pump", icon: Droplets },
    { id: "fan", label: "DC Fan", icon: Fan },
    { id: "bulb", label: "DC Bulb", icon: Lightbulb },
  ];

  return (
    <aside
      className={`
      fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-100 flex flex-col p-6 transition-transform duration-300 ease-in-out
      lg:translate-x-0 lg:sticky lg:top-0 h-screen
      ${isOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"}
    `}
    >
      {/* Brand Logo Section */}
      <div className="flex items-center justify-between mb-10 px-2">
        <div className="flex items-center gap-2">
          {/*<div className="bg-green-600 p-1.5 rounded-lg text-white">
             <Activity size={24} /> 
          </div>*/}
          <div>
            <h1 className="text-xl font-bold text-gray-800 leading-tight">
              <span className="bg-green-600 p-1.5 rounded-lg text-white">
                IntelliSense
              </span>
            </h1>
            {/* <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">
              Predictive AI
            </p> */}
          </div>
        </div>
      </div>

      {/* Device Selection */}
      <nav className="flex-1 space-y-2">
        <p className="text-[15px] underline font-bold text-gray-700  mb-4 px-4 uppercase tracking-widest">
          Appliances
        </p>
        {devices.map((device) => (
          <div
            key={device.id}
            onClick={() => setActiveId(device.id)}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-200
              ${activeId === device.id ? "bg-green-50 text-green-700 font-semibold border border-green-100" : "text-gray-500 hover:bg-gray-50"}`}
          >
            <device.icon size={20} />
            <span className="text-sm">{device.label}</span>
          </div>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;

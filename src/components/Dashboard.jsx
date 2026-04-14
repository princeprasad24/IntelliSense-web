import React, { useState, useEffect } from "react";
import {
  ref,
  onValue,
  query,
  limitToLast,
  set,
  
} from "firebase/database";

import {
  Activity,
  TrendingUp,
  ShieldAlert,
  Clock,
  Cpu,
  Menu,
  X,
  Droplet,
  Fan,
  Lightbulb,
  Power,
} from "lucide-react";

import Sidebar from "./SideBar";
import Overview from "./Overview";
import AlertPanel from "./AlertPanel";
import DeviceDetailModal from "./DeviceDetailModal";
import { db } from "../firebase/firebase-config";
import toast from "react-hot-toast";

const Dashboard = () => {
  const [activeAppliance, setActiveAppliance] = useState("pump");
  const [selectedMetric, setSelectedMetric] = useState(null);
  const [isSideBarOpen, setIsSideBarOpen] = useState(false);
  const [systemStatus, setSystemStatus] = useState("Healthy");
  const [isPowerOn, setIsPowerOn] = useState(false);
  const [aiInsights, setAiInsights] = useState({
    remainingLife: 0,
    healthScore: 0,
    anomalyConfidence: 0,
  });

  const [sensorData, setSensorData] = useState({
    voltage: 0,
    temperature: 0,
    vibration: 0,
    current: 0,
  });

  // getting remaining life and health score

  useEffect(() => {
    const healthRef = query(
      ref(db, `remaining_life/${activeAppliance}`),
      limitToLast(1),
    );

    const unsubscribeHealth = onValue(healthRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = Object.values(snapshot.val())[0];

        const healthValue = data.health || 0;
        const anomalyValue = Number(data.anomaly || data.anamoly || 0);

        setAiInsights((prev) => ({
          ...prev,
          healthScore: Math.floor(healthValue),
          anomalyConfidence: anomalyValue * 100,
        }));

        if (healthValue < 70) {
          setSystemStatus("At Risk");
        } else {
          setSystemStatus("Healthy");
        }
      } else {
        setAiInsights((prev) => ({
          ...prev,
          healthScore: 0,
          anomalyConfidence: 0,
        }));
        setSystemStatus("No Data");
        console.log("No health data available for this appliance.");
      }
    });

    return () => unsubscribeHealth();
  }, [activeAppliance]);

  // changing state
  const toggleState = async () => {
    const newState = isPowerOn ? "OFF" : "ON";

    try {
      await set(ref(db, `State/${activeAppliance}`), newState);

      toast.success(`${activeAppliance} turned ${newState}`);
    } catch (error) {
      console.error("Error toggling state:", error);
      toast.error("Failed to toggle appliance state");
    }
  };

  // getting state
  useEffect(() => {
    const stateRef = ref(db, `State/${activeAppliance}`);
    const unSubscribeState = onValue(stateRef, (snapshot) => {
      if (snapshot.exists()) {
        const state = snapshot.val();
        setIsPowerOn(state === "ON");
      }
    });
    return () => unSubscribeState();
  }, [activeAppliance]);

  // getting sensor data
  useEffect(() => {
    const sensorPath = `Sensor data/${activeAppliance}`;
    const sensorRef = query(ref(db, sensorPath), limitToLast(1));
    toast.success(`switched  to ${activeAppliance}`);

    const unsubscribeSensors = onValue(sensorRef, (snapshot) => {
      if (!snapshot.exists()) return;

      const dataList = Object.values(snapshot.val());
      const latest = dataList[0]?.values || {};

      const vibe = Number(latest.Vibration || 0);
      const temp = Number(latest.Temp || 0);
      const volt = Number(latest.Voltage || 0);
      const curr = Number(latest.Current || 0);

      setSensorData({
        voltage: volt,
        temperature: temp,
        vibration: vibe,
        current: curr,
      });

      // const health = Math.max(0, 100 - vibe * 20 - temp / 10);

      // setAiInsights((prev) => ({
      //   ...prev,
      //   healthScore: Math.floor(health),
      //   anomalyConfidence: vibe > 0.6 ? 75 : 5,
      // }));
    });

    return () => unsubscribeSensors();
  }, [activeAppliance]);


  const handleApplianceChange = (id) => {
    console.log("Appliance changed to:", id);
    setActiveAppliance(id);
    setAiInsights({
      remainingLife: 0,
      healthScore: 0,
      anomalyConfidence: 0,
    });

    setSensorData({
      voltage: 0,
      temperature: 0,
      vibration: 0,
      current: 0,
    });

    setSelectedMetric(false);
  };

  const handleDeleteAll = async () => {
    try {
      await set(ref(db, `Sensor data/${activeAppliance}`), null);
      await set(ref(db, `remaining_life/${activeAppliance}`), null);
      toast.success("All data deleted successfully");
    } catch (error) {
      console.error("Error deleting data:", error);
      toast.error("Failed to delete data");
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      {isSideBarOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setIsSideBarOpen(false)}
        />
      )}

      <Sidebar
        activeId={activeAppliance}
        setActiveId={handleApplianceChange}
        isOpen={isSideBarOpen}
      />

      <main className="flex-1 p-8">
        {/* Header */}
        <header className="mb-10 flex justify-between items-end">
          <button
            onClick={() => setIsSideBarOpen(true)}
            className="lg:hidden p-2 bg-white rounded-xl shadow-sm border border-slate-100"
          >
            <Menu size={24} className="text-slate-600" />
          </button>

          <div>
            <div className="flex items-center  gap-2 mb-1">
              {/* <Cpu size={16} className="text-green-600" />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                IntelliSense AI Engine
              </span> */}
            </div>
            <h1 className="text-3xl font-bold text-slate-900 capitalize">
              {activeAppliance === "Water Pump" ? (
                <Droplet
                  size={28}
                  className="inline-block text-blue-500 mb-1"
                />
              ) : activeAppliance === "fan" ? (
                <Fan size={28} className="inline-block text-green-500 mb-1" />
              ) : (
                <Lightbulb
                  size={28}
                  className="inline-block text-gray-500 mb-1"
                />
              )}
              {"  "}
              {activeAppliance}{" "}
              <span className="text-slate-400 font-light">Analysis</span>
            </h1>
          </div>

          <div>
            <div
              className={`px-4 py-2 rounded-2xl font-bold flex items-center gap-3 border shadow-sm transition-all
            ${
              systemStatus === "Healthy"
                ? "bg-white text-green-600 border-green-100"
                : systemStatus === "At Risk"
                  ? "bg-red-100 text-red-600 border-red-200 animate-pulse"
                  : "bg-gray-100 text-gray-500 border-gray-200"
            }`}
            >
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  systemStatus === "Healthy"
                    ? "bg-green-500"
                    : systemStatus === "At Risk"
                      ? "bg-red-500"
                      : "bg-gray-400"
                }`}
              />
              {systemStatus.toUpperCase()}
            </div>

            
          </div>
        </header>

        {/* Overview Section */}
        <section className="mb-8">
          <Overview
            applianceId={activeAppliance}
            sensorData={sensorData}
            onCardClick={(details) => setSelectedMetric(details)}
          />
        </section>

        {/* AI Forecast Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-xl">
            <div className="relative z-10">
              <div className="flex items-center gap-2 text-blue-400 mb-6">
                <TrendingUp size={20} />
                <span className="text-xs font-bold uppercase tracking-widest">
                  Maintenance Forecast
                </span>
              </div>

              <div className="flex gap-16">
                {aiInsights.remainingLife === null ||
                aiInsights.remainingLife === undefined ? (
                  <div>
                    <p className="text-5xl font-bold mb-1">
                      {aiInsights.remainingLife}
                    </p>
                    <p className="text-slate-400 text-xs font-medium">
                      Days Remaining
                    </p>
                  </div>
                ) : (
                  ""
                )}
                <div>
                  <p className="text-5xl font-bold mb-1 text-green-400">
                    {aiInsights.healthScore}%
                  </p>
                  <p className="text-slate-400 text-xs font-medium">
                    System Health Index
                  </p>
                </div>
              </div>

              <div className="mt-8">
                <div className="flex justify-between text-[10px] font-bold uppercase mb-2">
                  <span>Reliability Threshold</span>
                  <span
                    className={
                      aiInsights.healthScore < 70
                        ? "text-red-400"
                        : "text-blue-400"
                    }
                  >
                    {aiInsights.healthScore < 70
                      ? "Action Required"
                      : "Optimal Condition"}
                  </span>
                </div>
                <div className="w-full h-2.5 bg-slate-800 rounded-full">
                  <div
                    className={`h-full rounded-full transition-all duration-1000 ${
                      aiInsights.healthScore < 70 ? "bg-red-500" : "bg-blue-500"
                    }`}
                    style={{ width: `${aiInsights.healthScore}%` }}
                  />
                </div>
              </div>
            </div>
            <div className="absolute -right-10 -bottom-10 opacity-10">
              <Activity size={240} />
            </div>
          </div>

          <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm flex flex-col justify-center">
            <ShieldAlert
              className={`mb-4 ${aiInsights.anomalyConfidence > 30 ? "text-red-500" : "text-slate-300"}`}
              size={32}
            />
            <h3 className="text-slate-800 font-bold text-lg mb-1">
              Anomaly Probability
            </h3>
            <p className="text-slate-500 text-sm mb-4 leading-relaxed">
              Detection probability of unusual {activeAppliance} behavior.
            </p>
            <div className="text-3xl font-black text-slate-800">
              {aiInsights.anomalyConfidence}%
            </div>
          </div>
        </div>

        {/* Alerts & Maintenance */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          <div className="xl:col-span-3">
            <AlertPanel applianceId={activeAppliance} />
          </div>
          {/* <div className="xl:col-span-1 bg-blue-600 rounded-[2.5rem] p-6 text-white flex flex-col justify-between shadow-lg shadow-blue-200/50">
            <div>
              <Clock className="mb-4 opacity-60" size={24} />
              <h4 className="font-bold text-lg mb-2">Next Inspection</h4>
              <p className="text-blue-100 text-xs leading-relaxed">
                Manual check suggested based on {aiInsights.remainingLife} days
                of estimated life remaining.
              </p>
            </div>
            <button className="mt-6 w-full py-3 bg-white text-blue-600 rounded-2xl font-bold text-xs hover:bg-blue-50 transition-colors shadow-sm">
              Log Maintenance
            </button>
          </div> */}
        </div>

        <div className="flex item-center gap-4 border rounded-2xl shadow-2xl p-2 mt-1 border-slate-200 hover:bg-slate-50">
              <h1 className=" flex items-center gap-2 px-6 py-2 rounded-2xl transition-all  text-slate-600 font-medium">Status : </h1>
              <button
                onClick={toggleState}
                className={`flex items-center gap-2 px-6 py-2 rounded-2xl font-bold transition-all border shadow-sm ${
                  isPowerOn
                    ? "bg-green-600 text-white border-green-700 hover:bg-green-700"
                    : "bg-white text-slate-400 border-slate-200 hover:bg-slate-50"
                }`}
              >
                <Power size={18} />
                {isPowerOn ? "ON" : "OFF"}
              </button>
            </div>
            <div className="flex items-center gap-1 px-2 py-2 rounded-2xl font-bold transition-all border shadow-sm opacity-0 pointer-cursor-not-allowed mt-4 border-red-300 bg-red-100 text-red-600
         ">
          <button onClick={handleDeleteAll}>Delete All</button>
        </div>
      </main>

      {selectedMetric && (
        <DeviceDetailModal
          isOpen={!!selectedMetric}
          onClose={() => setSelectedMetric(null)}
          {...selectedMetric}
        />
      )}

        

    </div>

    
  );
};

export default Dashboard;

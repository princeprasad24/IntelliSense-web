import React, { useState, useEffect } from "react";
import { db } from "../firebase/firebase-config";
import { ref, onValue, limitToLast, query } from "firebase/database";
import StatsCard from "./StatsCard";
import { Zap, Activity, Thermometer, Gauge } from "lucide-react";

const Overview = ({ applianceId, onCardClick }) => {
  const [readings, setReadings] = useState({
    current: 0,
    vibration: 0,
    temp: 0,
    voltage: 0,
    history: [],
  });

  useEffect(() => {
    const sensorPath = `Sensor data/${applianceId}`;
    const sensorRef = ref(db, sensorPath);

    const latestQuery = query(sensorRef, limitToLast(10));

    const unsubscribe = onValue(latestQuery, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const dataList = Object.values(data);
        const lastEntry = dataList[dataList.length - 1];

        const vals = lastEntry.values || {};

        setReadings({
          current: Number(vals.Current || 0),
          vibration: Number(vals.Vibration || 0),
          temp: Number(vals.Temp || vals.temp || 0),
          voltage: Number(vals.Voltage || vals.voltage || 0),
          history: dataList,
        });
      }else{
        setReadings({
          current: 0,
          vibration: 0,
          temp: 0,
          voltage: 0,
          history: [],
        });
        
      }
    });

    return () => unsubscribe();
  }, [applianceId]);

  const getHistory = (fbKey) => {
    return readings.history.map((item) =>
      Number(item?.values?.[fbKey] || item?.values?.[fbKey.toLowerCase()] || 0),
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Load Current Card */}
      {/* <StatsCard
        title="Load Current"
        value={readings.current.toFixed(2)}
        unit="A"
        goal={1}
        icon={Zap}
        color="#3b82f6"
        trendData={getHistory("Current")}
        onClick={() =>
          onCardClick({
            title: "Load Current",
            data: getHistory("Current"),
            color: "#3b82f6",
            unit: "A",
            goal: 1,
          })
        }
      /> */}
{/* =========================================================================================================================== */}
      {/* Vibration Card */}
      { applianceId === "pump" ? (
        <StatsCard
          title="Water Flow"
          value={readings.waterflow}
          unit="g"
          goal={"50 l/m "}
          icon={Activity}
          color="#8b5cf6"
          trendData={getHistory("WaterFlow")}
          onClick={() =>
            onCardClick({
              title: "Water Flow",
              data: getHistory("WaterFlow"),
              color: "#8b5cf6",
              unit: "g",
              goal: "50 l/m",
            })
          }
        />
      ) : 
      
      applianceId != "bulb" ? (
        <StatsCard
          title="Vibration"
          value={readings.vibration}
          unit="g"
          goal={0}
          icon={Activity}
          color="#8b5cf6"
          trendData={getHistory("Vibration")}
          onClick={() =>
            onCardClick({
              title: "Vibration",
              data: getHistory("Vibration"),
              color: "#8b5cf6",
              unit: "g",
              goal: 0,
            })
          }
        />
      ) : null}

      {/* Temperature Card */}
      {
        applianceId === "bulb" && (
          <StatsCard
            title="Temperature"
            value={readings.temp.toFixed(1)}
            unit="°C"
            goal={35}
            icon={Thermometer}
            color="#ef4444"
            trendData={getHistory("temp")}
            onClick={() =>
              onCardClick({
                title: "Temperature",
                data: getHistory("temp"),
                color: "#ef4444",
                unit: "°C",
                goal: 35,
              })
            }
          />
        )
      }

      {/* Voltage Card - Checks for both Upper and Lowercase 'V' */}
      <StatsCard
        title="Line Voltage"
        value={readings.voltage.toFixed(0)}
        unit="V"
        goal={15}
        icon={Gauge}
        color="#f59e0b"
        trendData={getHistory("Voltage")}
        onClick={() =>
          onCardClick({
            title: "Line Voltage",
            data: readings.history.map((item) =>
              Number(item.Voltage || item.voltage || 0),
            ),
            color: "#f59e0b",
            unit: "V",
            goal: 15,
          })
        }
      />
    </div>
  );
};

export default Overview;

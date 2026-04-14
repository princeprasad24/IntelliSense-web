import React, { useState, useEffect, useRef } from "react";
import { ref, onValue, query, limitToLast } from "firebase/database";
import { AlertTriangle, Clock, ShieldCheck } from "lucide-react";
import { db, messaging } from "../firebase/firebase-config";
import { getToken, onMessage } from "firebase/messaging";
import toast from "react-hot-toast";

const AlertPanel = ({ applianceId }) => {
  const [alerts, setAlerts] = useState([]);
  const lastNotifiedId = useRef(null);

  useEffect(() => {
    const requestFCMPermission = async () => {
      try {
        const permission = await Notification.requestPermission();
        if (permission === "granted") {
          const token = await getToken(messaging, {
            vapidKey: import.meta.env.VITE_APP_FIREBASE_MESSAGING_VALID_KEY,
          });
          console.log("FCM Token:", token);
        }
      } catch (error) {
        console.error("Notification permission denied", error);
      }
    };

    requestFCMPermission();

    const unsubscribeFCM = onMessage(messaging, (payload) => {
      toast.error(
        `${payload.notification?.title || "Alert"}: ${
          payload.notification?.body || ""
        }`,
        {
          duration: 5000,

          style: { borderRadius: "15px", background: "#333", color: "#fff" },
        },
      );
    });

    return () => unsubscribeFCM();
  }, []);

  const sendBrowserNotification = (alert) => {
    if (!("Notification" in window)) return;

    if (
      Notification.permission === "granted" &&
      lastNotifiedId.current !== alert.id
    ) {
      new Notification(` AI Alert: ${alert.device}`, {
        body: `Anomaly detected! Check ${alert.alert_type} status immediately.`,
        icon: "/logo192.png",
      });
      lastNotifiedId.current = alert.id;
    }
  };

  useEffect(() => {
    if (!applianceId) return;

    const alertsRef = ref(db, `alerts/${applianceId}`);
    const alertsQuery = query(alertsRef, limitToLast(5));

    const unsubscribe = onValue(alertsQuery, (snapshot) => {
      const data = snapshot.val();

      if (data) {
        const alertList = Object.entries(data).map(([id, value]) => ({
          id,
          ...value,
        }));

        const newestAlert = alertList[alertList.length - 1];
        if (newestAlert.prediction >= 1) {
          sendBrowserNotification(newestAlert);
          toast.error(`Anomaly Detected in ${newestAlert.device}!`, {
            duration: 5000,
            position: 'top-right',
            style: { borderRadius: "15px", background: "#333", color: "#fff" },
          });
        }

        alertList.reverse();
        setAlerts(alertList);
      } else {
        setAlerts([]);
      }
    });

    return () => unsubscribe();
  }, [applianceId]);

  return (
    <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 h-full flex flex-col">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-bold text-slate-800 text-lg uppercase tracking-tight">
          System Alerts
        </h2>
      </div>

      {/* ALERT LIST */}
      <div className="space-y-4 overflow-y-auto flex-1">
        {alerts.length > 0 ? (
          alerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-5 rounded-3xl border transition-all ${
                alert.prediction >= 1
                  ? "bg-red-50 border-red-200"
                  : "bg-slate-50 border-slate-100"
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <div
                  className={`flex items-center gap-2 font-bold text-xs uppercase ${
                    alert.prediction >= 1 ? "text-red-600" : "text-slate-500"
                  }`}
                >
                  <AlertTriangle size={14} />
                  {alert.prediction === 1
                    ? "Anomaly Detected"
                    : "Normal Operation"}
                </div>

                <span className="text-[10px] text-slate-400 flex items-center gap-1">
                  <Clock size={10} /> Live{" "}
                  {alert.timestamp
                    ? alert.timestamp.toString()
                    
                    : "N/A"}
                </span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                <strong>Device:</strong> {alert.device} <br />
                <strong>Current:</strong> {alert.Current} A <br />
                <strong>Temperature:</strong> {alert.Temp} °C <br />
                <strong>Voltage:</strong> {alert.Voltage} V
              </p>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-full opacity-50 py-10">
            <ShieldCheck size={48} className="text-green-500 mb-3" />
            <p className="text-sm font-bold text-slate-800 capitalize">
              {applianceId} is Secure
            </p>
            <p className="text-xs text-slate-500">
              No anomalies detected by AI.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AlertPanel;

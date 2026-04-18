# IntelliSense – AI-Based IoT Appliance Monitoring System

## Overview
IntelliSense is an IoT-based monitoring and predictive maintenance system designed to detect early failures in electrical appliances. It collects real-time data from multiple sensors and applies machine learning techniques to identify abnormal behavior and prevent unexpected breakdowns.

The system integrates embedded hardware, cloud services, and a web-based dashboard to provide continuous monitoring, analysis, and control.

---

## Features
- Real-time monitoring of electrical parameters
- Early fault detection using machine learning
- Anomaly detection with probability scoring
- System health index and maintenance forecasting
- Automated safety control using relay
- Cloud-based data storage and access
- Web dashboard for visualization and alerts

---

## System Architecture

### Hardware Components
- ESP32 Microcontroller
- Current Sensor (ACS712)
- Voltage Sensor
- Temperature Sensor (DS18B20 / DHT11)
- Vibration Sensor (SW420)
- Water Flow Sensor
- Relay Module

### Software Components
- Arduino IDE (ESP32 programming)
- Python (data processing and backend logic)
- Scikit-learn (machine learning models)
- Firebase (real-time database)
- HTML, CSS, JavaScript (frontend dashboard)

---

## Working Principle
1. Sensors collect real-time data such as voltage, current, temperature, and vibration.
2. ESP32 processes and transmits the data to the cloud using Wi-Fi.
3. The backend analyzes the data using machine learning models.
4. The system classifies the appliance condition as normal or faulty.
5. The dashboard displays live data and system status.
6. In case of abnormal behavior:
   - Alerts are generated
   - Relay module disconnects the appliance

---

## Dashboard Modules
- Appliance Selection (Fan, Pump, Bulb)
- Load Current Monitoring
- Vibration Analysis
- Voltage Tracking
- System Health Index
- Maintenance Forecast
- Anomaly Probability
- System Alerts Panel

---

## Installation and Setup

### 1. Clone Repository
```bash
git clone https://github.com/your-username/intellisense-iot.git
cd intellisense-iot
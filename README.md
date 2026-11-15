# Road Safety Management and Analysis System
> **Academic Major Project** | Developed in strict compliance with the Project Synopsis  
> **Designated Study Location**: **Vijay Nagar Square, Indore (Madhya Pradesh)**  
> **Tech Stack**: HTML5, CSS3, JavaScript, React.js, Python Flask, SQL (SQLite/MySQL compatible), OpenStreetMap (Leaflet)

---

## 📌 1. Project Overview & Focal Study Location
This system focuses on **Vijay Nagar Square, Indore (M.P.)**, one of the busiest and highest-traffic commercial corridors on AB Road (connecting the BRTS corridor, C21 Mall, Malhar Mega Mall, Scheme 54, Bombay Hospital, Radisson Square, and MR-10 Bypass).

### Key Highlights for Project Evaluation:
1. **Single Location Focus:** Instead of scattered generic points, all accident data, blackspots, and road conditions are localized around **Vijay Nagar Square, Indore** (`22.7533° N, 75.8937° E`).
2. **Automated Data Feeding Engine:** Users do not need to enter records manually. An automated feed engine ingests simulated real-time accident events from Indore Smart City ICCC sensors and traffic cameras at the click of a button or via a live 10-second background feed.
3. **Hotspot Analysis & Blackspot Detection:** Analyzes high-risk clusters (e.g. BRTS divider cut, C21 Mall mall crossing, Bombay Hospital junction) and calculates composite risk scores.
4. **Geographic Visualization:** High-resolution OpenStreetMap showing color-coded incident markers and pulsing red danger circles around the square.

---

## 🎯 2. Objectives (As defined in Synopsis)
1. **Develop a user-friendly Road Safety Management System** with an intuitive modern UI.
2. **Provide information about traffic rules, road signs, and road safety guidelines** compliant with MoRTH standards.
3. **Allow citizens and traffic personnel to report road accidents online** with GPS coordinates and multimedia descriptors.
4. **Store, validate, and manage accident records using relational SQL**.
5. **Identify accident-prone locations (Hotspots / Blackspots)** via mathematical spatial clustering and risk scoring algorithms.
6. **Provide instant emergency contact information and SOS response helplines** (112, 108, highway patrols, trauma centers).
7. **Improve public road safety awareness** through educational catalogs and interactive quizzes.

---

## 🏗️ 3. 3-Tier System Architecture

```
+-----------------------------------------------------------------------------------+
|                        1. PRESENTATION LAYER (Client Frontend)                   |
|  - React.js 19 + Vite                                                             |
|  - Interactive OpenStreetMap & Leaflet.js Mapping Engine                         |
|  - Chart.js Analytical Dashboards (Severity, Road Condition, Vehicle Distribution) |
|  - Modern Responsive CSS3 & Lucide Iconography                                   |
+-----------------------------------------------------------------------------------+
                                       │ ▲
                        HTTP / JSON     │ │ REST API Endpoints
                                       ▼ │
+-----------------------------------------------------------------------------------+
|                         2. APPLICATION LAYER (Python Backend)                     |
|  - Python 3.9+ & Flask REST API Server                                            |
|  - Data Validation Engine (Boundary checks, severity validation, sanitization)   |
|  - Geospatial Hotspot Engine (Haversine Great-Circle Clustering & Risk Scoring)   |
|  - Role-Based Access Control & SHA-256 Authentication                             |
+-----------------------------------------------------------------------------------+
                                       │ ▲
                        SQL Queries     │ │ Structured Rows
                                       ▼ │
+-----------------------------------------------------------------------------------+
|                           3. DATA LAYER (SQL Database)                            |
|  - Relational Database (SQLite / MySQL Schema compatible)                         |
|  - Normalized Tables: users, accidents, traffic_rules, emergency_contacts         |
|  - High-performance indexes on location, severity, date, and verification status |
+-----------------------------------------------------------------------------------+
```

---

## 🔄 4. 7-Step Methodology (From Synopsis)

| Step | Phase Name | System Implementation Details |
|---|---|---|
| **Step 1** | **User Registration & Login** | Citizens and Admins register/login with role-based access control. Passwords are securely hashed with SHA-256. |
| **Step 2** | **Accident Reporting** | Online form capturing incident title, location, landmark, interactive map click coordinates, date, time, severity, vehicle type, road condition, and weather. |
| **Step 3** | **Data Validation** | Dual-tier client and Python backend checks ensuring GPS latitude/longitude validity (-90 to 90, -180 to 180), mandatory fields, non-negative casualty counts, and sanitized text. |
| **Step 4** | **Database Storage** | Verified records are committed to the SQL database with an initial status of `'Pending'`. |
| **Step 5** | **Accident Management** | Authority admin panel to review submitted reports, update investigation status (`Verified`, `Under Investigation`, `Resolved`, `Rejected`), and log corrective road engineering actions taken. |
| **Step 6** | **Road Safety Information** | Educational hub containing mandatory regulatory signs, warning/cautionary signs, informatory markers, penalty schedules, and an awareness quiz. |
| **Step 7** | **Output Display & Hotspot Analysis** | Dynamic dashboard with severity doughnut charts, road-condition histograms, CSV data export, and Leaflet OpenStreetMap rendering pulsing hotspot zones. |

---

## 🧮 5. Hotspot Identification & Risk Analysis Engine

The system features an automated spatial clustering algorithm implemented in `backend/utils/hotspot_engine.py`:

### A. Haversine Great-Circle Distance
Groups accident reports occurring within a radius threshold ($d \le 2.5\text{ km}$):
$$d = 2R \arcsin\left(\sqrt{\sin^2\left(\frac{\Delta \text{lat}}{2}\right) + \cos(\text{lat}_1)\cos(\text{lat}_2)\sin^2\left(\frac{\Delta \text{lon}}{2}\right)}\right)$$
Where Earth's mean radius $R = 6371\text{ km}$.

### B. Weighted Composite Risk Scoring Formula
$$\text{Risk Score} = (N_{\text{accidents}} \times 10) + (N_{\text{fatalities}} \times 35) + (N_{\text{injuries}} \times 15)$$

### C. Classification & Automated Engineering Recommendations
- **CRITICAL (Score $\ge$ 60 or $\ge$ 1 Fatality)**: Red zone. Automated recommendation: Install speed radar cameras, rumble strips, pedestrian overpasses, or execute MoRTH blackspot protocol.
- **HIGH (Score 30–59 or $\ge$ 2 Repeated Accidents)**: Orange zone. Automated recommendation: Resurface asphalt, clear water runoff drains, enhance illumination.
- **MODERATE (Score 15–29)**: Yellow zone. Cautionary hazard signage.
- **LOW (Score < 15)**: Standard periodic traffic patrol.

---

## 🗄️ 6. SQL Database Schema Design

The relational database (`backend/database/road_safety.db`) consists of 4 normalized tables:

1. **`users`**: User authentication accounts (id, username, email, password_hash, full_name, phone, role, created_at).
2. **`accidents`**: Complete accident incident records (id, title, location_name, landmark, latitude, longitude, accident_date, accident_time, severity, vehicle_type, road_condition, weather_condition, casualties_count, injuries_count, description, possible_cause, reported_by_id, reporter_name, reporter_contact, status, admin_notes, action_taken, created_at, updated_at).
3. **`traffic_rules`**: Indian road regulations, fine amounts under Motor Vehicles Amendment Act, and visual sign categories.
4. **`emergency_contacts`**: National and state 24x7 emergency response services (112, 108, Highway Patrol, Trauma Centers).

---

## 🚀 7. How to Run the Project

### Method A: One-Click Runner (Recommended for Windows)
Simply double-click the **`run_project.bat`** file in the project folder.  
It will automatically:
1. Verify Python and install Flask/Flask-Cors.
2. Initialize the SQL database with realistic seed hotspots.
3. Start the unified server on `http://127.0.0.1:5000`.
4. Automatically open your browser to the running web application!

---

### Method B: Manual Command-Line Execution

#### 1. Setup Backend:
```bash
cd backend
pip install -r requirements.txt
python database/db.py        # Initializes and seeds the SQLite database
python app.py                # Starts Flask backend on http://127.0.0.1:5000
```

#### 2. Setup Frontend (For developers modifying React components):
```bash
cd frontend
npm install
npm run dev                  # Starts Vite Dev Server on http://localhost:5173
```
*Note: The React frontend has a built-in proxy in `vite.config.js` forwarding API calls to Flask at `http://127.0.0.1:5000`.*

---

## 🔑 8. Default Login Credentials

| User Role | Username | Password | Privileges |
|---|---|---|---|
| **System Safety Administrator** | `admin` | `admin123` | Full access: View all, verify/resolve reports, update investigation notes, delete records, view analytics. |
| **Citizen Reporter** | `rahul_sharma` | `user123` | Report accidents, view interactive map, search traffic rules, access emergency hub. |
| **Citizen Reporter** | `priya_patel` | `user123` | Report accidents, take road safety quiz, download CSV records. |

*Quick Feature: The login modal includes a **"1-Click Presentation Demo Login"** button for instant viva demonstrations.*

---

## 🎓 9. Viva Voce & Presentation Cheat Sheet

- **Q: Why did you choose React for the frontend?**  
  *A: React provides a modular, component-driven UI with efficient virtual DOM rendering, enabling real-time updates for interactive maps and Chart.js graphs without full-page reloads.*

- **Q: Why Python Flask for the backend?**  
  *A: Flask is a lightweight WSGI web framework with minimal overhead, excellent RESTful routing, and native mathematical support for spatial clustering algorithms.*

- **Q: How does the system determine accident hotspots?**  
  *A: The system implements the Haversine Great-Circle formula to cluster incidents occurring within 2.5 km of each other. It then applies a composite risk formula weighting fatalities, injuries, and accident frequencies to classify danger levels.*

- **Q: How is data validated before storage?**  
  *A: The system validates all incoming coordinates against valid latitude/longitude ranges, enforces data type constraints, sanitizes strings, and requires non-negative integers for casualties and injuries.*

---

## 📚 10. References Cited (from Project Synopsis)
1. **Elvik R., Vaa T., Hoye A., Sorensen M.**, *"The Handbook of Road Safety Measures"*, Emerald Group Publishing, Second Edition, 2009.
2. **Ahuja V.**, *"The Road Safety Management System: Principles and Practices"*, Reference materials on road safety management.
3. **World Health Organization (WHO)**, *"Road Safety"*, https://www.who.int/health-topics/road-safety
4. **Ministry of Road Transport and Highways (MoRTH)**, Government of India, *"Road Accidents in India"*, https://morth.gov.in/
5. **React Documentation**, https://react.dev/
6. **Python Official Documentation**, https://docs.python.org/3/
7. **Flask Documentation**, https://flask.palletsprojects.com/
8. **MySQL / SQLite Documentation**, https://dev.mysql.com/doc/
9. **MDN Web Docs**, *"HTML, CSS, and JavaScript"*, https://developer.mozilla.org/
10. **OpenStreetMap**, https://www.openstreetmap.org/

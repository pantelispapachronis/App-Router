# aerOS Web App - Pilot 5

**Smart Building Desk Recommendation Platform**  
Developed for [aerOS Project](https://aeros-project.eu) by [INFOLYSiS](https://infolysis.gr)

---

## 🏗 Project Overview

This application is a web-based interface for managing and recommending desk bookings in a smart building environment. It integrates presence tracking, user preferences, and MQTT-based communication with external recommender systems.

---

## ✨ Features

- 🔐 **Authentication**: Secure login with NextAuth (credentials strategy)
- 📡 **Real-time MQTT Integration**: Publishes and subscribes desk and user data via MQTT brokers
- 🧠 **Desk Recommendation System**: Calls an external AI service to get the top-3 personalized desk suggestions
- 🖥 **Admin Dashboard**: View desks, update preferences, manage availability
- 🧾 **User Preferences**: Submit preferred desks, store per user in Postgres
- 📈 **Custom UI**: Tailored dashboard with status indicators, dynamic components & responsiveness

---

## ⚙️ Tech Stack

- **Framework**: [Next.js 14 (App Router)](https://nextjs.org)
- **Auth**: [NextAuth.js](https://next-auth.js.org)
- **Database**: [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres)
- **MQTT Broker**: [Mosquitto](https://mosquitto.org)
- **MQTT Client**: [`paho-mqtt`](https://pypi.org/project/paho-mqtt/) (Python)
- **Styling**: TailwindCSS
- **Icons**: Heroicons
- **Linting**: ESLint, Prettier
- **Types**: TypeScript
- **UI Libraries**: React, use-debounce, clsx

---

## 🗂 Folder Structure

. ├── app/ # Main application logic │ ├── api/ # REST & MQTT routes │ ├── dashboard/ # Dashboard pages │ ├── login/ # Login page │ ├── ui/ # Reusable UI components │ └── layout.tsx # Root layout and metadata ├── public/ # Static assets (images, favicons) ├── scripts/ # Python scripts for MQTT send/subscribe ├── types/ # NextAuth session types ├── .env # Environment variables ├── next.config.js # Next.js config ├── tailwind.config.ts # TailwindCSS config ├── tsconfig.json # TypeScript config └── README.md # You are here!


---

## 🛠️ Setup & Run

### **1. Clone the repo**

```bash
git clone https://github.com/your-org/aeros-webapp.git
cd aeros-webapp
```

### **2. Install dependencies**
```bash
pnpm install
```

### **3. Configure environment**
Create a .env file in the root directory with the following variables:
```bash

POSTGRES_URL=your_postgres_connection_string
NEXTAUTH_SECRET=your_secret
NEXTAUTH_URL=http://localhost:3000
```

### **4. Start the development server**
```bash
pnpm dev
```
Open http://localhost:3000 in your browser.


## 🧪 MQTT Scripts

Python scripts for communicating with the MQTT broker are located in the 
```bash
scripts/
```
 directory:

 ```bash
send_to_mqtt.py
send_to_mqtt_logout.py
mqtt_desk_availability.py
subscribe_to_mqtt.py
```
Install Python dependencies
 ```bash
pip install paho-mqtt
```


## 🚀 Deployment

You can deploy this application on Vercel. Make sure to configure your environment variables via the Vercel dashboard.

## 👥 Contributors

Christos Sakkas — Lead Developer

Pantelis Papachronis — Project Architect

INFOLYSiS Team — Project Management & Technical Oversight

## 📄 License

MIT License — You are free to use, modify, and distribute this project.


KickZone – Football Info Tracker App

🚀 Overview

KickZone is a cross-platform mobile application built using React Native (Expo) and TypeScript.
The app allows users to explore football teams, view match events, and save favorite teams using data from TheSportsDB API.

This project fully satisfies the Assignment 2 requirements.

✨ Features

🔐 User Registration & Login (local authentication)

🧭 Expo Router Navigation (Stack + Bottom Tabs)

⚽ Browse football teams

📅 View upcoming & past events

⭐ Add / Remove favorite teams

💾 Persistent favorites using Redux Toolkit + AsyncStorage

🌙 Light & Dark Mode support

🔍 Search functionality (teams, events, players)

🎨 Modern UI with vector icons & clean layouts

🛠 Tech Stack

React Native (Expo)

TypeScript

Expo Router

Redux Toolkit

AsyncStorage

Axios

TheSportsDB API

@expo/vector-icons

📡 API Endpoints
⚽ Teams – TheSportsDB
https://www.thesportsdb.com/api/v1/json/3/search_all_teams.php?l=English%20Premier%20League

📅 Upcoming Events
https://www.thesportsdb.com/api/v1/json/3/eventsnextleague.php?id=4328

🔍 Search Teams
https://www.thesportsdb.com/api/v1/json/3/searchteams.php?t={teamName}

📁 Project Structure
SportTracker/
├── app/            # Screens (Tabs, Auth, Details)
├── components/     # Reusable UI components
├── src/
│   ├── api/        # API configuration
│   ├── redux/      # Store + slices
│   └── utils/      # Helper functions
├── assets/         # Images & icons
└── package.json

▶️ Running the App
npm install
npx expo start


Run on Android, iOS, or Expo Go.

# 🚌 Hampton Court Shuttle Live Tracker

A fast, clean, and responsive web application designed to instantly answer one question: **When is the next shuttle?**

Specifically tailored for residents of **Hampton Court (333 E 102nd St)** traveling to and from **86th St & Lexington Ave**.

---

## ✨ Features

- **Automatic Day & Schedule Detection**: Detects the current day of the week and whether it's a **Weekday (Mon–Fri)** or **Weekend (Sat–Sun)** with zero configuration.
- **Home First by Default**: Opens directly to departures **From Home (333 E 102nd St)**, with a seamless 1-tap switch to **From 86th & Lex**.
- **Live Real-Time Countdown**: Live ticking timer showing hours, minutes, and seconds remaining until departure.
- **Break & Rollover Awareness**:
  - Automatically identifies driver lunch and afternoon breaks with friendly status banners and exact resume times.
  - Automatically rolls over to the next morning's first shuttle once service finishes for the day (e.g., Friday evening rolls over to Saturday morning at 10:00 AM).
- **Upcoming Departures List**: Displays the next 3 departures with countdown chips.
- **Complete Timetable Modal**: Easily browse the full schedule for both stops across Weekdays and Weekends, with the active departure highlighted.
- **Mobile-First & PWA-Ready**: Optimized for quick checking on smartphones (can be bookmarked or added to Home Screen).

---

## 📍 Stops & Routes

| Stop | Location | Details |
| :--- | :--- | :--- |
| **Home** | `333 E 102nd St` | Front of Hampton Court building |
| **86th St** | `86th St & Lexington Ave` | S.E. Corner of 86th St & Lex on 86th St (in front of H&M) |

> ⚠️ **Notice**: Glenwood bus tags must be presented upon boarding. No exceptions to the bus route are permitted.

---

## ⏱️ Service Summary

### Monday – Friday
- **From Home**: 7:00 AM – 8:50 PM *(Lunch Break: 12:00 PM – 1:30 PM; Afternoon Break: 5:50 PM – 6:50 PM)*
- **From 86th & Lex**: 7:10 AM – 8:40 PM *(Lunch Break: 12:10 PM – 1:40 PM; Afternoon Break: 6:00 PM – 6:40 PM)*

### Saturday & Sunday
- **From Home**: 10:00 AM – 6:00 PM *(Lunch Break: 1:00 PM – 2:30 PM)*
- **From 86th & Lex**: 10:10 AM – 5:40 PM *(Lunch Break: 1:10 PM – 2:40 PM)*

---

## 🗓️ Holiday Service Rules

The app dynamically calculates both fixed and floating holidays for any calendar year:

### 🛑 No Shuttle Service Days
- **New Year's Day** (January 1)
- **Memorial Day** (Last Monday in May)
- **Independence Day** (July 4)
- **Labor Day** (First Monday in September)
- **Thanksgiving Day** (Fourth Thursday in November)
- **Christmas Day** (December 25)

*When active, the app indicates service is closed and automatically counts down to the next operating day's resumption.*

### 🗓️ Weekend Schedule Days
The shuttle operates on its **Weekend Schedule** (10:00 AM start) on:
- **Martin Luther King Jr. Day** (Third Monday in January)
- **Presidents' Day** (Third Monday in February)
- **Juneteenth** (June 19)
- **Day After Thanksgiving** (Black Friday)
- **Christmas Eve** (December 24)
- **New Year's Eve** (December 31)

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or newer)
- npm

### Installation
```bash
npm install
```

### Run Locally (Development)
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### Run Tests
```bash
npm test
```

### Production Build
```bash
npm run build
npm run preview
```

---

## 📤 Pushing to GitHub

When you're ready to push this project to your GitHub account:

1. Create a new repository on [GitHub](https://github.com/new) (e.g. `shuttle-app` or `hampton-court-shuttle`). Leave it empty (do not check initialize with README, `.gitignore`, or license).
2. Run the following commands in your terminal:

```bash
# Set your remote GitHub repository URL
git remote add origin https://github.com/<your-username>/<your-repo-name>.git

# Ensure default branch is main
git branch -M main

# Push the repository
git push -u origin main
```

---

## 🌐 Deploying Online (Free)

### Option 1: Vercel / Netlify
1. Connect your GitHub repository to [Vercel](https://vercel.com) or [Netlify](https://netlify.com).
2. Set Build Command to `npm run build` and Output Directory to `dist`.
3. Deploy! You'll get an instant live HTTPS link you can bookmark on your phone.

### Option 2: GitHub Pages
In `vite.config.ts`, you can add `base: '/<your-repo-name>/'` and use `gh-pages` or the GitHub Actions static pages workflow to deploy directly from your GitHub repository.

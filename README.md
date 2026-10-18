# Luxe Store

<div align="center">

**A premium, modern e‑commerce web application showcasing luxurious products with a beautiful, responsive UI.**

[![Build Status](https://img.shields.io/badge/Build-Passing-success.svg)](#)
[![Tech Stack](https://img.shields.io/badge/Tech%20Stack-HTML%20%7C%20CSS%20%7C%20JavaScript%20%7C%20React%20JS%20%7C%20Node.js%20%7C%20Express-lightgrey.svg)](#)

</div>

---

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)
- [Contributing](#contributing)
- [Contact](#contact)

## Overview
Luxe Store is a full‑stack e‑commerce platform that presents a curated collection of high‑end products. It combines a **premium UI**—featuring glass‑morphism cards, smooth gradients, and subtle micro‑animations—with a lightweight backend API to deliver a seamless shopping experience.

## Features
- ✨ **Responsive Design** – Optimized for mobile, tablet, and desktop.
- 🛒 **Dynamic Product Catalogue** – Fetches product data from a mock backend.
- 🧺 **Shopping Cart** – Add, remove, and view items instantly.
- 🎨 **Modern UI** – Glass‑morphism cards, custom Google Font *Inter*, and CSS animations.
- 🌙 **Dark Mode** – Automatic theming based on user preference.
- 🗄️ **MongoDB Integration** – Persistent product data stored in MongoDB.

## Tech Stack
- **Frontend:** HTML5, CSS3 (vanilla), JavaScript (ES6), React JS
- **Backend:** Node.js v18+, Express
- **Package Manager:** npm (scripts defined in `package.json`)
- **Design:** Custom CSS with HSL color palette, Inter font from Google Fonts
- **Database:** MongoDB

## Prerequisites
- **Node.js** v18 or newer (includes npm)
- **Git** (for cloning the repository)

## Installation & Setup
```bash
# 1️⃣ Clone the repository
git clone https://github.com/your-username/Luxe-Store.git
cd Luxe-Store

# 2️⃣ Install backend dependencies
npm install
```
> **Note:** The frontend consists of static files and does not require a build step. You can serve it with any static file server.

## Running the Application
### Backend (API Server)
```bash
# Start the Express server (default on port 5000)
npm run dev:backend
```
> The backend provides a simple REST endpoint at `http://localhost:5000/api/products` that returns mock product data.

### Frontend (Static UI)
You have two convenient options:
1️⃣ **Open directly** – Open `frontend/index.html` in your browser.
2️⃣ **Live‑reload server** – Use the provided npm script for a development server:
```bash
npm run dev:frontend
```
The frontend will be available at **http://localhost:3000** and will proxy API requests to the backend.

## Project Structure
```
Luxe-Store/
├─ backend/                # Express server, API routes, mock data
│   ├─ index.js
│   └─ data/
│        └─ products.json
├─ frontend/               # Static assets
│   ├─ index.html
│   ├─ assets/            # Images, icons, fonts
│   └─ styles/            # CSS files (global & component styles)
├─ .gitignore
├─ README.md               # This documentation
└─ package.json            # npm scripts & dependencies
```

## Environment Variables
The backend can be configured via a `.env` file placed in the `backend/` directory. Example:
```env
PORT=5000            # Port for the Express server
API_DELAY=200        # Simulated latency in ms (optional)
```
> Create the file with `cp .env.example .env` and adjust values as needed.

## Contributing
Contributions are highly appreciated! Please follow these steps:
1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/awesome-feature`).
3. Ensure your code follows the existing style and passes any linting.
4. Commit with clear messages.
5. Open a Pull Request describing your changes.


## Contact
**Shayan** – [GitHub](https://github.com/Shayan121363) • [LinkedIn] https://www.linkedin.com/in/shayan-ahmed-dev/

---
*Crafted with professionalism for the open‑source community.*

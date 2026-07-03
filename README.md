# Tartuca Customer Portal (`tartuca_user`)

This is the customer-facing React web application where users can view the interactive menu, place orders for delivery, reserve tables, view the photo gallery, and manage their authentication profiles.

## 🚀 Features

* **Interactive Food Ordering**: Explore the menu with categorized filters, add items to the dynamic cart, and proceed to checkout.
* **Google Maps Integration**: Select delivery addresses with Google Places Auto-complete and manually adjust locations on interactive maps.
* **Live Table Reservation**: Seamless form submission to book a dining table directly, feeding instantly to the restaurant database.
* **Authentication Profiling**: Auth0 integration for secure and seamless social logins (Google/GitHub/etc.) or standard email registrations.
* **Reviews System**: Authenticated customers can write reviews and view existing feedback directly on the Reviews page.

---

## 🛠️ Setup Instructions

### 1. Prerequisites
Make sure you have **Node.js (v18+)** and **pnpm** installed:
```bash
corepack enable pnpm # If pnpm is not already installed globally
```

### 2. Environment Configuration
Create an `.env` file in this directory (`tartuca_user/`):
```env
SECRET_AUTH0_CODE=<your-secret-code-if-needed>
VITE_AUTH0_DOMAIN=<your-auth0-domain>.auth0.com
VITE_AUTH0_CLIENT_ID=<your-customer-client-id>
VITE_AUTH0_AUDIENCE=https://api.tartuca.com
```

### 3. Installation
Install all dependencies:
```bash
pnpm install
```

### 4. Running the Development Server
```bash
pnpm run dev
```

The application will launch at `http://localhost:5173`.

---

## 📂 Project Structure

```
tartuca_user/
├── src/
│   ├── main.jsx          # Entry point
│   ├── App.jsx           # App layout and route mapping
│   ├── index.css         # Tailwind & global stylesheets
│   ├── components/       # Custom reusable components
│   │   ├── auth/         # Login, register, profile components
│   │   ├── common/       # Toast, skeletons, loading spinners
│   │   └── layout/       # Navbar, Footer, and Page templates
│   ├── context/          # React context states (Cart, Auth, Toast)
│   ├── pages/            # Client side page views
│   │   ├── HomePage.jsx
│   │   ├── AboutPage.jsx
│   │   ├── BookTablePage.jsx
│   │   ├── MenuPage.jsx
│   │   ├── CheckoutPage.jsx
│   │   ├── DeliveryPage.jsx
│   │   ├── ProfilePage.jsx
│   │   └── ReviewsPage.jsx
│   └── services/
│       └── api.js        # Axios instance configured to communicate with the backend
```


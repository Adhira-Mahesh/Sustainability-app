# EcoTracker 🌿 - Community Sustainability App

EcoTracker is a modern, responsive web application designed to connect local change-makers and individuals passionate about sustainability. Built with a beautiful, premium glassmorphism UI, this platform empowers communities to host, discover, and join environmental workshops, clean-ups, tree-planting drives, and more.

## 🌟 Features

### 🌍 For Everyone (Attendees)
*   **Discover Local Events**: Browse a curated list of upcoming sustainability events in your area.
*   **Smart Search & Filtering**: Instantly search for events by title or location, and fine-tune your results by specific categories (e.g., Workshop, Clean-up, Tree Planting, Recycling).
*   **RSVP & Tracking**: Single-click registration for events you want to attend. Easily view and manage all your upcoming commitments from your dedicated "My Events" page.
*   **Detailed Event Pages**: View comprehensive event structures including beautifully laid-out times, locations, descriptive details, organized by engaging host profiles.

### 🎙️ For Change-makers (Hosts)
*   **Create Rich Events**: Launch new events complete with cover images, multi-select categorical tags, and detailed descriptions to attract attendees.
*   **Host Dashboard**: A centralized command center to view all your created events, edit their details on the fly, or cancel them if necessary.
*   **Attendee Management**: View real-time registration lists for your events to track who and how many people are joining your cause.

### 🎨 Design Highlights
*   **Premium Glassmorphism**: Stunning, translucent user interface layers that blend beautifully with rich, dynamic background gradients.
*   **Fluid Animations**: Silky smooth hover states, component scaling, fade-ins, and subtle environmental pulse backgrounds.
*   **Fully Responsive**: Masterfully crafted using Tailwind CSS to ensure a pristine experience across mobile phones, tablets, and desktop computers.

## 🛠️ Technology Stack
*   **Frontend Framework**: React.js (via Vite for lightning-fast HMR)
*   **Styling**: Tailwind CSS (paired with bespoke Vanilla CSS animations and variables in `index.css`)
*   **Backend & Database**: Firebase (Authentication & Firestore NoSQL Database)
*   **Routing**: React Router DOM
*   **Icons & Assets**: Integrating standard emoji sets and Unsplash/Pexels for dynamic image placeholders.

## 🚀 Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your machine.
You will also need a Firebase account and a generated web configuration to connect the database.

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Adhira-Mahesh/Sustainability-app.git
   cd Sustainability-app
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up Firebase:**
   Create a `.env` file in the root of your folder and add your Firebase config keys (if currently set up this way), or directly insert your config rules within `src/firebase.js`. It explicitly needs `Firestore` and `Authentication` enabled on your Firebase project.

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Open your browser:**
   Navigate to `http://localhost:5173` to see the magic.

## 💡 How to Use
1. **Sign Up/Log In**: Create a new account. You can optionally designate yourself as an **Attendee** or a **Host** during the signup process (depending on the internal implementation setup).
2. **Explore**: Navigate the dynamic hero section and use the search bar or multi-category filters to find the perfect event.
3. **Join In**: Hit the Details button and click "Join Event 🌿" to RSVP.
4. **Host**: If you have host permissions, access the "Host Dashboard", click "+ Create New Event", and publish your initiative!

---
*Nurture the future. Let's make an impact, together.*

Made under the guidance of Prof. Neha Ashok at Pillai College of Engineering (PCE)

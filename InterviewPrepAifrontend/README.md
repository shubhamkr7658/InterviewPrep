# Interview Prep AI 🚀
<img width="1918" height="960" alt="Screenshot 2026-02-27 110041" src="https://github.com/user-attachments/assets/167fa552-ef03-4cf7-a36a-69749a82416c" />

An advanced, AI-powered interview preparation platform designed to help ambitious professionals ace their interviews. Get role-specific questions, expand answers when you need them, dive deeper into concepts, and track your performance with beautiful analytics.

## ✨ Features

- **AI-Powered Question Generation**: Generate role-specific interview questions on the fly using Google GenAI / OpenAI.
- **Dynamic Learning Experience**: Expand answers, dive deeper into specific concepts, and get personalized AI explanations for complex topics.
- **Session Analysis Dashboard**: Visually track your performance, difficulty progression, and concept density using beautifully interactive charts.
- **Infinite Practice Sessions**: Generate 10K+ questions and practice without limits.
- **Premium UI/UX**: Built with a stunning dark theme, dynamic JS tracking animations, glassy overlays, and buttery-smooth GSAP-style framer motion interactions.
- **Secure Authentication**: Full user signup and login flows protected by JWT.

## 🛠️ Technology Stack

**Frontend:**
- [React 19](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/) (For buttery smooth interactions & parallax effects)
- [Recharts](https://recharts.org/) (For Data Visualization)
- [React Router DOM](https://reactrouter.com/)

**Backend:**
- [Node.js](https://nodejs.org/) & [Express.js](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/) & [Mongoose](https://mongoosejs.com/)
- [JWT (JSON Web Tokens)](https://jwt.io/) for Authentication
- [@google/genai](https://ai.google.dev/) & [OpenAI API](https://openai.com/) (For AI generation)

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- MongoDB Database (Local or MongoDB Atlas)

### Setup Instructions

1. **Clone the repository** (if applicable) or download the source code.

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```
   Create a `.env` file in the `backend` directory with the required environment variables (see below).
   Start the backend server:
   ```bash
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   ```
   Start the frontend development server:
   ```bash
   npm run dev
   ```

### ⚙️ Environment Variables

To run this project, you will need to add the following environment variables to your `backend/.env` file:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
GEMINI_API_KEY=your_google_genai_api_key
# OPENAI_API_KEY=your_openai_api_key (if using OpenAI instead of/alongside Gemini)
```

## 📈 Dashboard Analytics
The Session Analysis dashboard provides insights into:
- **Difficulty Level**: Pie chart breakdown of Easy, Medium, and Hard questions.
- **Concept Density**: Bar chart showing the frequency of core technical concepts discussed.
- **Session Footprint**: Radar chart mapping overall Session Completion, Engagement, and Complexity.
- **Difficulty Progression**: Line chart tracking the difficulty of questions over time.

## 🎨 UI Highlights
- **Smart Mouse Tracking**: Smooth, parallax typography that tracks user mouse movement on the landing page.
- **Custom Notifications**: Toast notifications tailored to the app's dark aesthetic.
- **Intelligent Modals**: Glassmorphism modals for Authentication and Settings.
- **Cookie Consent**: Beautiful slide-up notification banner asking for user consent, styled to match the premium theme.

---
*Built with ✦ for ambitious professionals.*

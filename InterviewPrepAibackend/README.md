# Backend API Server

Node.js and Express backend with MongoDB, authentication, file uploads, and AI integrations (Google GenAI + OpenAI).

<img width="1906" height="909" alt="Screenshot 2026-02-27 184027" src="https://github.com/user-attachments/assets/75ab2fb2-052c-4ab3-b82e-376f4fe61397" />
<img width="1923" height="925" alt="Screenshot 2026-02-27 184111" src="https://github.com/user-attachments/assets/ae2a4595-ede1-43dc-9b66-ffdaa4d4deb5" />
<img width="1923" height="922" alt="Screenshot 2026-02-27 184124" src="https://github.com/user-attachments/assets/77388af4-f890-4579-b4f8-ce4b1f3d633b" />
<img width="1923" height="929" alt="Screenshot 2026-02-27 184207" src="https://github.com/user-attachments/assets/4530ad1a-96cc-4d10-999d-620eb9b9bf3e" />
<img width="1922" height="929" alt="image" src="https://github.com/user-attachments/assets/d75ba210-06e6-4c5b-90b6-57ae53748593" />

---

## Tech Stack

- Node.js
- Express 5
- MongoDB
- Mongoose
- JWT Authentication
- bcryptjs
- Multer
- dotenv
- CORS
- Google Generative AI
- OpenAI API
- Nodemon (development)

---

## Installation

1. Clone the repository

```
git clone https://github.com/your-username/your-repo-name.git
cd backend
```

2. Install dependencies

```
npm install
```

3. Create a `.env` file in the root directory

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GOOGLE_API_KEY=your_google_api_key
OPENAI_API_KEY=your_openai_api_key
```

4. Start development server

```
npm run dev
```

5. Start production server

```
npm start
```

Server runs at:

```
http://localhost:5000
```

---

## Available Scripts

```
npm start      # Run with Node
npm run dev    # Run with Nodemon
```

---

## Project Structure

```
backend/
│── server.js
│── package.json
│── .env
│── routes/
│── controllers/
│── models/
│── middleware/
```

---

## Features

- User authentication with JWT
- Password hashing with bcrypt
- MongoDB database integration
- File upload handling with Multer
- AI response generation using Google and OpenAI APIs
- CORS enabled for frontend connection
- Environment variable configuration

---

## Security Notes

- Do not commit `.env` file
- Keep API keys private
- Use strong JWT secrets
- Enable HTTPS in production

---

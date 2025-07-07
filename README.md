# 🤔 Would You Rather Choose

<div align="center">

A full-stack "Would You Rather" game application built with Go backend and React frontend. Users can vote on questions and submit their own questions to the database.

![Go](https://img.shields.io/badge/go-%2300ADD8.svg?style=for-the-badge&logo=go&logoColor=white)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)

</div>

---

## 🚀 Technology Stack

| **Backend** | **Frontend** |
|-------------|--------------|
| Go with Gin framework | React with TypeScript |
| MongoDB for data storage | Vite for build tooling |
| RESTful API architecture | Modern component-based architecture |

## ✨ Features

- 🗳️ **Vote on Questions** - Browse and vote on "Would You Rather" questions
- 📝 **Submit Questions** - Add your own questions to the database
- 📊 **Progress Tracking** - Visual indicators for voting progress
- 📱 **Responsive Design** - Works on mobile and desktop
- ⚡ **Real-time Voting** - Live vote counting
- 🔧 **Error Handling** - Comprehensive error states and loading screens

## 📁 Project Structure

```
wouldyouratherchoose/
├── 🔧 backend/
│   ├── cmd/wouldyouratherchoose/main.go    # 🚀 Application entry point
│   ├── internal/
│   │   ├── db/                             # 🗄️ Database connection
│   │   ├── handler/                        # 🌐 HTTP handlers
│   │   ├── service/                        # 💼 Business logic
│   │   ├── repository/                     # 📊 Data access layer
│   │   ├── model/                          # 🏗️ Data models
│   │   └── middleware/                     # 🔒 HTTP middleware
│   └── seed/                               # 🌱 Database seeding
├── 🎨 frontend/
│   ├── src/
│   │   ├── components/                     # ⚛️ React components
│   │   ├── pages/                          # 📄 Page components
│   │   ├── services/                       # 🔌 API calls
│   │   └── types/                          # 📝 TypeScript types
│   └── public/                             # 📂 Static assets
└── 📖 README.md
```

## 🏃‍♂️ Getting Started

### 📋 Prerequisites

- Go 1.19 or higher
- Node.js 18 or higher
- MongoDB instance (local or cloud)

### 🔧 Backend Setup

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Install Go dependencies:**
   ```bash
   go mod download
   ```

3. **Create environment file:**
   Create a `.env` file in the backend directory:
   ```env
   MONGO_URI=mongodb://localhost:27017
   DB_NAME=wouldyourather
   FRONTEND_ORIGIN=http://localhost:5173
   ```

4. **Seed the database:**
   ```bash
   go run seed/seed.go
   ```

5. **Start the backend server:**
   ```bash
   go run cmd/wouldyouratherchoose/main.go
   ```

   > 🌐 The API will be available at `http://localhost:8080`

### 🎨 Frontend Setup

1. **Navigate to the frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create environment file:**
   Create a `.env` file in the frontend directory:
   ```env
   VITE_API_BASE_URL=http://localhost:8080
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

   > 🎯 The application will be available at `http://localhost:5173`

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/questions` | Retrieve questions for voting |
| `POST` | `/api/votes` | Submit a vote for a question |
| `POST` | `/api/questions` | Submit a new question |

## 🛠️ Development

### 🧪 Running Tests

**Backend:**
```bash
cd backend
go test ./...
```

**Frontend:**
```bash
cd frontend
npm test
```

### 🏗️ Building for Production

**Backend:**
```bash
cd backend
go build -o bin/wouldyouratherchoose cmd/wouldyouratherchoose/main.go
```

**Frontend:**
```bash
cd frontend
npm run build
```

## 🤝 Contributing

We welcome contributions! Here's how to get started:

1. 🍴 Fork the repository
2. 🌿 Create a feature branch (`git checkout -b feature/new-feature`)
3. 💾 Commit your changes (`git commit -m 'Add new feature'`)
4. 📤 Push to the branch (`git push origin feature/new-feature`)
5. 🔄 Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Contact

<div align="center">

[![GitHub](https://img.shields.io/badge/GitHub-prabalesh-181717?style=for-the-badge&logo=github)](https://github.com/prabalesh)
[![Repository](https://img.shields.io/badge/Repository-wouldyouratherchoose-blue?style=for-the-badge&logo=github)](https://github.com/prabalesh/wouldyouratherchoose)

</div>

---

<div align="center">
  <p>Made with ❤️ by <a href="https://github.com/prabalesh">@prabalesh</a></p>
</div>

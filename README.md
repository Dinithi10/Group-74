# FurnishViz: 3D/2D Furniture Visualization & Interior Design Tool

FurnishViz is a modern, full-stack web application designed for interactive interior design. Users can plan rooms in a precise 2D editor, visualize them in immersive 3D, and manage their designs with a robust Role-Based Access Control (RBAC) system.

## 🚀 Overview

The project aims to provide a seamless bridge between 2D planning and 3D visualization. Whether you are a homeowner visualizing a new layout, a professional designer managing multiple projects, or an administrator overseeing users, FurnishViz provides the tools needed for real-time interior design management.

## ✨ Key Features

### 📐 2D Interior Editor
- **Precision Planning**: Drag-and-drop interface for placing furniture in a scaled room environment.
- **Real-time Interaction**: Rotate, move, and remove furniture items with ease.
- **Undo/Redo System**: Sophisticated history management for effortless design iterations.

### 🧊 3D Visualization
- **Immersive Viewing**: Toggle to a 3D view to see your 2D design come to life.
- **Dynamic Lighting & Textures**: High-quality rendering using Three.js for realistic spatial awareness.

### 🛡️ Secure Authentication & RBAC
- **Session Persistence**: JWT-based authentication ensuring users stay logged in across refreshes.
- **Role-Based Permissions**:
  - **Admin**: Full system control including User Management (Create/Edit/Delete users) and system-wide design overviews.
  - **Designer**: Full access to design tools and room creation. Restricted from administrative features.
  - **Viewer**: Read-only access to the editor. Can visualize designs and use the shopping cart functionality.

### 🛒 E-commerce Integration
- **Furniture Catalog**: Comprehensive list of furniture with real-time pricing.
- **Shopping Cart**: Automatically calculate totals, taxes, and service charges based on the furniture placed in a design.

### 🖥️ Admin Dashboard
- **User Analytics**: Overview of registered users and their design activity.
- **Management Tools**: Dedicated interface for managing user accounts and roles.

## 🛠️ Technology Stack

### Frontend
- **Framework**: React.js with TypeScript
- **Styling**: Tailwind CSS & Vanilla CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **2D Rendering**: HTML5 Canvas / Konva
- **3D Rendering**: Three.js / React Three Fiber
- **State Management**: React Context API

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB Atlas (NoSQL)
- **Object Modeling**: Mongoose
- **Security**: JSON Web Tokens (JWT) & Bcrypt.js

## 📦 Project Structure

```text
3D Furni/
├── frontend/               # React Client
│   ├── src/
│   │   ├── components/     # UI, Layout, Editor, and Viewer components
│   │   ├── context/        # Global State (AppContext)
│   │   ├── services/       # API Communication Layer
│   │   └── pages/          # Individual App Pages
├── backend/                # Express Server
│   ├── controllers/        # Business Logic
│   ├── models/             # Mongoose Schemas (User, Design, Room, Furniture)
│   ├── routes/             # API Endpoints
│   └── middleware/         # Auth & Security layers
└── README.md
```

## ⚙️ Setup & Installation

### Prerequisites
- Node.js (v14+)
- MongoDB Atlas Account / Local MongoDB Instance

### Backend Setup
1. Navigate to the backend directory: `cd backend`
2. Install dependencies: `npm install`
3. Create a `.env` file with:
   ```env
   PORT=9500
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   ```
4. Start the server: `npm run dev`

### Frontend Setup
1. Navigate to the frontend directory: `cd frontend`
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`
4. Access the app at `http://localhost:9000`

## 📊 Project Report Summary
This application demonstrates a complex implementation of real-time canvas interaction integrated with a secure backend. The use of a decoupled architecture allows for high performance in rendering while maintaining strict consistency in user data and permissions.

# Brill Prime - Multi-Platform E-Commerce Application

A modern full-stack e-commerce application built with React for web, React Native for mobile, and Firebase as the backend. Features a shared component architecture for maximum code reuse and consistency across platforms.

## 🚀 Project Structure

```
brill-prime/
├── web/                  # React Web Application (TypeScript)
│   ├── public/           # Static assets
│   ├── src/
│   │   ├── screens/      # Web-specific screens
│   │   ├── App.tsx       # Web app entry point
│   │   └── ...
│   ├── package.json      # Web dependencies
│   ├── tsconfig.json     # TypeScript config for web
│   └── firebase.ts       # Firebase config for web
│
├── mobile/               # React Native Mobile App (TypeScript)
│   ├── screens/          # Mobile-specific screens
│   ├── App.tsx           # Mobile app entry point
│   ├── package.json      # Mobile dependencies
│   ├── tsconfig.json     # TypeScript config for mobile
│   └── firebase.ts       # Firebase config for mobile
│
├── shared/               # Shared TypeScript Code
│   ├── components/       # Reusable UI components
│   ├── hooks/            # Custom React hooks
│   ├── api/              # API abstraction layer
│   ├── utils/            # Helper functions
│   ├── state/            # Global state management
│   ├── types/            # TypeScript type definitions
│   └── tsconfig.json     # TypeScript config for shared code
│
├── firebase/             # Firebase Logic
│   ├── config.ts         # Firebase initialization
│   ├── services/         # Firebase service functions
│   └── types/            # Firebase-specific types
│
└── README.md             # This file
```

## 🛠 Tech Stack

### Frontend (Web)
- **React** - UI library with TypeScript
- **Vite** - Build tool and dev server
- **TailwindCSS** - Utility-first styling
- **Zustand** - State management
- **React Query** - Data fetching and caching

### Frontend (Mobile)
- **React Native** - Native mobile development
- **Expo** - Development and deployment platform
- **TypeScript** - Type safety

### Backend & Services
- **Firebase** - Backend-as-a-Service
- **Firestore** - NoSQL database
- **Firebase Auth** - Authentication
- **Firebase Storage** - File storage

## 📦 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Firebase project setup

### Environment Variables
Create Firebase project and add these environment variables:

```bash
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_PROJECT_ID=your_project_id  
VITE_FIREBASE_APP_ID=your_app_id
```

### Installation

1. **Web Development**:
```bash
cd web
npm install
npm run dev
```

2. **Mobile Development**:
```bash  
cd mobile
npm install
npm start
```

## 🏗 Development

This project uses a shared code architecture where:

- **`shared/`** contains reusable business logic, components, and utilities
- **`web/`** contains web-specific UI and routing
- **`mobile/`** contains mobile-specific screens and navigation  
- **`firebase/`** contains backend integration logic

## 🚀 Deployment

### Web
Deploy to Vercel, Netlify, or Firebase Hosting

### Mobile
Use Expo Application Services (EAS) for app store deployment

## 📋 Features

- 🔐 User authentication (email/password + Google OAuth)
- 🛍️ Product catalog with search and filtering
- 🛒 Shopping cart with persistent storage
- 📦 Order management and tracking
- 👑 Admin dashboard for product management
- 📱 Cross-platform mobile and web apps
- 🎨 Responsive design with dark/light themes

## 🤝 Contributing

1. Fork the project
2. Create your feature branch
3. Make changes to appropriate platform folders
4. Ensure shared code works across platforms  
5. Submit a pull request
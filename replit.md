# Brill Prime - Multi-Platform E-Commerce Application

## Overview

Brill Prime is a full-stack e-commerce application designed for multi-platform deployment. The project features a React web application for desktop users, a React Native mobile application for iOS and Android, and a comprehensive backend system. The application supports complete e-commerce functionality including user authentication, product catalog management, shopping cart operations, and order processing.

The system is built with a shared-code architecture that maximizes code reuse between web and mobile platforms while maintaining platform-specific optimizations. The application uses Firebase as the primary backend service for authentication, data storage, and file management, with plans to integrate PostgreSQL through Drizzle ORM for enhanced data management capabilities.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

The application employs a multi-platform frontend strategy with shared business logic:

**Web Application (React)**
- Built with Vite for fast development and optimized builds
- Uses Tailwind CSS for utility-first styling and Shadcn UI for modern component design
- Implements React Router for client-side navigation
- Utilizes TanStack Query for efficient data fetching and caching
- Features responsive design optimized for all screen sizes

**Mobile Application (React Native)**
- Developed with Expo for streamlined development and deployment
- Uses React Navigation for mobile-specific navigation patterns
- Shares core business logic with the web application through the shared folder
- Implements platform-specific UI components while maintaining consistent functionality

**Shared Code Strategy**
- Common API layer for consistent data operations across platforms
- Shared state management using Zustand for predictable state updates
- Reusable utility functions and validation schemas
- Consistent type definitions and data models

### Backend Architecture

**Express Server**
- RESTful API design with modular route structure
- Middleware for request logging, error handling, and JSON parsing
- Development-optimized with Vite integration for hot reloading
- Production-ready build process with ESBuild bundling

**Database Layer**
- Drizzle ORM configured for PostgreSQL with type-safe database operations
- Comprehensive schema definitions for users, products, orders, and cart items
- Migration system for database versioning and deployment
- In-memory storage implementation for development and testing

**State Management**
- Zustand stores for client-side state management
- Persistent cart state with localStorage integration
- Authentication state management with user session handling
- Real-time updates for cart and order status

### Data Storage Solutions

**Primary Database (PostgreSQL + Drizzle)**
- Structured relational data model for core business entities
- Type-safe database queries with Drizzle ORM
- Automated schema validation and migration management
- Optimized for complex queries and data relationships

**Firebase Integration**
- Firestore for real-time data synchronization
- Firebase Storage for product images and media files
- Firebase Auth for secure user authentication
- Cloud Functions capability for serverless operations

### Authentication and Authorization

**Firebase Authentication**
- Email/password authentication with secure password handling
- Google OAuth integration for social login
- User profile management with custom claims support
- Admin role-based access control system

**Security Implementation**
- Firestore security rules for data protection
- User session management with automatic token refresh
- Role-based authorization for admin functionality
- Secure password validation with complexity requirements

### API Design

**RESTful Endpoints**
- Standardized HTTP methods for CRUD operations
- Consistent response formats with proper error handling
- Request validation using Zod schemas
- Comprehensive error messaging and status codes

**Data Layer Abstraction**
- Service layer pattern for business logic separation
- Repository pattern for data access abstraction
- Consistent API interfaces across web and mobile platforms
- Type-safe data operations with TypeScript integration

## External Dependencies

### Core Technologies
- **React 18.2** - Frontend UI library with modern hooks and concurrent features
- **React Native 0.72** - Mobile application framework with native performance
- **Express** - Web application framework for Node.js backend
- **Firebase 9.23** - Backend-as-a-Service platform for authentication and data storage
- **PostgreSQL** - Primary relational database (via Neon serverless)
- **Drizzle ORM 0.39** - Type-safe database toolkit and query builder

### UI and Styling
- **Tailwind CSS** - Utility-first CSS framework for rapid UI development
- **Shadcn UI** - Modern React component library with accessibility focus
- **Radix UI** - Low-level UI primitives for building design systems
- **React Navigation** - Routing and navigation library for React Native

### Development and Build Tools
- **Vite** - Fast build tool and development server
- **TypeScript** - Static type checking and enhanced developer experience
- **ESBuild** - Fast JavaScript bundler for production builds
- **Expo** - Development platform for React Native applications

### Data Management
- **TanStack Query** - Data fetching and caching library for React
- **Zustand** - Lightweight state management solution
- **Zod** - TypeScript-first schema validation library
- **Date-fns** - Modern JavaScript date utility library

### Authentication and Storage
- **Firebase Auth** - User authentication and authorization service
- **Firestore** - NoSQL document database with real-time capabilities
- **Firebase Storage** - Cloud storage for files and media
- **Google OAuth** - Social authentication provider

### Hosting and Deployment
- **Neon Database** - Serverless PostgreSQL hosting platform
- **Expo Application Services** - Mobile app deployment and distribution
- **Firebase Hosting** - Web application hosting with global CDN
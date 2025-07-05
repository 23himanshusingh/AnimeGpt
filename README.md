# AnimeGPT 🎬

A Netflix-style anime browsing application built with React, featuring Firebase authentication, Redux state management, and integration with the Jikan API for anime data.

## 🚀 Features

### Authentication
- **Firebase Authentication** - Secure user registration and login
- **Redux State Management** - Centralized user state management
- **Protected Routes** - Automatic redirection based on authentication status
- **Form Validation** - Client-side validation for login/signup forms

### Browse Experience
- **Netflix-style UI** - Modern, responsive design with Tailwind CSS
- **Sticky Header** - Navigation with user avatar and logout functionality
- **Hero Section** - Featured anime with video background and overlay
- **Anime Lists** - Horizontally scrollable rows of anime recommendations
- **Hover Effects** - Interactive cards with smooth animations

### Data Integration
- **Jikan API Integration** - Fetch top airing anime from MyAnimeList
- **Redux Anime Slice** - Centralized anime data management
- **Custom Hooks** - Reusable data fetching logic

## 🛠️ Tech Stack

- **Frontend**: React 19.1.0 + Vite
- **Styling**: Tailwind CSS 4.1.11
- **State Management**: Redux Toolkit + React Redux
- **Routing**: React Router DOM 7.6.2
- **Authentication**: Firebase 11.10.0
- **API**: Jikan REST API (MyAnimeList)
- **Build Tool**: Vite 7.0.0

## 📁 Project Structure

```
src/
├── components/
│   ├── Browse.jsx          # Main browse page
│   ├── Header.jsx          # Navigation header
│   ├── Layout.jsx          # App layout wrapper
│   ├── Login.jsx           # Authentication forms
│   ├── MainContainer.jsx   # Hero section container
│   ├── SecondaryContainer.jsx # Anime lists container
│   ├── VideoBackground.jsx # Video background component
│   └── VideoTitle.jsx      # Hero section overlay
├── utils/
│   ├── firebase.js         # Firebase configuration
│   ├── store.js            # Redux store setup
│   ├── userSlice.js        # User state management
│   ├── movieSlice.js       # Anime data management
│   ├── constants.js        # App constants
│   └── loadYouTubeAPI.js   # YouTube API utilities
├── App.jsx                 # Main app component
└── main.jsx               # App entry point
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Firebase project setup

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd netflix-gpt
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Firebase Setup**
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Authentication (Email/Password)
   - Copy your Firebase config to `src/utils/firebase.js`

4. **Environment Variables**
   Create a `.env` file in the root directory:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

6. **Build for production**
   ```bash
   npm run build
   ```

## 🎯 Key Features Explained

### Authentication Flow
- Users can sign up with email/password
- Login state is managed in Redux
- Protected routes automatically redirect unauthenticated users
- Firebase `onAuthStateChanged` keeps Redux in sync

### Netflix-style UI Components
- **Header**: Sticky navigation with user avatar and logout
- **MainContainer**: Hero section with video background
- **SecondaryContainer**: Multiple anime recommendation rows
- **VideoTitle**: Overlay with title, description, and action buttons

### Data Management
- Anime data fetched from Jikan API on component mount
- Redux store manages both user and anime state
- Custom hooks provide clean data fetching logic

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🌟 Future Enhancements

- [ ] AnimeGPT search functionality
- [ ] Individual anime detail pages
- [ ] User watchlist and favorites
- [ ] Advanced filtering and sorting
- [ ] Mobile app version
- [ ] Social features (reviews, ratings)

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

---

Built with ❤️ using React and modern web technologies

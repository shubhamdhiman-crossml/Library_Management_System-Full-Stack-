# Quick Start Guide - Library Management System

## 🎯 Overview
This guide will help you set up and run the Library Management System frontend with your Django backend.

## Prerequisites
✅ Node.js 18 or higher installed
✅ npm, yarn, or pnpm package manager
✅ Django backend running on port 8000

## Step-by-Step Setup

### 1. Install Dependencies
```bash
cd library-frontend
npm install
```

### 2. Configure Environment
Create `.env.local` file in the root directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

### 3. Start Django Backend
Make sure your Django backend is running:
```bash
cd backend
python manage.py runserver
```

### 4. Start Frontend
In a new terminal:
```bash
cd library-frontend
npm run dev
```

### 5. Access the Application
Open your browser and navigate to:
```
http://localhost:3000
```

## 📋 Default Pages

- **Dashboard**: http://localhost:3000/dashboard
- **Books**: http://localhost:3000/books
- **Users**: http://localhost:3000/users
- **Issues**: http://localhost:3000/issues

## 🎨 Features Overview

### Dashboard
- View total books, users, and active issues
- Track overdue books
- See recent activities
- Quick action buttons

### Books Page
- Browse all books in grid view
- Filter by category
- Add new books
- Issue books to users
- Search by title, author, ISBN

### Users Page
- View all library members
- Add new users (Students, Staff, External)
- Edit user details
- See user statistics

### Issues Page
- Track all book issues
- Mark books as returned
- View overdue books
- See complete issue history

## 🔧 Customization

### Change Colors
Edit `tailwind.config.js`:
```javascript
colors: {
  primary: {
    600: '#your-color',
    // ... other shades
  }
}
```

### Change API URL
Edit `.env.local`:
```env
NEXT_PUBLIC_API_URL=https://your-api-url.com/api
```

### Modify Components
All components are in `src/components/`:
- `Sidebar.tsx` - Left navigation
- `Header.tsx` - Top search bar
- `BookCard.tsx` - Book display cards
- `Modal.tsx` - Popup modals

## 📱 Mobile View
The sidebar automatically collapses on mobile devices. Use the menu icon to toggle.

## 🐛 Common Issues

### "Cannot connect to API"
- Check if Django backend is running
- Verify `.env.local` has correct API URL
- Check Django CORS settings

### "Port 3000 already in use"
Run on a different port:
```bash
npm run dev -- -p 3001
```

### Build errors
Clear cache and reinstall:
```bash
rm -rf .next node_modules
npm install
npm run dev
```

## 📦 Production Build

To create a production build:
```bash
npm run build
npm run start
```

## 🎯 Next Steps

1. Customize the design colors and fonts
2. Add authentication if needed
3. Configure production API endpoints
4. Deploy to Vercel, Netlify, or your preferred hosting

## 📚 Documentation

- Next.js: https://nextjs.org/docs
- Tailwind CSS: https://tailwindcss.com/docs
- React Query: https://tanstack.com/query/latest

## 💡 Tips

- Use the search bar in the header for quick lookups
- Keyboard shortcuts work throughout the app
- All forms have validation
- Data updates automatically with React Query

---

Need help? Create an issue in the repository!

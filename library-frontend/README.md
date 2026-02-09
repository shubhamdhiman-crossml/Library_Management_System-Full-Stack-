# Library Management System - Frontend

A modern, full-featured library management system built with **Next.js 14**, **TypeScript**, and **Tailwind CSS**. This frontend connects to a Django REST Framework backend for complete library operations.

## ✨ Features

- 📚 **Book Management**: Add, view, search, and manage library books
- 👥 **User Management**: Register and manage library members (students, staff, external)
- 📝 **Issue Tracking**: Issue books, track due dates, and manage returns
- 📊 **Dashboard**: Real-time statistics and insights
- 🎨 **Modern UI**: Clean, responsive design inspired by contemporary design patterns
- 🔍 **Search & Filter**: Quick search across books, users, and ISBN
- ⚡ **Fast Performance**: Built on Next.js 14 with React Query for optimal performance
- 📱 **Responsive**: Works seamlessly on desktop, tablet, and mobile devices

## 🚀 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Data Fetching**: TanStack Query (React Query)
- **Forms**: React Hook Form
- **HTTP Client**: Axios
- **Notifications**: React Hot Toast
- **Icons**: Lucide React
- **Date Handling**: date-fns

## 📋 Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- Django backend running on `http://localhost:8000`

## 🛠️ Installation

1. **Clone or navigate to the project:**
   ```bash
   cd library-frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Create environment file:**
   ```bash
   cp .env.local.example .env.local
   ```

4. **Configure environment variables:**
   Edit `.env.local`:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8000/api
   NEXT_PUBLIC_APP_NAME=Library Management System
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

5. **Run the development server:**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

6. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
library-frontend/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── dashboard/         # Dashboard page
│   │   ├── books/             # Books management
│   │   ├── users/             # Users management
│   │   ├── issues/            # Issue tracking
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Home page
│   │   └── globals.css        # Global styles
│   ├── components/            # Reusable UI components
│   │   ├── Sidebar.tsx
│   │   ├── Header.tsx
│   │   ├── StatCard.tsx
│   │   ├── BookCard.tsx
│   │   ├── Modal.tsx
│   │   └── Providers.tsx
│   ├── services/              # API service layers
│   │   ├── books.ts
│   │   ├── users.ts
│   │   └── issues.ts
│   ├── store/                 # Zustand global state
│   │   └── index.ts
│   ├── lib/                   # Utilities and configurations
│   │   ├── api.ts             # Axios instance
│   │   └── utils.ts           # Helper functions
│   └── types/                 # TypeScript type definitions
│       └── index.ts
├── public/                    # Static assets
├── .env.local.example         # Environment variables template
├── next.config.js             # Next.js configuration
├── tailwind.config.js         # Tailwind CSS configuration
├── tsconfig.json              # TypeScript configuration
├── package.json               # Dependencies and scripts
└── README.md                  # This file
```

## 🎯 API Endpoints

The frontend expects the following Django REST API endpoints:

### Books
- `GET /api/books/` - List all books
- `POST /api/books/` - Create a new book
- `GET /api/books/:id/` - Get book details
- `PATCH /api/books/:id/` - Update book
- `DELETE /api/books/:id/` - Delete book

### Users
- `GET /api/users/` - List all users
- `POST /api/users/` - Create a new user
- `GET /api/users/:id/` - Get user details
- `PATCH /api/users/:id/` - Update user
- `DELETE /api/users/:id/` - Delete user

### Issues
- `GET /api/issues/` - List all issues
- `POST /api/issues/` - Create a new issue
- `GET /api/issues/:id/` - Get issue details
- `PATCH /api/issues/:id/` - Update issue (return book)
- `DELETE /api/issues/:id/` - Delete issue

## 🎨 Key Features

### Dashboard
- Real-time statistics (total books, users, active issues, overdue books)
- Recent activities and issue history
- Popular books showcase
- Quick action buttons

### Books Management
- Grid view with beautiful book cards
- Category-based filtering
- Add new books with complete details
- Issue books directly from the book card
- Search by title, author, ISBN, or category

### Users Management
- Comprehensive user table
- Role-based categorization (Student, Staff, External)
- Add new users with validation
- User statistics and analytics
- Edit and delete capabilities

### Issues Tracking
- Active issues with due date tracking
- Overdue book highlighting
- One-click return functionality
- Complete issue history
- Detailed status indicators

## 🔧 Configuration

### Tailwind CSS Customization
Edit `tailwind.config.js` to customize:
- Colors (primary, secondary, success, error)
- Font families
- Animations
- Shadows and effects

### API Configuration
Edit `src/lib/api.ts` to customize:
- Base URL
- Request/Response interceptors
- Authentication headers
- Error handling

## 📱 Responsive Design

The application is fully responsive:
- **Mobile**: Optimized touch interface, collapsible sidebar
- **Tablet**: Grid layouts adjust for optimal viewing
- **Desktop**: Full-featured interface with expanded views

## 🚀 Build for Production

```bash
npm run build
npm run start
```

## 🧪 Development Tips

1. **Hot Reload**: Changes are reflected immediately in development
2. **TypeScript**: Strict type checking helps catch errors early
3. **React Query**: Automatic caching and background refetching
4. **Zustand**: Simple, fast state management

## 📝 Common Commands

```bash
# Development
npm run dev

# Build
npm run build

# Start production server
npm run start

# Lint code
npm run lint
```

## 🎨 Design Inspiration

The UI design is inspired by modern library management systems with a focus on:
- Clean, minimalist interface
- Intuitive navigation
- Clear visual hierarchy
- Smooth animations and transitions
- Accessible color schemes

## 🐛 Troubleshooting

### API Connection Issues
- Ensure Django backend is running on `http://localhost:8000`
- Check CORS settings in Django
- Verify API endpoints match the expected format

### Build Errors
- Delete `.next` folder and rebuild
- Clear npm cache: `npm cache clean --force`
- Reinstall dependencies

### TypeScript Errors
- Run `npm run lint` to check for issues
- Ensure all types are properly defined in `src/types/`

## 📄 License

This project is part of a Library Management System. Modify and use as needed for your library needs.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.

## 📧 Support

For issues and questions, please create an issue in the repository.

---

Built with ❤️ using Next.js, TypeScript, and Tailwind CSS

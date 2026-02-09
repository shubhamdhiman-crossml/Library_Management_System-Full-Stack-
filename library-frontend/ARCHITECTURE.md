# Library Management System - Architecture

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Frontend (Next.js)                      │
│                     http://localhost:3000                     │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌─────────────┐  ┌──────────────┐  ┌─────────────────┐   │
│  │  Dashboard  │  │    Books     │  │      Users      │   │
│  │    Page     │  │     Page     │  │      Page       │   │
│  └─────────────┘  └──────────────┘  └─────────────────┘   │
│                                                              │
│  ┌─────────────┐  ┌──────────────────────────────────┐    │
│  │   Issues    │  │      Components Layer            │    │
│  │    Page     │  │  (Sidebar, Header, Cards, etc.)  │    │
│  └─────────────┘  └──────────────────────────────────┘    │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              State Management (Zustand)               │  │
│  │         + React Query (Data Fetching & Cache)         │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │            API Services Layer (Axios)                 │  │
│  │    books.ts  │  users.ts  │  issues.ts               │  │
│  └──────────────────────────────────────────────────────┘  │
│                           ▼                                  │
└───────────────────────────┼──────────────────────────────────┘
                            │ HTTP Requests
                            │
┌───────────────────────────▼──────────────────────────────────┐
│                  Django REST Framework API                    │
│                    http://localhost:8000/api                  │
├───────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌────────────┐  ┌────────────┐  ┌─────────────────────┐   │
│  │   Books    │  │   Users    │  │       Issues        │   │
│  │   Views    │  │   Views    │  │       Views         │   │
│  └────────────┘  └────────────┘  └─────────────────────┘   │
│        │               │                    │                │
│        ▼               ▼                    ▼                │
│  ┌────────────┐  ┌────────────┐  ┌─────────────────────┐   │
│  │   Books    │  │   Users    │  │       Issues        │   │
│  │ Serializer │  │ Serializer │  │     Serializer      │   │
│  └────────────┘  └────────────┘  └─────────────────────┘   │
│        │               │                    │                │
│        ▼               ▼                    ▼                │
│  ┌────────────┐  ┌────────────┐  ┌─────────────────────┐   │
│  │   Book     │  │    User    │  │       Issue         │   │
│  │   Model    │  │   Model    │  │       Model         │   │
│  └────────────┘  └────────────┘  └─────────────────────┘   │
│                           ▼                                   │
└───────────────────────────┼───────────────────────────────────┘
                            │
┌───────────────────────────▼───────────────────────────────────┐
│                       MySQL Database                          │
│                                                               │
│   ┌──────────┐   ┌──────────┐   ┌────────────────────┐     │
│   │  books   │   │  users   │   │      issues        │     │
│   │  table   │   │  table   │   │      table         │     │
│   └──────────┘   └──────────┘   └────────────────────┘     │
└───────────────────────────────────────────────────────────────┘
```

## 📊 Data Flow

### 1. User Interaction → Component
```
User clicks "Add Book" → BookPage component → Opens Modal
```

### 2. Form Submission → API Service
```
Modal form submit → React Hook Form validation → booksService.create()
```

### 3. API Request → Backend
```
Axios POST /api/books/ → Django View → Serializer → Model → Database
```

### 4. Response → State Update
```
Database → Django Response → React Query cache update → UI refresh
```

## 🎨 Component Hierarchy

```
App (layout.tsx)
├── Providers
│   └── QueryClientProvider (React Query)
│
├── Dashboard Layout
│   ├── Sidebar
│   │   ├── Logo
│   │   ├── Navigation Menu
│   │   └── User Profile
│   │
│   └── Main Content
│       ├── Header
│       │   ├── Search Bar
│       │   ├── Notifications
│       │   └── User Avatar
│       │
│       └── Page Content
│           ├── Dashboard Page
│           │   ├── StatCard (x4)
│           │   ├── Recent Issues Card
│           │   ├── Popular Books Card
│           │   └── Quick Actions
│           │
│           ├── Books Page
│           │   ├── Page Header
│           │   ├── Filter Buttons
│           │   ├── BookCard Grid
│           │   ├── Add Book Modal
│           │   └── Issue Book Modal
│           │
│           ├── Users Page
│           │   ├── Page Header
│           │   ├── Stats Cards
│           │   ├── Users Table
│           │   └── Add User Modal
│           │
│           └── Issues Page
│               ├── Page Header
│               ├── Stats Cards
│               ├── Active Issues Table
│               └── Returned Issues Table
```

## 🔄 State Management

### Global State (Zustand)
- Current user
- Sidebar open/closed state
- Search query
- Books, Users, Issues collections

### Server State (React Query)
- API data caching
- Automatic refetching
- Optimistic updates
- Background synchronization

### Local State (useState)
- Modal open/closed
- Form inputs
- UI interactions
- Filters and selections

## 🛠️ Technology Stack Details

### Frontend Technologies
| Technology | Purpose | Version |
|------------|---------|---------|
| Next.js | React framework | 14.2.23 |
| React | UI library | 18.3.1 |
| TypeScript | Type safety | 5.x |
| Tailwind CSS | Styling | 3.4.1 |
| Zustand | State management | 5.0.2 |
| React Query | Data fetching | 5.62.7 |
| Axios | HTTP client | 1.7.9 |
| React Hook Form | Form handling | 7.54.2 |
| date-fns | Date formatting | 4.1.0 |
| Lucide React | Icons | 0.460.0 |

### Backend Technologies (Django)
| Technology | Purpose |
|------------|---------|
| Django | Web framework |
| Django REST Framework | API framework |
| MySQL | Database |

## 📡 API Endpoints

### Books API
```
GET    /api/books/           - List all books
POST   /api/books/           - Create book
GET    /api/books/:id/       - Get book details
PATCH  /api/books/:id/       - Update book
DELETE /api/books/:id/       - Delete book
```

### Users API
```
GET    /api/users/           - List all users
POST   /api/users/           - Create user
GET    /api/users/:id/       - Get user details
PATCH  /api/users/:id/       - Update user
DELETE /api/users/:id/       - Delete user
```

### Issues API
```
GET    /api/issues/          - List all issues
POST   /api/issues/          - Create issue
GET    /api/issues/:id/      - Get issue details
PATCH  /api/issues/:id/      - Update issue
DELETE /api/issues/:id/      - Delete issue
```

## 🎯 Key Features Implementation

### Search Functionality
- **Location**: Header component
- **Implementation**: Debounced input → Zustand store → Filtered results
- **Scope**: Books (title, author, ISBN, category)

### Real-time Updates
- **Technology**: React Query
- **Strategy**: Mutation success → invalidate queries → automatic refetch
- **Cache**: 60 seconds stale time

### Responsive Design
- **Breakpoints**: mobile (< 768px), tablet (768-1024px), desktop (> 1024px)
- **Strategy**: Mobile-first with Tailwind responsive utilities
- **Navigation**: Collapsible sidebar on mobile

### Form Validation
- **Technology**: React Hook Form
- **Rules**: Required fields, email format, number ranges
- **Feedback**: Inline error messages, toast notifications

## 🔒 Security Considerations

1. **Environment Variables**: API URLs stored in `.env.local`
2. **Input Validation**: Client-side validation + server-side validation
3. **CORS**: Must be configured in Django settings
4. **Type Safety**: TypeScript prevents runtime type errors

## 📈 Performance Optimizations

1. **Code Splitting**: Automatic with Next.js App Router
2. **Image Optimization**: Next.js Image component
3. **Caching**: React Query smart caching strategy
4. **Lazy Loading**: Components loaded on demand
5. **Debouncing**: Search input debounced by 300ms

## 🚀 Deployment Considerations

### Frontend Deployment
- **Platform**: Vercel, Netlify, or any Node.js host
- **Build**: `npm run build`
- **Environment**: Set `NEXT_PUBLIC_API_URL` to production API

### Backend Deployment
- **Requirements**: Python, Django, MySQL
- **CORS**: Must allow frontend domain
- **Static**: Serve with nginx or Whitenoise

## 📊 Database Schema

### Books Table
- id (PK)
- title
- author
- isbn (Unique)
- category
- publisher
- total_copies
- available_copies

### Users Table (Django AbstractUser)
- id (PK)
- username (Unique)
- email
- first_name
- last_name
- role (student/staff/external)
- phone
- is_active
- date_joined

### Issues Table
- id (PK)
- user_id (FK → Users)
- book_id (FK → Books)
- issue_date
- due_date
- returned (Boolean)

## 🔄 Development Workflow

1. **Make changes** in `src/` files
2. **Hot reload** automatically updates browser
3. **TypeScript** catches errors during development
4. **Test** in browser at localhost:3000
5. **Build** for production with `npm run build`

---

This architecture provides a scalable, maintainable foundation for the Library Management System.

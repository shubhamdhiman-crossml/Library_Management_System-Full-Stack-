# LibHub - System Architecture

## 🏗️ Overall Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     CLIENT LAYER (Next.js)                       │
├─────────────────────────────────────────────────────────────────┤
│  Pages                Components              State Management    │
│  ─────                ──────────              ─────────────────   │
│  /          ├─→  Sidebar            ├─→  useToast Context       │
│  /books     ├─→  Toast              ├─→  Custom Hooks           │
│  /books/new ├─→  Modal              ├─→  Local State            │
│  /users     ├─→  Forms              └─→  JSON Data              │
│  /issues    └─→  Tables                                         │
└─────────────────────────────────────────────────────────────────┘
                              ↓
                  ┌──────────────────────┐
                  │   API SERVICE LAYER  │
                  │   (lib/api.ts)       │
                  ├──────────────────────┤
                  │  booksApi            │
                  │  usersApi            │
                  │  issuesApi           │
                  │  + Error Handling    │
                  │  + Type Safety       │
                  └──────────────────────┘
                              ↓
              ┌───────────────────────────────┐
              │  HTTP Layer (REST API)        │
              │  • GET /api/books/            │
              │  • POST /api/books/           │
              │  • PUT /api/books/{id}/       │
              │  • DELETE /api/books/{id}/    │
              │  (+ Users, Issues)            │
              └───────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                     SERVER LAYER (Django)                        │
├─────────────────────────────────────────────────────────────────┤
│  Apps                 Models              Views/Serializers      │
│  ────                 ──────              ──────────────────     │
│  books    ├─→  Book         ├─→  BookListCreateView             │
│  users    ├─→  User         ├─→  BookDetailView                 │
│  issues   ├─→  Issue        ├─→  UserViewSet                    │
│  search   └─→  [Relations]  └─→  IssueViewSet                   │
└─────────────────────────────────────────────────────────────────┘
                              ↓
              ┌───────────────────────────────┐
              │     Database Layer (SQLite)   │
              │  tables: users, books,        │
              │  issues, auth, etc.           │
              └───────────────────────────────┘
```

---

## 📊 Data Flow Diagram

### Creating a Book
```
User Input (Form)
       ↓
Add Book Page
       ↓
Form Submission
       ↓
booksApi.create()
       ↓
POST /api/books/ (with data)
       ↓
Django BookListCreateView
       ↓
BookSerializer (validation)
       ↓
Save to Database
       ↓
Response (success/error)
       ↓
Toast Notification
       ↓
Redirect to Books List
```

### Fetching Books
```
Dashboard/Books Page Renders
       ↓
useEffect Hook
       ↓
booksApi.list()
       ↓
GET /api/books/?search=...
       ↓
Django BookListCreateView
       ↓
FilterBackend (search)
       ↓
Return Results
       ↓
Update State
       ↓
Re-render with Data
```

---

## 🔄 Component Hierarchy

```
RootLayout
├── ToastProvider
│   ├── Sidebar
│   ├── Main Content
│   │   ├── Dashboard
│   │   ├── Books/
│   │   │   ├── page.tsx (List)
│   │   │   ├── new/page.tsx (Form)
│   │   │   └── [id]/page.tsx (Detail)
│   │   ├── Users/
│   │   │   ├── page.tsx (List)
│   │   │   └── new/page.tsx (Form)
│   │   └── Issues/
│   │       ├── page.tsx (List)
│   │       └── new/page.tsx (Form)
│   └── Toast (Notifications)
```

---

## 🔗 API Endpoints Map

```
Books
├── List & Create
│   └── GET/POST /api/books/
│       ├── Params: ?search=title&category=fiction
│       └── Response: {count, results: [...]}
├── Detail & Update & Delete
│   └── GET/PUT/DELETE /api/books/{id}/
│       └── Response: {id, title, author, ...}

Users
├── List & Create
│   └── GET/POST /api/users/
│       ├── Params: ?search=name&role=student
│       └── Response: {count, results: [...]}
├── Detail & Update & Delete
│   └── GET/PUT/DELETE /api/users/{id}/
│       └── Response: {id, username, email, role, ...}

Issues
├── List & Create
│   └── GET/POST /api/issues/
│       ├── Params: ?returned=false
│       └── Response: {count, results: [...]}
├── Detail & Update & Delete
│   └── GET/PUT/DELETE /api/issues/{id}/
│       └── Response: {id, user, book, issue_date, due_date, returned}
```

---

## 📱 State Management Pattern

```
App State
├── Books State
│   ├── books: Book[]
│   ├── loading: boolean
│   ├── error: string | null
│   └── search: string
├── Users State
│   ├── users: User[]
│   ├── loading: boolean
│   ├── error: string | null
│   └── filter: string
├── Global Toast
│   ├── toasts: Toast[]
│   ├── addToast()
│   └── removeToast()
└── Form State (local)
    ├── formData: object
    ├── loading: boolean
    └── validation: errors
```

---

## 🎨 UI Component Tree

```
App
├── Layout (Header + Sidebar)
│   └── Main
│       ├── Page Container
│       │   ├── Page Title
│       │   ├── Filters/Search
│       │   ├── Content Area
│       │   │   ├── Loading State
│       │   │   ├── Error State
│       │   │   ├── Empty State
│       │   │   └── Data Grid/Table/Cards
│       │   └── Actions
│       └── Sidebar
│           ├── Logo
│           ├── Nav Items
│           ├── Active Indicator
│           └── Footer
└── Global Toast Container
    └── Toast Items (stacked)
```

---

## 🔐 Type System

```
TypeScript Types (types/index.ts)
├── Domain Models
│   ├── User
│   │   ├── id: number
│   │   ├── username: string
│   │   ├── email: string
│   │   ├── first_name: string
│   │   ├── last_name: string
│   │   ├── role: 'student' | 'staff' | 'external'
│   │   ├── phone?: string
│   │   └── date_joined?: string
│   │
│   ├── Book
│   │   ├── id: number
│   │   ├── title: string
│   │   ├── author: string
│   │   ├── isbn: string
│   │   ├── category: string
│   │   ├── publisher: string
│   │   ├── total_copies: number
│   │   ├── available_copies: number
│   │   ├── created_at?: string
│   │   └── updated_at?: string
│   │
│   └── Issue
│       ├── id: number
│       ├── user: number | User
│       ├── book: number | Book
│       ├── issue_date: string
│       ├── due_date: string
│       ├── returned: boolean
│       └── return_date?: string
│
├── API Response Wrapper
│   ├── ApiResponse<T>
│   │   ├── results?: T[]
│   │   ├── count?: number
│   │   ├── next?: string | null
│   │   ├── previous?: string | null
│   │   ├── data?: T
│   │   ├── error?: string
│   │   └── message?: string
│
└── Other Types
    ├── AuthToken
    ├── SearchParams
    └── Toast
```

---

## 🔄 Error Handling Flow

```
User Action (Submit Form, Click Button)
       ↓
API Call (try)
       ↓
Success → Response
  │        ├─→ Parse Data
  │        ├─→ Update State
  │        ├─→ Show Success Toast
  │        └─→ Redirect/Refresh
  │
Error → Catch
         ├─→ Extract Error Message
         ├─→ Show Error Toast
         └─→ Log to Console
              (dev mode)
```

---

## 📈 Performance Considerations

```
Optimization Points
├── Data Fetching
│   ├── useEffect dependencies
│   ├── Avoid re-fetching on re-render
│   └── Client-side filtering for search
├── Component Rendering
│   ├── Memoization where needed
│   ├── Lazy loaded routes
│   └── Conditional rendering
└── Bundle Size
    ├── Tree-shaking unused code
    ├── Optimized imports
    └── Next.js automatic optimization
```

---

## 🚀 Deployment Architecture

```
Development
└── localhost:3000 ↔ localhost:8000

Production
├── Frontend (Vercel)
│   └── CDN Distribution
├── Backend (Docker/VPS)
│   └── Database (PostgreSQL/MySQL)
└── Static Assets (S3/CloudFront)
```

---

## 📋 Feature Matrix

| Feature | Books | Users | Issues | Dashboard |
|---------|:-----:|:-----:|:------:|:---------:|
| List | ✅ | ✅ | ✅ | - |
| Create | ✅ | ✅ | ✅ | - |
| Read Details | ✅ | - | ✅ | - |
| Update | ✅ | - | ✅ | - |
| Delete | ✅ | ✅ | - | - |
| Search | ✅ | ✅ | - | - |
| Filter | ✅ | ✅ | ✅ | - |
| Status Badge | - | ✅ | ✅ | - |
| Statistics | - | - | - | ✅ |

---

## 🔮 Future Architecture (Phase 2)

```
┌─────────────────────────────────────────────────────┐
│              Authentication Layer                   │
├─────────────────────────────────────────────────────┤
│  Login/Register Pages                               │
│  JWT Token Management                               │
│  Protected Routes                                   │
│  Session Persistence                                │
└─────────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────────┐
│            Redux State Management                   │
├─────────────────────────────────────────────────────┤
│  Centralized State                                   │
│  Better DevTools Support                            │
│  Complex State Logic                                │
└─────────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────────┐
│           Advanced Features                         │
├─────────────────────────────────────────────────────┤
│  Real-time Updates (WebSocket)                      │
│  Reports & Export (PDF, CSV)                        │
│  Analytics Dashboard                                │
│  Email Notifications                                │
└─────────────────────────────────────────────────────┘
```

---

**Architecture Diagram Generated: February 7, 2026**
**Version: 2.0**

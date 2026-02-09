# LibHub Frontend - Quick Start Guide

## 🚀 Installation (5 minutes)

### Step 1: Navigate to Frontend
```bash
cd frontend
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Configure Environment
Create `.env.local` file:
```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Step 4: Start Development Server
```bash
npm run dev
```

✅ Frontend ready at: **http://localhost:3000**

---

## 🔌 Backend Setup (if needed)

### Prerequisites
- Python 3.9+
- pip

### Installation
```bash
cd backend
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r ../requirement.txt

# Run migrations
python manage.py migrate

# Create admin user
python manage.py createsuperuser

# Start server
python manage.py runserver
```

✅ Backend ready at: **http://localhost:8000**

---

## 📋 Available Pages

| Page | URL | Purpose |
|------|-----|---------|
| Dashboard | `/` | Overview with statistics |
| Books List | `/books` | View all books, search, filter |
| Add Book | `/books/new` | Create new book |
| Book Detail | `/books/[id]` | View/Edit book |
| Users List | `/users` | Manage users with roles |
| Add User | `/users/new` | Create new user |
| Issues | `/issues` | Track book issues |
| Issue Book | `/issues/new` | Create new book issue |

---

## 🎯 Key Features

### 1. Dashboard
- 📊 Real-time statistics
- 📈 Quick access cards
- ⚠️ Overdue books count
- ✨ System features overview

### 2. Books Management
- 🔍 Search by title, author, ISBN
- 📁 Filter by category
- ➕ Add new books
- ✏️ Edit book details
- 🗑️ Delete books
- 📊 View availability

### 3. Users Management
- 👥 Search users
- 🏷️ Filter by role (Student, Staff, External)
- ➕ Add new users
- ✏️ Edit user details
- 🗑️ Remove users
- 📞 Phone number tracking

### 4. Issues Tracking
- 📤 Issue books to users
- 📥 Mark books as returned
- ⏰ Track due dates
- 🔴 Highlight overdue books
- 🔍 Filter by status
- 📊 View issue history

---

## 🛠️ Development

### Build for Production
```bash
npm run build
npm start
```

### Lint Code
```bash
npm run lint
```

### Type Check
```bash
npx tsc --noEmit
```

---

## 🔐 Security Notes

1. **Environment Variables**: Never commit `.env.local` to git
2. **API URL**: Update `NEXT_PUBLIC_API_URL` for different environments
3. **CORS**: Configure Django CORS settings for production
4. **Authentication**: First login feature planned for Phase 2

---

## 🐛 Common Issues

### Issue: "Cannot GET /books"
**Solution**: Check sidebar navigation routes are correct
```bash
# Verify next.config.ts and routing
npm run dev
```

### Issue: API connection failed
**Solution**: Ensure backend is running
```bash
# Terminal 1 - Backend
cd backend && python manage.py runserver

# Terminal 2 - Frontend
cd frontend && npm run dev
```

### Issue: Port 3000 already in use
**Solution**: 
```bash
# Use different port
npm run dev -- -p 3001
```

---

## 📦 Project Structure Changes

### New Files Created
```
frontend/
├── types/
│   └── index.ts              ← Type definitions
├── lib/
│   ├── api.ts               ← API service layer
│   └── context.tsx          ← Toast context provider
├── app/
│   ├── components/
│   │   ├── Toast.tsx        ← Notification system
│   │   ├── Modal.tsx        ← Reusable modal
│   │   └── Sidebar.tsx      ← Updated sidebar
│   ├── users/
│   │   ├── page.tsx         ← Users listing
│   │   └── new/page.tsx     ← Create user form
│   ├── issues/
│   │   ├── page.tsx         ← Issues tracking
│   │   └── new/page.tsx     ← Issue form
│   ├── books/
│   │   ├── new/page.tsx     ← Create book form
│   │   └── [id]/page.tsx    ← Book detail & edit
│   └── layout.tsx           ← Updated with providers
```

---

## 🎨 Customization

### Change Brand Name
Edit `Sidebar.tsx`:
```tsx
<h1>Your Library Name</h1>
```

### Change Colors
Edit `tailwind.config.js`:
```js
theme: {
  colors: {
    primary: '#your-color'
  }
}
```

### Change API URL
Edit `.env.local`:
```
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```

---

## 📞 Support

### Need Help?
1. Check FRONTEND_IMPROVEMENTS.md for detailed documentation
2. Review API service in `lib/api.ts`
3. Check component examples in `app/` folder

### Reporting Issues
Provide:
- Error message (from console or toast)
- Steps to reproduce
- Browser/Environment info

---

## 🚢 Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Docker
```bash
docker build -t libhub-frontend .
docker run -p 3000:3000 libhub-frontend
```

### Traditional Server
```bash
npm run build
npm start
```

---

## 📈 Next Steps

1. ✅ **Current**: Full CRUD functionality working
2. 🔜 **Phase 2**: Add authentication (Login/Register)
3. 🔜 **Phase 3**: Advanced features (Reports, Notifications)

---

**Happy Coding! 🎉**

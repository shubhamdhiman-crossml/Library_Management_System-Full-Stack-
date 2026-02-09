# Library Management System

A full-stack library management system built with Django REST Framework and Next.js.

## Project Structure

```
Library_management_System/
├── backend/                 # Django REST API
│   ├── backend/            # Main Django project settings
│   ├── users/              # User management app
│   ├── books/              # Books catalog app
│   ├── issues/             # Book issue tracking app
│   ├── search/             # Search functionality
│   ├── manage.py           # Django management script
│   └── db.sqlite3          # Database
├── frontend/               # Next.js React frontend
│   ├── app/
│   │   ├── books/          # Books page
│   │   ├── users/          # Users page
│   │   ├── issues/         # Issues page
│   │   ├── login/          # Login page
│   │   ├── components/     # Shared components
│   │   └── globals.css     # Global styles
│   ├── package.json        # Dependencies
│   └── tailwind.config.js  # Tailwind CSS config
└── requirement.txt         # Python dependencies
```

## Setup Instructions

### Backend Setup

1. **Navigate to backend directory:**
```bash
cd backend/backend
```

2. **Create a virtual environment (optional but recommended):**
```bash
python -m venv venv
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate
```

3. **Install dependencies:**
```bash
pip install -r ../../requirement.txt
```

4. **Create .env file (optional):**
```bash
cp ../.env.example .env
```

5. **Run migrations:**
```bash
python manage.py migrate
```

6. **Create a superuser (admin account):**
```bash
python manage.py createsuperuser
```

7. **Run the development server:**
```bash
python manage.py runserver
```

Backend will be available at: `http://127.0.0.1:8000/`

### Frontend Setup

1. **Navigate to frontend directory:**
```bash
cd frontend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Run the development server:**
```bash
npm run dev
```

Frontend will be available at: `http://localhost:3000/`

## API Endpoints

### Books
- `GET /api/books/` - List all books with search
- `POST /api/books/` - Create a new book
- `GET /api/books/{id}/` - Get book details
- `PUT /api/books/{id}/` - Update book
- `DELETE /api/books/{id}/` - Delete book

### Users
- `GET /api/users/` - List all users with search
- `POST /api/users/` - Create a new user
- `GET /api/users/{id}/` - Get user details
- `PUT /api/users/{id}/` - Update user
- `DELETE /api/users/{id}/` - Delete user

### Issues
- `GET /api/issues/` - List all issues
- `POST /api/issues/` - Create a new issue
- `GET /api/issues/{id}/` - Get issue details
- `PUT /api/issues/{id}/` - Update issue status
- `DELETE /api/issues/{id}/` - Delete issue

## Database Models

### Book
- `id` - Primary key
- `title` - Book title
- `author` - Author name
- `isbn` - ISBN number (unique)
- `category` - Book category
- `publisher` - Publisher name
- `total_copies` - Total copies in library
- `available_copies` - Currently available copies

### User
- `id` - Primary key
- `username` - Unique username
- `email` - Email address
- `first_name` - First name
- `last_name` - Last name
- `role` - User role (student, staff, external)
- `phone` - Phone number
- `is_active` - Account active status
- `is_staff` - Staff status
- `date_joined` - Registration date

### Issue
- `id` - Primary key
- `user_id` - Reference to User
- `book_id` - Reference to Book
- `issue_date` - Date book was issued
- `due_date` - Due date for return
- `returned` - Whether book is returned

## Admin Panel

Access the Django admin panel at: `http://127.0.0.1:8000/admin/`

Use your superuser credentials to:
- Manage books
- Manage users
- Track book issues
- View overdue books

## Features

- ✅ Book catalog with search and filter
- ✅ User management
- ✅ Book issue tracking
- ✅ Overdue detection
- ✅ Role-based user types
- ✅ CORS enabled for frontend
- ✅ RESTful API with DRF

## Common Issues & Troubleshooting

### CORS Error
If you see CORS errors, ensure `CORS_ALLOWED_ORIGINS` in `backend/settings.py` includes your frontend URL.

### Frontend Cannot Connect to Backend
- Ensure Django server is running on `http://127.0.0.1:8000/`
- Check if `ALLOWED_HOSTS` in `settings.py` includes your domain
- Verify network connectivity and firewall settings

### Database Errors
```bash
# Reset migrations (warning: clears data)
python manage.py migrate issues zero
python manage.py migrate
python manage.py makemigrations
python manage.py migrate
```

## Technologies Used

### Backend
- Django 5.2.10
- Django REST Framework 3.16.1
- Django CORS Headers 4.9.0
- PostgreSQL/SQLite
- Python 3.8+

### Frontend
- Next.js 16.1.6
- React 19.2.3
- Tailwind CSS 4.1.18
- Axios (for API calls)

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## License

MIT License - feel free to use this project for personal or commercial purposes.

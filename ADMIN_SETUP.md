# Admin Panel Setup Guide

This guide will help you set up the admin panel for your portfolio website.

## Features

- **Authentication**: Secure login system using Firebase Authentication
- **Dashboard**: Overview of projects and messages with statistics
- **Projects Management**: Add, edit, delete, and manage portfolio projects
- **Messages Management**: View and manage contact form messages
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## Prerequisites

1. Firebase project with Firestore Database
2. Firebase Authentication enabled
3. Angular project with Firebase dependencies installed

## Firebase Setup

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or use existing one
3. Enable Firestore Database
4. Enable Authentication (Email/Password)

### 2. Firestore Database Rules

Set up the following security rules in your Firestore Database:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Projects collection - read by anyone, write by authenticated users
    match /projects/{projectId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Messages collection - read/write by authenticated users only
    match /messages/{messageId} {
      allow read, write: if request.auth != null;
    }
    
    // Admins collection - read by authenticated users
    match /admins/{adminId} {
      allow read: if request.auth != null && request.auth.uid == adminId;
    }
  }
}
```

### 3. Create Admin User

1. In Firebase Console, go to Authentication
2. Add a new user with email and password
3. Note down the UID of the created user
4. In Firestore Database, create a document in `admins` collection:
   - Document ID: Use the UID from step 3
   - Fields:
     - `email`: admin email
     - `displayName`: Admin Name (optional)
     - `role`: "admin"

### 4. Firebase Configuration

Make sure your Firebase configuration is properly set up in your Angular project. The admin panel uses the existing Firebase configuration.

## Usage

### Accessing Admin Panel

1. Navigate to `/admin/login` in your application
2. Use the admin credentials you created in Firebase
3. After successful login, you'll be redirected to the dashboard

### Dashboard

The dashboard shows:
- Total projects count
- Featured projects count
- Total messages count
- Unread messages count
- Recent messages preview
- Recent projects preview
- Quick action buttons

### Projects Management

- **View Projects**: See all projects in a table format
- **Add Project**: Click "Add New Project" button
- **Edit Project**: Click edit button on any project
- **Delete Project**: Click delete button (with confirmation)
- **Project Fields**:
  - Title
  - Description
  - Category (Web Apps, Mobile Apps, Backend, Desktop Apps)
  - Image URL
  - Live URL
  - Code URL
  - Status (Completed, In Progress, Planned)
  - Date
  - Technologies (comma-separated)
  - Featured (checkbox)

### Messages Management

- **View Messages**: See all contact form messages
- **Filter Messages**: Filter by All, Unread, or Read
- **Search Messages**: Search by name, email, subject, or message content
- **Mark as Read**: Click the check button on unread messages
- **Delete Message**: Click delete button (with confirmation)
- **View Details**: Click on any message to see full details
- **Reply**: Use the reply button to open email client

## Security Features

- **Authentication Guard**: All admin routes are protected
- **Firebase Security Rules**: Database access is restricted
- **Session Management**: Automatic logout on page refresh
- **Input Validation**: All forms have proper validation

## Customization

### Styling

The admin panel uses the same design system as your portfolio:
- Color variables from `src/theme/variables.scss`
- Consistent spacing and typography
- Responsive breakpoints
- Dark theme support

### Adding New Features

To add new features to the admin panel:

1. Create new components in `src/app/Admin/Pages/`
2. Add routes in `src/app/app.routes.ts`
3. Update the sidebar navigation in `admin-layout.component.html`
4. Add any new Firebase services in `src/app/Admin/Server/`

### Database Schema

#### Projects Collection
```typescript
interface Project {
  id?: string;
  title: string;
  description: string;
  category: string;
  categoryIcon: string;
  image: string;
  liveUrl: string;
  codeUrl: string;
  status: 'completed' | 'in-progress' | 'planned';
  date: string;
  technologies: string[];
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

#### Messages Collection
```typescript
interface Message {
  id?: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  timestamp: Date;
  read: boolean;
}
```

#### Admins Collection
```typescript
interface AdminUser {
  uid: string;
  email: string;
  displayName?: string;
  role: 'admin';
}
```

## Troubleshooting

### Common Issues

1. **Login not working**: Check Firebase Authentication settings and admin user creation
2. **Database access denied**: Verify Firestore security rules
3. **Styling issues**: Ensure admin styles are imported in `global.scss`
4. **Route not found**: Check route configuration in `app.routes.ts`

### Debug Mode

To enable debug mode, check the browser console for any Firebase-related errors. The admin panel includes error handling and will show appropriate error messages.

## Support

If you encounter any issues or need help with customization, please check:
1. Firebase Console for authentication and database issues
2. Browser console for JavaScript errors
3. Network tab for API request failures

The admin panel is designed to be robust and user-friendly, with proper error handling and responsive design.

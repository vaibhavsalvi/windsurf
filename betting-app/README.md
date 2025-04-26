# Betting Application

A full-stack betting application with React frontend and PHP/MySQL backend.

## Project Structure

```
betting-app/
├── frontend/         # React frontend
└── backend/          # PHP backend
    ├── api/          # API endpoints
    ├── config/       # Database configuration
    ├── models/       # Data models
    └── utils/        # Utility functions
```

## Features

- User authentication (register, login)
- Browse betting events
- Place bets on events
- View betting history
- User dashboard

## Technology Stack

- **Frontend**: React, Material-UI
- **Backend**: PHP
- **Database**: MySQL
- **Deployment**: Any web hosting with PHP and MySQL support

## Local Development Setup

### Backend Setup

1. Install a local web server with PHP and MySQL (e.g., XAMPP, MAMP)
2. Create a MySQL database named `betting_app`
3. Copy the `backend` folder to your web server's document root (e.g., `htdocs` for XAMPP)
4. Update database credentials in `backend/config/database.php` if needed
5. Initialize the database by accessing `http://localhost/betting-app/backend/config/init_db.php`

### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Update the API URL in the components to match your backend URL:
   ```javascript
   const API_URL = 'http://localhost/betting-app/backend/api';
   ```

4. Start the development server:
   ```
   npm start
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Deployment

### Backend Deployment

1. Choose a web hosting provider that supports PHP and MySQL (e.g., Bluehost, HostGator, InMotion)
2. Create a MySQL database on your hosting
3. Upload the `backend` folder to your hosting using FTP or the hosting control panel
4. Update database credentials in `backend/config/database.php` with your hosting database details
5. Access `https://yourdomain.com/betting-app/backend/config/init_db.php` to initialize the database

### Frontend Deployment

1. Build the React application:
   ```
   cd frontend
   npm run build
   ```

2. Upload the contents of the `build` folder to your web hosting

3. If you're using Apache, create a `.htaccess` file in the root of your frontend deployment with:
   ```
   RewriteEngine On
   RewriteBase /
   RewriteRule ^index\.html$ - [L]
   RewriteCond %{REQUEST_FILENAME} !-f
   RewriteCond %{REQUEST_FILENAME} !-d
   RewriteRule . /index.html [L]
   ```

## Demo Credentials

- **Username**: demo
- **Password**: demo123

## License

This project is for demonstration purposes only.

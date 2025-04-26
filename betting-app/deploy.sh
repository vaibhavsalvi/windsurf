#!/bin/bash

# Betting App Deployment Script
# This script helps deploy the betting application to a web server

echo "========================================="
echo "Betting Application Deployment Script"
echo "========================================="

# Configuration
BACKEND_DIR="backend"
FRONTEND_DIR="frontend"
BUILD_DIR="$FRONTEND_DIR/build"
DEPLOY_DIR="deploy"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
ARCHIVE_NAME="betting-app_$TIMESTAMP.zip"

# Create deployment directory
echo "Creating deployment directory..."
mkdir -p $DEPLOY_DIR

# Build frontend
echo "Building React frontend..."
cd $FRONTEND_DIR
npm install
npm run build
cd ..

# Copy backend files
echo "Copying backend files..."
cp -r $BACKEND_DIR $DEPLOY_DIR/

# Copy frontend build
echo "Copying frontend build files..."
cp -r $BUILD_DIR $DEPLOY_DIR/public

# Create .htaccess for frontend routing
echo "Creating .htaccess file for frontend routing..."
cat > $DEPLOY_DIR/public/.htaccess << EOL
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
EOL

# Create deployment package
echo "Creating deployment package..."
zip -r $ARCHIVE_NAME $DEPLOY_DIR

echo "========================================="
echo "Deployment package created: $ARCHIVE_NAME"
echo "========================================="
echo ""
echo "To deploy to your web server:"
echo "1. Upload and extract the $ARCHIVE_NAME file to your web hosting"
echo "2. Update database credentials in backend/config/database.php"
echo "3. Access https://yourdomain.com/backend/config/init_db.php to initialize the database"
echo "4. Your application will be available at https://yourdomain.com/"
echo "========================================="

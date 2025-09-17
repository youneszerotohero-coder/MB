# Database Setup Instructions

## Issue Identified
The analytics API endpoints are failing with 500 errors and timeouts because the backend cannot connect to the database. The error logs show:

```
Can't reach database server at `aws-1-eu-central-1.pooler.supabase.com:5432`
```

## Solution

### 1. Create Environment File
You need to create a `.env` file in the `backend` directory with your database connection details.

**Copy the template:**
```bash
cp backend/env.template backend/.env
```

**Edit `backend/.env` with your actual values:**
```env
# Database Configuration
DATABASE_URL="postgresql://username:password@aws-1-eu-central-1.pooler.supabase.com:5432/postgres?schema=public"

# JWT Configuration
JWT_SECRET="your-super-secret-jwt-key-here"
JWT_EXPIRES_IN="1d"

# Server Configuration
NODE_ENV="development"
PORT=5000

# CORS Configuration
BACKEND_ALLOWED_ORIGINS="http://localhost:5173,http://localhost:3000"

# File Upload Configuration
UPLOAD_DIR="./uploads"
MAX_FILE_SIZE="10MB"
```

### 2. Get Your Supabase Database URL

1. Go to your Supabase project dashboard
2. Navigate to Settings > Database
3. Copy the connection string from the "Connection string" section
4. Replace `[YOUR-PASSWORD]` with your actual database password
5. Replace `[YOUR-PROJECT-REF]` with your project reference

Example:
```
postgresql://postgres:[YOUR-PASSWORD]@aws-1-eu-central-1.pooler.supabase.com:5432/postgres?schema=public
```

### 3. Generate JWT Secret

Generate a secure JWT secret:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 4. Restart the Backend Server

After creating the `.env` file:
```bash
cd backend
npm start
```

### 5. Verify Database Connection

The backend will now:
- Test the database connection before processing analytics requests
- Return proper error messages if the database is unreachable
- Handle timeouts gracefully with fallback values

## Improvements Made

### Backend Analytics Controller
- Added database connection testing before processing requests
- Improved error handling for database connection issues
- Return 503 status code for database connection errors
- Better error logging and debugging information

### Frontend Analytics Service
- Increased timeout to 15 seconds for analytics requests
- Added fallback values for database connection errors
- Better error handling and user experience

### Error Handling
- Database connection errors now return meaningful error messages
- Frontend gracefully handles database unavailability
- Timeout issues are resolved with proper configuration

## Testing

After setting up the database connection:

1. **Dashboard Stats**: Should load without 500 errors
2. **Sales Over Time**: Should return data or empty array
3. **Product Profitability**: Should return data or empty array
4. **No More Timeouts**: Requests should complete within 15 seconds

## Troubleshooting

If you still see errors:

1. **Check Database URL**: Ensure the connection string is correct
2. **Check Network**: Ensure your IP is whitelisted in Supabase
3. **Check Credentials**: Verify username and password are correct
4. **Check Logs**: Look at `backend/logs/error.log` for specific error details

## Security Note

Never commit the `.env` file to version control. It contains sensitive information like database credentials and JWT secrets.

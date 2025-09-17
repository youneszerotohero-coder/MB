# Dashboard Troubleshooting Guide

## Current Issue: 500 Internal Server Error

The dashboard is experiencing a 500 error when fetching sales data. Here's how to diagnose and fix the issue:

## Step 1: Check Backend Server Status

1. **Start the backend server:**
   ```bash
   cd backend
   npm run dev
   ```

2. **Verify server is running:**
   - Check console for "Server running on port 5000"
   - Visit `http://localhost:5000/health` in browser
   - Should return: `{"status":"success","message":"Server is running"}`

## Step 2: Check Database Connection

1. **Verify database is connected:**
   - Check backend console for database connection messages
   - Look for "Database connected" message

2. **Test database connection:**
   - Visit `http://localhost:5000/api/v1/analytics/test` (requires authentication)
   - Should return counts of orders, products, and campaigns

## Step 3: Check Authentication

1. **Ensure you're logged in:**
   - Visit `/login` page
   - Login with admin credentials
   - Verify you can access `/admin` page

2. **Check authentication token:**
   - Open browser dev tools
   - Check Application > Local Storage
   - Verify `token` exists and is not expired

## Step 4: Debug the Error

1. **Check backend console logs:**
   - Look for detailed error messages
   - Check for database connection errors
   - Look for Prisma query errors

2. **Check frontend console:**
   - Open browser dev tools
   - Check Console tab for API errors
   - Look for network request failures

## Step 5: Common Solutions

### If Database is Empty:
```bash
# Run database migrations
cd backend
npx prisma migrate dev

# Seed the database with sample data
npx prisma db seed
```

### If Authentication Issues:
1. Clear browser storage
2. Login again
3. Check if user has admin role

### If Prisma Errors:
1. Check database connection string in `.env`
2. Verify database is running
3. Run `npx prisma generate` to update Prisma client

## Step 6: Test Individual Endpoints

Test each endpoint individually:

1. **Dashboard Stats:**
   ```
   GET /api/v1/analytics/dashboard
   ```

2. **Sales Data:**
   ```
   GET /api/v1/analytics/sales
   ```

3. **Product Profitability:**
   ```
   GET /api/v1/analytics/products/profitability
   ```

## Step 7: Check Data Requirements

The dashboard requires:
- At least one order in the database
- At least one product in the database
- At least one campaign in the database (optional)

## Expected Behavior

### With Data:
- Dashboard loads with real statistics
- Charts display actual data
- Tables show product information

### Without Data:
- Dashboard loads with zero values
- Charts show empty states
- Tables show "No data available" messages

## Debug Information

The backend now includes extensive logging:
- Database connection status
- Record counts for each table
- Detailed error messages
- Query execution logs

Check the backend console for these logs when testing.

## Next Steps

1. Start the backend server
2. Check the console logs
3. Test the `/analytics/test` endpoint
4. Verify authentication
5. Check if data exists in database
6. Test individual dashboard endpoints

## Contact

If issues persist, check:
- Backend console logs
- Database connection
- Authentication status
- Data availability


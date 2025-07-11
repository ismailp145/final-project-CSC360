# Railway Deployment Guide for .NET Backend

This guide will help you deploy your .NET backend to Railway.

## Prerequisites

1. A Railway account (sign up at [railway.app](https://railway.app))
2. Your code pushed to a Git repository (GitHub, GitLab, etc.)
3. A PostgreSQL database (you can provision one on Railway)

## Step 1: Set up Railway Project

1. Go to [railway.app](https://railway.app) and sign in
2. Click "New Project"
3. Choose "Deploy from GitHub repo"
4. Select your repository
5. Choose the `backend/SocalAPI` directory as the source

## Step 2: Configure Environment Variables

In your Railway project dashboard, go to the "Variables" tab and add the following environment variables:

### Required Variables:
```
ConnectionStrings__PostgresConnection=your_postgres_connection_string
Jwt__Key=your_jwt_secret_key
Jwt__Issuer=https://your-app-name.railway.app
Jwt__Audience=https://your-frontend-domain.com
```

### Optional Variables:
```
ASPNETCORE_ENVIRONMENT=Production
PORT=8080
```

## Step 3: Set up PostgreSQL Database

1. In your Railway project, click "New Service"
2. Select "Database" → "PostgreSQL"
3. Once created, go to the PostgreSQL service
4. Copy the connection string from the "Connect" tab
5. Add it to your environment variables as `ConnectionStrings__PostgresConnection`

## Step 4: Deploy

1. Railway will automatically detect your .NET project and start building
2. The build process will:
   - Install .NET SDK
   - Restore dependencies
   - Build the project
   - Start the application

## Step 5: Run Database Migrations

After deployment, you need to run your Entity Framework migrations:

1. Go to your deployed service in Railway
2. Click on the "Deployments" tab
3. Find your latest deployment
4. Click on the deployment and go to "Logs"
5. Add a custom command to run migrations:

```bash
dotnet ef database update
```

## Step 6: Update Frontend Configuration

Update your frontend to use the new Railway URL:

```typescript
// In your frontend API service
const API_BASE_URL = 'https://your-app-name.railway.app';
```

## Step 7: Test Your Deployment

1. Visit your Railway app URL: `https://your-app-name.railway.app`
2. Test the health check endpoint: `https://your-app-name.railway.app/api`
3. Test your API endpoints

## Troubleshooting

### Common Issues:

1. **Build Failures**: Check the build logs in Railway dashboard
2. **Database Connection**: Ensure your connection string is correct
3. **Environment Variables**: Make sure all required variables are set
4. **Port Issues**: Railway automatically sets the PORT environment variable

### Useful Commands:

```bash
# Check Railway CLI (if installed)
railway status

# View logs
railway logs

# Connect to your service
railway connect
```

## Monitoring

- Railway provides built-in monitoring and logging
- Check the "Metrics" tab for performance data
- Use the "Logs" tab to debug issues

## Custom Domain (Optional)

1. Go to your Railway project settings
2. Click "Custom Domains"
3. Add your domain and configure DNS

## Cost Optimization

- Railway offers a free tier with limitations
- Monitor your usage in the "Usage" tab
- Consider upgrading if you exceed free tier limits

## Security Notes

- Never commit sensitive data like connection strings to your repository
- Use Railway's environment variables for all secrets
- Regularly rotate your JWT keys
- Enable HTTPS (Railway provides this automatically) 
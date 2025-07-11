# Railway Deployment Troubleshooting Guide

## Issue: .NET Version Mismatch

### Problem
Railway is using .NET 6.0 but your project targets .NET 8.0.

### Solution
I've created multiple configuration files to ensure .NET 8.0 is used:

1. **Updated `nixpacks.toml`**:
   ```toml
   [phases.setup]
   nixPkgs = ["dotnet-sdk_8", "dotnet-runtime_8"]
   ```

2. **Created `.nixpacks`** (alternative configuration):
   ```toml
   [phases.setup]
   nixPkgs = ["dotnet-sdk_8", "dotnet-runtime_8"]
   ```

3. **Added `global.json`**:
   ```json
   {
     "sdk": {
       "version": "8.0.101",
       "rollForward": "latestMajor"
     }
   }
   ```

4. **Created `Dockerfile`** (fallback option):
   ```dockerfile
   FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
   # ... rest of Dockerfile
   ```

## Alternative Deployment Methods

### Method 1: Use Dockerfile (Recommended)
If nixpacks continues to have issues:

1. In Railway dashboard, go to your service settings
2. Change the builder from "nixpacks" to "dockerfile"
3. Railway will automatically detect and use the `Dockerfile`

### Method 2: Manual Build Commands
If both nixpacks and Dockerfile fail:

1. In Railway dashboard, go to your service settings
2. Set custom build commands:
   ```
   dotnet restore
   dotnet publish -c Release -o out
   ```
3. Set start command:
   ```
   dotnet out/SocalAPI.dll
   ```

## Common Issues and Solutions

### Issue 1: Build Fails with .NET Version Error
**Error**: `The specified framework 'Microsoft.NETCore.App', version '8.0.0' was not found.`

**Solution**: 
- Ensure `global.json` is in the root of your project
- Check that `nixpacks.toml` specifies `dotnet-sdk_8`
- Try using the Dockerfile method

### Issue 2: Database Connection Fails
**Error**: `Unable to connect to database`

**Solution**:
1. Verify your connection string in Railway environment variables
2. Ensure PostgreSQL service is running
3. Check that the database exists
4. Run migrations after deployment:
   ```bash
   dotnet ef database update
   ```

### Issue 3: JWT Configuration Issues
**Error**: `JWT Key not found`

**Solution**:
1. Add all JWT environment variables:
   ```
   Jwt__Key=your_jwt_key
   Jwt__Issuer=https://your-app-name.railway.app
   Jwt__Audience=https://socal-nine.vercel.app
   ```

### Issue 4: Port Configuration
**Error**: `Application failed to start`

**Solution**:
1. Railway automatically sets the `PORT` environment variable
2. Ensure your app listens on the correct port:
   ```csharp
   // In Program.cs, add this if not already present
   var port = Environment.GetEnvironmentVariable("PORT") ?? "8080";
   app.Run($"http://0.0.0.0:{port}");
   ```

## Environment Variables Checklist

Make sure these are set in Railway:

### Required:
```
ConnectionStrings__PostgresConnection=your_postgres_connection_string
Jwt__Key=your_jwt_secret_key
Jwt__Issuer=https://your-app-name.railway.app
Jwt__Audience=https://socal-nine.vercel.app
```

### Optional:
```
ASPNETCORE_ENVIRONMENT=Production
PORT=8080
```

## Debugging Steps

1. **Check Build Logs**: Look for .NET version information
2. **Check Deploy Logs**: Look for startup errors
3. **Test Locally**: Run `dotnet publish -c Release -o out` locally
4. **Check Environment Variables**: Verify all required variables are set
5. **Test Database Connection**: Ensure PostgreSQL is accessible

## Quick Fix Commands

If you need to redeploy with fixes:

```bash
# Commit your changes
git add .
git commit -m "Fix Railway deployment configuration"
git push

# Railway will automatically redeploy
```

## Support Resources

- [Railway Documentation](https://docs.railway.app/)
- [.NET on Railway](https://docs.railway.app/deploy/deployments/dockerfile)
- [Nixpacks Documentation](https://docs.railway.app/deploy/deployments/nixpacks)

## Emergency Fallback

If all else fails, you can:

1. Use Railway's "Deploy from Docker Image" option
2. Build locally and upload the built application
3. Use a different hosting platform temporarily (Heroku, Azure, etc.) 
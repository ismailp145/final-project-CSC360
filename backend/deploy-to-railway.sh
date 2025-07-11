#!/bin/bash

# Railway Deployment Script for .NET Backend
# This script helps prepare and deploy your .NET backend to Railway

echo "🚀 Railway Deployment Script for .NET Backend"
echo "=============================================="

# Check if we're in the right directory
if [ ! -f "SocalAPI.csproj" ]; then
    echo "❌ Error: Please run this script from the backend/SocalAPI directory"
    exit 1
fi

# Build the project
echo "📦 Building the project..."
dotnet build -c Release

if [ $? -ne 0 ]; then
    echo "❌ Build failed. Please fix the errors and try again."
    exit 1
fi

# Publish the project
echo "📤 Publishing the project..."
dotnet publish -c Release -o out

if [ $? -ne 0 ]; then
    echo "❌ Publish failed. Please fix the errors and try again."
    exit 1
fi

echo "✅ Build and publish completed successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Push your code to GitHub/GitLab"
echo "2. Go to railway.app and create a new project"
echo "3. Connect your repository"
echo "4. Set the source directory to: backend/SocalAPI"
echo "5. Add the following environment variables:"
echo "   - ConnectionStrings__PostgresConnection"
echo "   - Jwt__Key"
echo "   - Jwt__Issuer"
echo "   - Jwt__Audience"
echo "6. Deploy and run database migrations"
echo ""
echo "📖 For detailed instructions, see: RAILWAY_DEPLOYMENT.md" 
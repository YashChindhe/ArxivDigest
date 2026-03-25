@echo off
REM ArxivDigest Setup Script for Windows
REM This script initializes all necessary components

echo.
echo 🚀 ArxivDigest Setup Script
echo ============================
echo.

REM Check Node version
echo 📦 Checking Node.js version...
node -v
echo.

REM Install dependencies
echo 📥 Installing dependencies...
call npm install
echo ✅ Dependencies installed
echo.

REM Create .env.local if it doesn't exist
if not exist .env.local (
    echo 📝 Creating .env.local file...
    (
        echo # Gemini API
        echo NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here
        echo.
        echo # Neon Database
        echo DATABASE_URL=postgresql://user:password@host/paper-digest-db
        echo.
        echo # Neon Auth (optional)
        echo NEON_AUTH_TOKEN=your_neon_auth_token_here
        echo.
        echo # PDF extraction
        echo NEXT_PUBLIC_PDF_WORKER_URL=/pdf.worker.min.js
    ) > .env.local
    echo ✅ .env.local created
    echo.
    echo ⚠️  Please update .env.local with your API keys:
    echo    1. Get GEMINI_API_KEY from https://aistudio.google.com/app/apikeys
    echo    2. Get DATABASE_URL from https://neon.tech
) else (
    echo ✅ .env.local already exists
)

echo.
echo 📋 Next steps:
echo 1. Update .env.local with your API keys
echo 2. Run: npm run dev
echo 3. Open: http://localhost:3000
echo.
echo ✨ Setup complete!
pause

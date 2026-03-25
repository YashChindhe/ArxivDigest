#!/bin/bash

# ArxivDigest Setup Script
# This script initializes all necessary components for ArxivDigest

echo "🚀 ArxivDigest Setup Script"
echo "============================"
echo ""

# Check Node version
echo "📦 Checking Node.js version..."
NODE_VERSION=$(node -v)
echo "Current Node version: $NODE_VERSION"
echo ""

# Install dependencies
echo "📥 Installing dependencies..."
npm install
echo "✅ Dependencies installed"
echo ""

# Create .env.local if it doesn't exist
if [ ! -f .env.local ]; then
    echo "📝 Creating .env.local file..."
    cat > .env.local << EOF
# Gemini API
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here

# Neon Database
DATABASE_URL=postgresql://user:password@host/paper-digest-db

# Neon Auth (optional)
NEON_AUTH_TOKEN=your_neon_auth_token_here

# PDF extraction
NEXT_PUBLIC_PDF_WORKER_URL=/pdf.worker.min.js
EOF
    echo "✅ .env.local created"
    echo ""
    echo "⚠️  Please update .env.local with your API keys:"
    echo "   1. Get GEMINI_API_KEY from https://aistudio.google.com/app/apikeys"
    echo "   2. Get DATABASE_URL from https://neon.tech"
else
    echo "✅ .env.local already exists"
fi

echo ""
echo "📋 Next steps:"
echo "1. Update .env.local with your API keys"
echo "2. Run: npm run dev"
echo "3. Open: http://localhost:3000"
echo ""
echo "✨ Setup complete!"

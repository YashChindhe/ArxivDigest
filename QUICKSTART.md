# ⚡ Quick Start Guide - ArxivDigest

## 🚀 Get Started in 3 Steps

### Step 1: Configure Environment

Create `.env.local` in the project root with your API keys:

```env
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_key_here
DATABASE_URL=postgresql://...your_neon_connection...
```

**Get API Keys:**
- 🔑 Gemini: https://aistudio.google.com/app/apikeys  
- 💾 Neon: https://neon.tech (create `paper-digest-db` database)

### Step 2: Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Step 3: Summarize a Paper

1. Paste an arXiv PDF URL (e.g., `https://arxiv.org/pdf/2301.00000.pdf`)
2. Add optional paper title
3. Click "Summarize Paper"
4. View 3-part AI summary in Bento Grid layout:
   - **💡 Core Contribution** - Main innovation
   - **🔬 Methodology** - Research approach  
   - **📊 Key Results** - Main findings

## 📦 Project Structure

```
app/
├── page.tsx                 # Main UI page
└── api/summarize/
    └── route.ts            # Summarization endpoint

lib/
├── services/
│   ├── gemini-summarizer.ts    # AI summarization
│   └── pdf-extraction.ts        # PDF parsing
├── db/
│   └── index.ts                # Database ops
└── utils.ts                     # Utilities

components/
├── ui/card.tsx                  # Card component
└── sections/
    ├── bento-grid.tsx           # Grid layout
    └── paper-summary-display.tsx # Summary display
```

## 🔧 Techstack

- **Framework**: Next.js 13.5, React 19, TypeScript
- **Styling**: Tailwind CSS, CVA
- **AI**: Gemini 2.5 Flash (1M token context)
- **PDF**: pdf-parse (server), pdfjs-dist (client)
- **Database**: Neon PostgreSQL
- **Icons**: Lucide React

## 🛠️ Available Commands

```bash
npm run dev    # Start dev server
npm run build  # Build for production
npm start      # Run production server
npm run lint   # Run ESLint
```

## ⚙️ Node Version

**Using Node v18.7.0** - Compatible with your existing projects

## 📚 API Documentation

### POST `/api/summarize`

**Request:**
```bash
curl -X POST http://localhost:3000/api/summarize \
  -H "Content-Type: application/json" \
  -d '{
    "pdfUrl": "https://arxiv.org/pdf/2301.00000.pdf",
    "title": "Optional Paper Title"
  }'
```

**Response:**
```json
{
  "success": true,
  "summary": {
    "coreContribution": "...",
    "methodology": "...",
    "keyResults": "...",
    "model": "gemini-2.5-flash",
    "tokensUsed": 1234
  },
  "metadata": {
    "pageCount": 25,
    "charactersProcessed": 50000
  }
}
```

## 🎨 UI Features

- **Bento Grid Layout**: Academic-inspired 3-column grid
- **Gradient Cards**: Color-coded sections (blue/purple/green)
- **Dark Mode Support**: Automatic theme detection
- **Responsive Design**: Mobile-friendly interface
- **Loading States**: Beautiful animations and spinners

## 🔮 Future Enhancements

- [ ] User authentication (Neon Auth)
- [ ] Save papers to library
- [ ] LaTeX formula rendering (rehype-katex)
- [ ] Multiple summary styles
- [ ] Paper comparison tool
- [ ] Export to PDF/Markdown
- [ ] Batch processing
- [ ] Search saved papers

## 🐛 Troubleshooting

**Error: "NEXT_PUBLIC_GEMINI_API_KEY is not set"**
- Add your Gemini API key to `.env.local`
- Restart dev server

**Error: Connection to Neon failed**
- Check `.env.local` DATABASE_URL format
- Ensure `paper-digest-db` database exists in Neon

**Build fails with Node version warning**
- Normal with Node 18.7.0 (dependencies are compatible)
- Use `npm install --legacy-peer-deps` if needed

## 📖 Related Files

- [Full README](./README.md) - Complete documentation
- [.env.local](./.env.local) - Environment variables template
- [package.json](./package.json) - Dependencies list

## 💡 Tips

- ArXiv URLs can be: `https://arxiv.org/pdf/XXXX.XXXXX.pdf`
- Max characters for extraction: 100,000 (Gemini context limit)
- API timeout: 60 seconds
- Best for papers < 50 pages (faster processing)

---

**Ready to summarize?** → `npm run dev` → http://localhost:3000

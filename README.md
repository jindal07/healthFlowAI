# 🩺 AI Health Report Reviewer

An intelligent, privacy-conscious web application that allows users to upload health reports in **PDF format**, which are:

1. Converted to clean **Markdown** text
2. Analyzed using **Google Gemini API**
3. Explained in an easy-to-understand, actionable report

> ⚡ Built with **Node.js (Express)** + **React (Vite)**  
> 🎨 Styled for **premium Apple-level aesthetics**, with smooth animations and responsive design  
> 🔐 Processes everything **in-memory** – no file storage required

---

## 📸 Features

- 📄 **Upload any health report** in `.pdf` format
- 🧠 **AI-powered interpretation** of health metrics and medical terms
- 🔍 **Highlighting of important indicators**: normal/abnormal values, red flags
- 📝 **Lifestyle suggestions** for improving or maintaining health
- 💎 **Modern UI/UX** inspired by Apple: glassmorphism, smooth transitions, responsive layout

---

## 🗂 Project Structure

```
ai-health-reviewer/
├── client/                  # Vite + React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── FileUpload.jsx
│   │   │   └── ResultDisplay.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── postcss.config.js
│
├── server/                  # Node.js backend
│   ├── routes/
│   │   └── analyze.js
│   ├── utils/
│   │   ├── pdfToMarkdown.js
│   │   └── geminiPrompt.js
│   ├── app.js
│   └── package.json
│
├── .env                     # Gemini API key
└── README.md
```

---

## ⚙️ Setup Instructions

### 📥 Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Google Gemini API key

### 🔑 Get Your Gemini API Key
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Copy the key for the next step

### 🧠 Backend Setup (`/server`)
```bash
cd server
npm install
```

#### ➕ Configure Environment Variables
Create a `.env` file in the root directory with:
```
GEMINI_API_KEY=your_actual_gemini_api_key_here
PORT=5000
```

#### ▶️ Start Backend
```bash
npm start
# or for development with auto-reload:
npm run dev
```

The server will start on `http://localhost:5000`

---

### 🌐 Frontend Setup (`/client`)
```bash
cd client
npm install
```

#### ▶️ Start Frontend
```bash
npm run dev
```

The client will start on `http://localhost:3000` and automatically open in your browser.

---

## 🚀 Running the Full Application

1. **Start the backend server:**
   ```bash
   cd server
   npm start
   ```

2. **In a new terminal, start the frontend:**
   ```bash
   cd client
   npm run dev
   ```

3. **Open your browser** to `http://localhost:3000`

4. **Upload a PDF health report** and get instant AI analysis!

---

## ✨ UI/UX Guidelines

> The frontend is designed to feel clean, minimalist, and sophisticated.

### UI Aesthetics
- 🧊 Glassmorphism: frosted backgrounds with blur
- 🌈 Gradient overlays for dynamic feeling
- 🎬 Smooth page and component animations using `Framer Motion`
- 🌙 Support for dark/light modes
- 📱 Fully responsive (mobile, tablet, desktop)

### UI Components
- 📤 **File Upload UI**: Drag and drop area, animated loading state
- 📊 **Analysis Display**: Markdown-like rendering, cards for sections like:
  - Summary
  - Key Indicators
  - Recommendations

### Technology Stack
- **Frontend:** React 18, Vite, Tailwind CSS, Framer Motion
- **Backend:** Node.js, Express, Multer, PDF-Parse
- **AI:** Google Gemini API
- **Styling:** Tailwind CSS with custom glassmorphism effects

---

## 🧠 AI Analysis Features

The Gemini AI provides:
- **Summary**: Overall health status overview
- **Key Findings**: Important test results and values
- **Health Indicators**: Color-coded normal/abnormal values
- **Recommendations**: Actionable lifestyle and dietary advice
- **Next Steps**: Follow-up guidance and timelines

---

## 🛡️ Privacy & Security

- ✅ **No data storage** - Everything processed in memory
- ✅ **Secure API calls** - Direct communication with Gemini API
- ✅ **Client-side processing** - Files never stored on server
- ✅ **HTTPS ready** - Built for secure deployment

---

## 🎯 Usage Tips

1. **Best PDF formats**: Clear, text-based health reports work best
2. **File size**: Keep under 10MB for optimal performance
3. **Language**: Currently optimized for English reports
4. **Internet**: Requires active connection for AI analysis

---

## 🔧 Troubleshooting

### Common Issues:

**Backend won't start:**
- Check if `.env` file exists with valid `GEMINI_API_KEY`
- Ensure Node.js v18+ is installed
- Verify port 5000 is available

**Frontend connection error:**
- Ensure backend is running on port 5000
- Check for CORS issues in browser console

**PDF upload fails:**
- Verify file is valid PDF format
- Check file size is under 10MB
- Ensure PDF contains readable text (not just images)

**AI analysis fails:**
- Verify Gemini API key is valid and has quota
- Check internet connection
- Try with a smaller/simpler PDF

---

## 🚀 Future Enhancements (Optional)
- User login for history
- Chat-based follow-up Q&A with AI
- Multilingual support
- OCR for scanned image PDFs
- Export to different formats
- Health trends tracking

---

## 📦 Deployment

### Backend Deployment (Railway/Render/Vercel)
1. Set environment variables in your platform
2. Deploy the `/server` directory
3. Update CORS settings for your domain

### Frontend Deployment (Vercel/Netlify)
1. Build the project: `npm run build`
2. Deploy the `/client/dist` directory
3. Update API endpoint in production

---

## 💡 License
MIT License. Built with ❤️ for better health insights.

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📞 Support

If you encounter any issues or have questions:
1. Check the troubleshooting section above
2. Review the console logs for error messages
3. Ensure all dependencies are installed correctly
4. Verify your Gemini API key is working

**Enjoy analyzing your health reports with AI! 🩺✨**
# healthFlowAI

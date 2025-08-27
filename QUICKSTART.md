# 🚀 Quick Start Guide

Run OpenCode locally in **30 seconds**!

## Prerequisites
- Python 3 (comes pre-installed on Mac/Linux)
- A modern web browser

## Setup Steps

### 1️⃣ Clone the repository
```bash
git clone https://github.com/yourusername/OpenCode.git
cd OpenCode
```

### 2️⃣ Start the server
```bash
python3 -m http.server 8000
```

### 3️⃣ Open your browser
Navigate to: http://localhost:8000

**That's it! You're done!** 🎉

## How to Use

### As an Interviewer:
1. Click **"I'm an Interviewer"**
2. Login with:
   - Email: `admin@opencode.com`
   - Password: `admin123`
3. Click **"Create New Session"**
4. Share the 6-digit code with candidates

### As a Candidate:
1. Click **"I'm a Candidate"**
2. Enter your name
3. Enter the 6-digit session code
4. Click **"Join Session"**

## Features Available
- ✅ Real-time collaborative coding
- ✅ 16 programming languages
- ✅ Live code execution
- ✅ Multiple themes
- ✅ User presence indicators
- ✅ Syntax highlighting

## Troubleshooting

### Port 8000 is already in use?
Use a different port:
```bash
python3 -m http.server 8080
```
Then open: http://localhost:8080

### No Python 3?
Use Python 2:
```bash
python -m SimpleHTTPServer 8000
```

Or use Node.js:
```bash
npx http-server -p 8000
```

## Alternative: One-Line Setup
```bash
curl -s https://raw.githubusercontent.com/yourusername/OpenCode/main/setup.sh | bash
```

## Need Help?
- Check the [full documentation](README.md)
- Report issues on [GitHub](https://github.com/yourusername/OpenCode/issues)
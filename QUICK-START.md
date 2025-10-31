# 🚀 Quick Start Guide

## Simple Steps to Run Your Image Compressor

### Step 1: Download the Code

If you haven't already, pull the latest code:

```bash
git pull origin claude/image-compressor-planning-011CUejhszCvrQqY6xqhn2Vp
```

---

### Step 2: Install Dependencies

**Open Terminal/Command Prompt in the project folder.**

**Install Backend:**
```bash
cd backend
npm install
cd ..
```

**Install Frontend:**
```bash
cd frontend
npm install
cd ..
```

---

### Step 3: Verify .env File Exists

**Check if `backend/.env` file exists:**

```bash
# On Windows Command Prompt:
type backend\.env

# On Windows PowerShell:
cat backend/.env

# On Linux/Mac:
cat backend/.env
```

**If it doesn't exist, create it:**

```bash
# Copy the example file
copy backend\.env.example backend\.env   # Windows CMD
cp backend/.env.example backend/.env      # Windows PowerShell / Linux / Mac
```

**Or manually create `backend/.env` with this content:**

```
PORT=5000
NODE_ENV=development
MAX_FILE_SIZE=10485760
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/jpg,image/webp
FRONTEND_URL=http://localhost:3000
```

---

### Step 4: Start the Backend

**Open a NEW terminal/command prompt window:**

```bash
cd backend
npm run dev
```

**Expected output:**
```
🚀 Server running on http://localhost:5000
📁 Environment: development
📦 Max file size: 10485760 bytes
```

✅ **If you see this, leave this terminal window OPEN and running!**

⚠️ **If you see the warning:**
```
⚠️  Warning: .env file may not be loaded. Using default values.
```

**Don't worry!** The app will still work with default values. But ideally, create the `.env` file as shown in Step 3.

---

### Step 5: Start the Frontend

**Open ANOTHER NEW terminal/command prompt window:**

```bash
cd frontend
npm run dev
```

**Expected output:**
```
VITE v5.4.21  ready in XXX ms
➜  Local:   http://localhost:3000/
```

✅ **If you see this, leave this terminal window OPEN and running too!**

---

### Step 6: Open in Browser

**Open your web browser and go to:**

```
http://localhost:3000
```

You should see the Image Compressor interface! 🎉

---

## 🧪 Quick Test

1. **Find an image** on your computer (.jpg, .png, or .webp)
2. **Drag and drop** it onto the upload area
3. **Move the quality slider** (try 80%)
4. **Click "Compress Image"**
5. **Wait 1-2 seconds**
6. **See the results** - before/after comparison, file sizes, etc.
7. **Click "Download"** to save your compressed image

---

## 🐛 Troubleshooting

### Problem: "Port 5000 is already in use"

**Solution:**
```bash
# Find what's using port 5000
netstat -ano | findstr :5000    # Windows
lsof -ti:5000                   # Linux/Mac

# Kill that process or change the port in backend/.env
PORT=5001
```

### Problem: "Port 3000 is already in use"

**Solution:**
```bash
# Kill the process or change port in frontend/vite.config.js
# Edit the file and change: port: 3000 to port: 3001
```

### Problem: Backend crashes with "Cannot read properties of undefined"

**Solution:**

✅ **This has been FIXED!** Pull the latest code:
```bash
git pull origin claude/image-compressor-planning-011CUejhszCvrQqY6xqhn2Vp
```

The app now uses default values even if .env file isn't loaded.

### Problem: "Failed to compress image" error in browser

**Solutions:**

1. **Check backend is running** - Look at the backend terminal window
2. **Check browser console** - Press F12, look for errors
3. **Restart both servers** - Close both terminals (Ctrl+C) and restart
4. **Clear browser cache** - Press Ctrl+Shift+R

---

## 📁 Where Are My Files?

**Backend code:** `backend/`
- Server: `backend/server.js`
- API routes: `backend/src/routes/`
- Image processing: `backend/src/utils/imageCompressor.js`

**Frontend code:** `frontend/`
- Main app: `frontend/src/App.jsx`
- Components: `frontend/src/components/`
- API calls: `frontend/src/services/api.js`

**Documentation:**
- `README.md` - Complete overview
- `TESTING.md` - Detailed troubleshooting
- `MVP-PLAN.md` - Development plan
- `QUICK-START.md` - This file!

---

## ⚡ One-Command Start (Optional)

**On Linux/Mac:**
```bash
./start.sh
```

**On Windows:**
You'll need to start both servers separately (Steps 4 & 5 above).

---

## 🎯 Success Checklist

- [ ] Node.js installed (v18+)
- [ ] Dependencies installed (`npm install` in both folders)
- [ ] `.env` file exists in backend folder
- [ ] Backend running on http://localhost:5000
- [ ] Frontend running on http://localhost:3000
- [ ] Browser shows the app interface
- [ ] Can upload an image
- [ ] Can compress an image
- [ ] Can download compressed image

---

## 📞 Need More Help?

Check these files:
- **TESTING.md** - Comprehensive troubleshooting guide
- **MVP-PLAN.md** - Complete feature list and testing plan
- **README.md** - Full documentation

---

## ✨ You're Done!

Your image compressor is now running on localhost! 🎉

Try compressing some images and see the results!

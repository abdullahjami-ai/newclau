# 🧪 Testing & Troubleshooting Guide

## Quick Test Checklist

### ✅ Step 1: Verify Both Servers Are Running

**Backend (Terminal 1):**
```bash
cd /home/user/newclau/backend
npm run dev
```

Expected output:
```
🚀 Server running on http://localhost:5000
📁 Environment: development
```

**Frontend (Terminal 2):**
```bash
cd /home/user/newclau/frontend
npm run dev
```

Expected output:
```
VITE v5.4.21  ready in XXX ms
➜  Local:   http://localhost:3000/
```

---

### ✅ Step 2: Test Backend API

Open a third terminal and run:

```bash
curl http://localhost:5000/api/health
```

Expected response:
```json
{"status":"OK","message":"Image Compressor API is running","timestamp":"2025-10-31T..."}
```

✅ If you see this, the backend is working!

---

### ✅ Step 3: Open Frontend in Browser

1. Go to: http://localhost:3000
2. You should see the Image Compressor UI
3. Open browser DevTools (F12) → Console tab
4. Look for any errors

---

### ✅ Step 4: Test Image Upload

1. **Find a test image** (any .jpg, .png, or .webp file under 10MB)
2. **Drag and drop** it onto the upload area
3. **Check for errors** in the browser console

If successful, you should see:
- File name displayed
- Quality slider enabled
- "Compress Image" button enabled

---

### ✅ Step 5: Test Compression

1. **Adjust quality slider** (try 80%)
2. **Click "Compress Image"**
3. **Wait 1-2 seconds**
4. **Check results**

Expected result:
- Loading spinner appears
- Compression completes
- Statistics displayed (original size, compressed size, reduction %)
- Before/after images shown
- "Download" button appears

---

## 🐛 Common Issues & Solutions

### Issue 1: "Failed to compress image" Error

**Possible Causes:**
- Backend not running
- CORS issues
- Network connectivity

**Solutions:**

1. **Check backend is running:**
   ```bash
   curl http://localhost:5000/api/health
   ```

2. **Check browser console** (F12 → Console):
   - Look for CORS errors
   - Look for network errors
   - Look for 404 or 500 errors

3. **Restart both servers:**
   ```bash
   # Stop with Ctrl+C in both terminals
   # Then restart:
   cd /home/user/newclau/backend && npm run dev
   cd /home/user/newclau/frontend && npm run dev
   ```

4. **Clear browser cache:**
   - Press Ctrl+Shift+R to hard refresh
   - Or clear cache in DevTools → Network → Disable cache

---

### Issue 2: CORS Error in Browser Console

**Error message:**
```
Access to XMLHttpRequest at 'http://localhost:5000/api/...' from origin 'http://localhost:3000' has been blocked by CORS policy
```

**Solution:**

1. **Check backend .env file:**
   ```bash
   cat /home/user/newclau/backend/.env
   ```

   Should contain:
   ```
   FRONTEND_URL=http://localhost:3000
   ```

2. **Restart backend** after any .env changes

---

### Issue 3: File Upload Not Working

**Symptoms:**
- Can't drag and drop
- Click doesn't open file dialog
- File uploads but nothing happens

**Solutions:**

1. **Check file type:**
   - Must be .jpg, .jpeg, .png, or .webp
   - No other formats supported in Phase 1

2. **Check file size:**
   - Must be under 10MB
   - Larger files will be rejected

3. **Check browser console** for validation errors

---

### Issue 4: Backend Server Won't Start

**Error:**
```
Error: listen EADDRINUSE: address already in use :::5000
```

**Solution:**

Port 5000 is already in use. Find and kill the process:

```bash
# Find process using port 5000
lsof -ti:5000

# Kill it
kill -9 $(lsof -ti:5000)

# Or use a different port
# Edit backend/.env and change PORT=5000 to PORT=5001
```

---

### Issue 5: Frontend Server Won't Start

**Error:**
```
Port 3000 is in use
```

**Solution:**

```bash
# Find process using port 3000
lsof -ti:3000

# Kill it
kill -9 $(lsof -ti:3000)

# Or use a different port
# Edit frontend/vite.config.js and change port: 3000 to port: 3001
```

---

### Issue 6: "Network Error" in Console

**Symptoms:**
- Red error in browser console
- "Network Error" message
- Compression fails immediately

**Solutions:**

1. **Check backend is running:**
   ```bash
   curl http://localhost:5000/api/health
   ```

2. **Check firewall settings** (if applicable)

3. **Try direct API call:**
   ```bash
   curl -X POST http://localhost:5000/api/compress/upload \
     -F "image=@/path/to/test.jpg" \
     -F "quality=80" \
     --output compressed.jpg
   ```

---

### Issue 7: Compression Works but Download Fails

**Symptoms:**
- Compression completes
- Statistics show
- Download button doesn't work or downloads corrupt file

**Solution:**

1. **Check browser console** for errors
2. **Try right-click → Save Image As** on the compressed preview
3. **Clear browser cache** and try again

---

## 🧪 Manual API Testing

### Test with cURL

```bash
# Test health endpoint
curl http://localhost:5000/api/health

# Test compression (requires a real image file)
curl -X POST http://localhost:5000/api/compress/upload \
  -F "image=@/path/to/your/image.jpg" \
  -F "quality=80" \
  --output compressed.jpg \
  -v

# Check response headers
curl -X POST http://localhost:5000/api/compress/upload \
  -F "image=@/path/to/your/image.jpg" \
  -F "quality=80" \
  -I
```

---

## 📊 Debugging Checklist

When reporting issues, check these:

- [ ] Backend running? (`curl http://localhost:5000/api/health`)
- [ ] Frontend running? (Open http://localhost:3000)
- [ ] Browser console errors? (F12 → Console)
- [ ] Network tab errors? (F12 → Network → Check failed requests)
- [ ] Backend terminal errors? (Check Terminal 1)
- [ ] Frontend terminal errors? (Check Terminal 2)
- [ ] File type correct? (.jpg, .png, .webp only)
- [ ] File size under 10MB?
- [ ] Ports 3000 and 5000 not blocked?

---

## 🔍 Backend Logs

The backend logs requests. Check Terminal 1 for:

```
POST /api/compress/upload
Status: 200 OK
```

Or errors:
```
Error: Invalid file type
Status: 400 Bad Request
```

---

## 🌐 Browser DevTools Guide

### Open DevTools:
- Chrome/Edge: F12 or Ctrl+Shift+I
- Firefox: F12
- Safari: Cmd+Option+I

### Check Console Tab:
- Red errors = JavaScript errors
- Yellow warnings = Non-critical issues
- Blue info = Debug info

### Check Network Tab:
1. Open Network tab
2. Click "Compress Image"
3. Look for request to `/api/compress/upload`
4. Check:
   - Status code (should be 200)
   - Response headers
   - Response preview

### Common Network Errors:
- **404** = Endpoint not found (check URL)
- **500** = Server error (check backend logs)
- **CORS** = Cross-origin issue (check CORS config)
- **Failed** = Network connectivity issue

---

## ✅ Success Indicators

You know it's working when:

1. ✅ Backend shows: `🚀 Server running on http://localhost:5000`
2. ✅ Frontend shows: `➜  Local:   http://localhost:3000/`
3. ✅ Health check returns JSON: `{"status":"OK",...}`
4. ✅ UI loads in browser without console errors
5. ✅ Image uploads successfully
6. ✅ Compression completes in 1-2 seconds
7. ✅ Statistics display correctly
8. ✅ Download works

---

## 🔧 Complete Reset (If All Else Fails)

```bash
# 1. Stop all servers (Ctrl+C)

# 2. Kill any hanging processes
kill -9 $(lsof -ti:3000) 2>/dev/null
kill -9 $(lsof -ti:5000) 2>/dev/null

# 3. Reinstall dependencies
cd /home/user/newclau/backend
rm -rf node_modules package-lock.json
npm install

cd /home/user/newclau/frontend
rm -rf node_modules package-lock.json
npm install

# 4. Restart servers
# Terminal 1:
cd /home/user/newclau/backend
npm run dev

# Terminal 2:
cd /home/user/newclau/frontend
npm run dev

# 5. Clear browser cache (Ctrl+Shift+R)

# 6. Try again!
```

---

## 📞 Getting Help

If you're still stuck, provide:

1. **Backend terminal output** (full logs)
2. **Frontend terminal output** (full logs)
3. **Browser console errors** (screenshot or copy text)
4. **Network tab errors** (screenshot of failed request)
5. **Steps to reproduce** (what you clicked)
6. **File details** (type, size of image being uploaded)

---

## 🎯 Quick Verification Script

Save this as `test-app.sh`:

```bash
#!/bin/bash

echo "🧪 Testing Image Compressor Application..."
echo ""

# Test 1: Backend Health
echo "Test 1: Backend Health Check"
HEALTH=$(curl -s http://localhost:5000/api/health)
if [[ $HEALTH == *"OK"* ]]; then
    echo "✅ Backend is healthy"
else
    echo "❌ Backend is not responding"
    exit 1
fi
echo ""

# Test 2: Frontend
echo "Test 2: Frontend Check"
FRONTEND=$(curl -s http://localhost:3000)
if [[ $FRONTEND == *"root"* ]]; then
    echo "✅ Frontend is serving"
else
    echo "❌ Frontend is not responding"
    exit 1
fi
echo ""

echo "🎉 All tests passed!"
echo "Open http://localhost:3000 in your browser"
```

Run it:
```bash
chmod +x test-app.sh
./test-app.sh
```

---

This guide covers 99% of common issues. If you're still having problems, the issue is likely environment-specific.

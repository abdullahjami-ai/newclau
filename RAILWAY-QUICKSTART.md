# 🚀 Railway Quick Start (5 Minutes!)

Since you've already connected your GitHub to Railway, here's the fastest way to get deployed:

---

## 📦 Step 1: Deploy Backend (2 minutes)

1. **Go to Railway Dashboard:** https://railway.app/dashboard
2. **Click "New Project"** → **"Deploy from GitHub repo"**
3. **Select** your `newclau` repository
4. **Once created, click on the service**
5. **Go to Settings → General:**
   - Set **Root Directory:** `backend`
   - Click **Save**
6. **Go to Variables tab:**
   - Click **"New Variable"**
   - Add these:
     ```
     NODE_ENV=production
     MAX_FILE_SIZE=10485760
     ALLOWED_FILE_TYPES=image/jpeg,image/png,image/jpg,image/webp
     FRONTEND_URL=https://TEMP-WILL-UPDATE-LATER.com
     ```
7. **Go to Settings → Networking:**
   - Click **"Generate Domain"**
   - **Copy your backend URL** (e.g., `https://backend-production-abc123.up.railway.app`)

✅ **Test:** Open `https://your-backend-url.railway.app/api/health` in browser
- Should show: `{"status":"OK",...}`

---

## 🎨 Step 2: Deploy Frontend (2 minutes)

1. **In same Railway project, click "New Service"**
2. **Select "GitHub Repo"** → Choose `newclau` again
3. **Click on the new service**
4. **Go to Settings → General:**
   - Set **Root Directory:** `frontend`
   - Click **Save**
5. **Go to Variables tab:**
   - Click **"New Variable"**
   - Name: `VITE_API_URL`
   - Value: `https://YOUR-BACKEND-URL.railway.app/api`
     - ⚠️ **Replace with YOUR backend URL from Step 1!**
6. **Go to Settings → Networking:**
   - Click **"Generate Domain"**
   - **Copy your frontend URL** (e.g., `https://frontend-production-xyz789.up.railway.app`)

---

## 🔗 Step 3: Connect Them (1 minute)

1. **Go back to Backend service**
2. **Click Variables tab**
3. **Update** `FRONTEND_URL` variable:
   - Change from: `https://TEMP-WILL-UPDATE-LATER.com`
   - To: `https://YOUR-FRONTEND-URL.railway.app`
   - ⚠️ **Use exact URL from Step 2, no trailing slash!**
4. **Backend will auto-redeploy** (wait ~1 minute)

---

## ✅ Step 4: Test It!

1. **Open your frontend URL** in browser
2. **Upload an image**
3. **Compress it**
4. **Download the result**

### If it works: 🎉 **YOU'RE LIVE!**

---

## 🐛 If Something's Wrong:

### CORS Error in Console?
- Make sure `FRONTEND_URL` in backend **exactly matches** your frontend URL
- No trailing slash!
- Redeploy backend after changing

### Can't Compress Images?
- Check `VITE_API_URL` in frontend variables
- Make sure it ends with `/api`
- Example: `https://backend-production-abc.up.railway.app/api`

### View Logs:
- Railway Dashboard → Click on service → **"Logs"** tab
- See real-time errors and requests

---

## 📝 Your URLs (Fill This In!)

After deployment, write them down:

**Backend URL:** `_________________________________`

**Frontend URL:** `_________________________________`

**API Health Check:** `_________________________________/api/health`

---

## 💡 Pro Tips:

1. **Automatic Deploys:**
   - Every git push automatically redeploys!
   - Just commit + push changes

2. **Monitor Usage:**
   - Railway Dashboard → **"Usage"** tab
   - Free tier: $5/month credit

3. **Custom Domain:**
   - See `RAILWAY-DEPLOYMENT.md` for details
   - Can add your own domain like `compressor.com`

---

## 📚 Full Guide

For detailed troubleshooting, costs, and advanced features, see:
- **`RAILWAY-DEPLOYMENT.md`** - Complete deployment guide

---

## 🆘 Quick Checklist

Before asking for help, verify:

- [ ] Backend root directory is `backend`
- [ ] Frontend root directory is `frontend`
- [ ] Both services have generated domains
- [ ] `VITE_API_URL` in frontend points to backend URL
- [ ] `FRONTEND_URL` in backend points to frontend URL
- [ ] Backend health check returns 200 OK
- [ ] Checked logs for errors

---

**Total Time:** ~5 minutes ⏱️

**Cost:** ~$2-4/month on Railway 💰

**Auto-deploys:** YES ✅

**Ready to scale:** YES 🚀

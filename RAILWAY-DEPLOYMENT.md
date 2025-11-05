# 🚂 Railway Deployment Guide

Complete step-by-step guide to deploy your Image Compressor to Railway.

---

## 📋 Prerequisites

✅ **What you need:**
- GitHub account connected to Railway
- GitHub repository pushed with all code
- Railway account (free tier works!)
- This repository connected to Railway

---

## 🎯 Overview

We'll deploy **TWO separate services** on Railway:

1. **Backend Service** - Node.js/Express API (port 5000 locally → Railway assigns port)
2. **Frontend Service** - React/Vite app (port 3000 locally → Railway assigns port)

**Why two services?** Railway works best with separate services for frontend and backend. This also makes scaling easier later!

---

## 🚀 Step 1: Deploy Backend Service

### 1.1 Create New Project (if needed)

1. Go to [Railway Dashboard](https://railway.app/dashboard)
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Choose your `newclau` repository
5. Name your project: `image-compressor`

### 1.2 Configure Backend Service

1. Railway will auto-detect the repository
2. Click **"Add Service"** → **"GitHub Repo"**
3. Select your repository
4. **Important:** Set the **Root Directory** to `/backend`
   - Click on the service
   - Go to **Settings** → **General**
   - Find **Root Directory**
   - Enter: `backend`
   - Click **Save**

### 1.3 Set Environment Variables

1. In your backend service, click **"Variables"** tab
2. Add these environment variables:

```env
NODE_ENV=production
MAX_FILE_SIZE=10485760
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/jpg,image/webp
FRONTEND_URL=https://your-frontend-url.railway.app
```

**⚠️ Important:** We'll update `FRONTEND_URL` after deploying the frontend!

### 1.4 Deploy Backend

1. Railway will automatically start building
2. Wait for deployment to complete (2-3 minutes)
3. You'll see a **green checkmark** when ready
4. Click **"Settings"** → **"Networking"**
5. Click **"Generate Domain"**
6. Copy your backend URL (e.g., `https://backend-production-xxxx.up.railway.app`)

**✅ Test your backend:**
```bash
# Replace with YOUR backend URL
curl https://your-backend-url.railway.app/api/health

# Should return:
# {"status":"OK","timestamp":"...","environment":"production"}
```

---

## 🎨 Step 2: Deploy Frontend Service

### 2.1 Add Frontend Service to Same Project

1. In your `image-compressor` project on Railway
2. Click **"New Service"** → **"GitHub Repo"**
3. Select your repository again
4. **Important:** Set the **Root Directory** to `/frontend`
   - Click on the new service
   - Go to **Settings** → **General**
   - Find **Root Directory**
   - Enter: `frontend`
   - Click **Save**

### 2.2 Set Environment Variables

1. In your frontend service, click **"Variables"** tab
2. Add this environment variable:

```env
VITE_API_URL=https://your-backend-url.railway.app/api
```

**⚠️ Replace** `your-backend-url.railway.app` with the URL you copied from Step 1.4!

### 2.3 Deploy Frontend

1. Railway will automatically start building
2. Wait for deployment to complete (2-4 minutes)
3. Vite will build the production bundle
4. You'll see a **green checkmark** when ready
5. Click **"Settings"** → **"Networking"**
6. Click **"Generate Domain"**
7. Copy your frontend URL (e.g., `https://frontend-production-xxxx.up.railway.app`)

---

## 🔗 Step 3: Connect Frontend and Backend

### 3.1 Update Backend CORS

1. Go back to your **backend service**
2. Click **"Variables"** tab
3. Update `FRONTEND_URL` variable:
```env
FRONTEND_URL=https://your-frontend-url.railway.app
```
4. The service will **automatically redeploy**

### 3.2 Update Frontend API URL (if needed)

Your frontend's `.env` file should already have been updated, but verify:

**Create/Update:** `frontend/.env.production`
```env
VITE_API_URL=https://your-backend-url.railway.app/api
```

---

## ✅ Step 4: Test Your Deployment

1. **Open your frontend URL** in a browser
2. **Upload an image**
3. **Adjust quality slider**
4. **Click "Compress Image"**
5. **Download the result**

**If everything works:** 🎉 **YOU'RE LIVE!**

---

## 🐛 Troubleshooting

### Issue 1: CORS Errors

**Symptom:** Console shows "CORS policy blocked" errors

**Fix:**
1. Verify `FRONTEND_URL` in backend variables matches your **exact** frontend URL
2. Make sure there's no trailing slash
3. Redeploy backend service

### Issue 2: API Connection Failed

**Symptom:** "Failed to compress image. Please check your connection"

**Fix:**
1. Check backend health: `curl https://your-backend-url.railway.app/api/health`
2. Verify `VITE_API_URL` in frontend variables is correct
3. Check backend logs for errors:
   - Railway Dashboard → Backend Service → **"Logs"** tab

### Issue 3: 500 Internal Server Error

**Symptom:** Compression fails with 500 error

**Fix:**
1. Check backend logs in Railway
2. Verify all environment variables are set correctly
3. Make sure `MAX_FILE_SIZE` and `ALLOWED_FILE_TYPES` are set

### Issue 4: Build Failed

**Symptom:** Red X mark, deployment failed

**Backend Build Failure:**
- Check that `backend` is set as root directory
- Verify `package.json` has all dependencies
- Check build logs for specific error

**Frontend Build Failure:**
- Check that `frontend` is set as root directory
- Verify `package.json` has all dependencies
- Make sure `VITE_API_URL` is set BEFORE build

### Issue 5: Environment Variables Not Working

**Fix:**
1. Go to service → **Variables** tab
2. Verify all variables are present
3. Click **"Redeploy"** after adding/changing variables
4. Wait for deployment to complete

---

## 📊 Railway Dashboard Guide

### Monitoring Your App

**Backend Service:**
- **Metrics:** CPU, Memory, Network usage
- **Logs:** Real-time backend logs
- **Deployments:** History of all deployments

**Frontend Service:**
- **Metrics:** Traffic, load times
- **Logs:** Build logs and preview logs
- **Deployments:** Build history

### Viewing Logs

1. Click on your service
2. Go to **"Logs"** tab
3. See real-time logs
4. Filter by severity: All, Info, Warning, Error

**Useful for debugging:**
- Backend compression requests
- API errors
- File upload issues

---

## 💰 Costs & Usage

### Free Tier Limits

Railway's free tier includes:
- **$5 credit per month**
- **500 hours of usage**
- Perfect for testing and small projects!

### Estimated Costs

**For this Image Compressor:**
- **Backend:** ~$1-3/month (light usage)
- **Frontend:** ~$0.50-1/month (static hosting)
- **Total:** ~$1.50-4/month for moderate traffic

**Tips to save costs:**
1. Use Railway's sleep mode for inactive services
2. Monitor usage in Dashboard → **"Usage"** tab
3. Optimize images before upload (ironically!)

---

## 🔄 Updating Your Deployment

### Method 1: Git Push (Automatic)

Railway watches your GitHub repository!

1. Make changes locally
2. Commit changes: `git add . && git commit -m "Update feature"`
3. Push to GitHub: `git push`
4. Railway **automatically detects** and redeploys!

### Method 2: Manual Redeploy

1. Railway Dashboard → Your Service
2. Click **"Deployments"** tab
3. Click **"Redeploy"** on latest deployment

---

## 🌐 Custom Domain (Optional)

Want to use your own domain like `imagecompressor.com`?

### For Frontend:

1. Buy a domain (Namecheap, Google Domains, etc.)
2. Railway Dashboard → Frontend Service → **"Settings"** → **"Domains"**
3. Click **"Add Custom Domain"**
4. Enter your domain: `imagecompressor.com`
5. Add DNS records at your domain registrar:
   - **Type:** CNAME
   - **Name:** @ or www
   - **Value:** Your Railway domain

### For Backend:

1. Railway Dashboard → Backend Service → **"Settings"** → **"Domains"**
2. Add subdomain: `api.imagecompressor.com`
3. Add DNS records:
   - **Type:** CNAME
   - **Name:** api
   - **Value:** Your Railway backend domain
4. Update frontend `VITE_API_URL` to use new domain

---

## 📝 Environment Variables Reference

### Backend (.env)

```env
# Server Configuration
NODE_ENV=production
PORT=5000                    # Railway overrides this

# File Upload Limits
MAX_FILE_SIZE=10485760       # 10MB in bytes
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/jpg,image/webp

# CORS Configuration
FRONTEND_URL=https://your-frontend-url.railway.app
```

### Frontend (.env.production)

```env
# API Configuration
VITE_API_URL=https://your-backend-url.railway.app/api
```

---

## 🎯 Quick Checklist

Before going live, verify:

### Backend Service ✅
- [ ] Root directory set to `backend`
- [ ] `NODE_ENV=production` set
- [ ] `FRONTEND_URL` points to frontend Railway URL
- [ ] `MAX_FILE_SIZE` and `ALLOWED_FILE_TYPES` set
- [ ] Domain generated and accessible
- [ ] Health check returns 200: `/api/health`

### Frontend Service ✅
- [ ] Root directory set to `frontend`
- [ ] `VITE_API_URL` points to backend Railway URL
- [ ] Domain generated and accessible
- [ ] Can load app in browser
- [ ] No console errors

### Testing ✅
- [ ] Can upload image
- [ ] Can compress with different qualities
- [ ] Can change output format
- [ ] Can download compressed image
- [ ] Lossless mode works
- [ ] Presets work correctly

---

## 🆘 Getting Help

### Railway Resources:
- [Railway Docs](https://docs.railway.app/)
- [Railway Discord](https://discord.gg/railway)
- [Railway Status](https://status.railway.app/)

### Common Issues:
- Check Railway logs first
- Verify environment variables
- Test backend health endpoint
- Check browser console for frontend errors

---

## 🎉 You're Done!

Your Image Compressor is now live on Railway!

**Share your app:**
- Frontend: `https://your-frontend-url.railway.app`
- Backend API: `https://your-backend-url.railway.app/api`

**Next Steps:**
- Monitor usage in Railway Dashboard
- Set up custom domain
- Add more features from roadmap
- Share with friends and get feedback!

---

**Built with ❤️ using React, Express, Sharp, and Railway**

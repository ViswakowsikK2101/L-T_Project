# MongoDB Installation Guide for Windows

## Current Status
✅ Project is complete and ready
❌ MongoDB is NOT installed on your system

## Installation Options

You have 2 options:
1. **Local Installation** (Recommended for development)
2. **Cloud Database** (MongoDB Atlas - No installation needed)

---

## Option 1: Install MongoDB Locally (Recommended)

### Step 1: Download MongoDB Community Server

1. Open your browser and go to:
   ```
   https://www.mongodb.com/try/download/community
   ```

2. Select:
   - **Version:** 8.0.0 (Latest stable) or 7.0.x
   - **Platform:** Windows
   - **Package:** MSI

3. Click **Download**

### Step 2: Install MongoDB

1. **Run the downloaded MSI installer** (mongodb-windows-x86_64-8.0.0-signed.msi)

2. **Setup Type:** Choose "Complete"

3. **Service Configuration:**
   - ✅ Check "Install MongoD as a Service"
   - ✅ Check "Run service as Network Service user"
   - **Data Directory:** C:\Program Files\MongoDB\Server\8.0\data\
   - **Log Directory:** C:\Program Files\MongoDB\Server\8.0\log\

4. **MongoDB Compass:** 
   - ✅ Check "Install MongoDB Compass" (optional GUI tool)

5. Click **Install**

6. Wait for installation to complete (may take 5-10 minutes)

### Step 3: Verify Installation

Open a **NEW** terminal (Git Bash or Command Prompt) and run:

```bash
# Check MongoDB version
mongod --version

# Check if service is running
net start | findstr MongoDB

# Or check service status
sc query MongoDB
```

**Expected Output:**
```
db version v8.0.0
MongoDB Server (MongoDB)
```

### Step 4: Test Connection

```bash
# Connect to MongoDB shell
mongosh

# Or the older shell
mongo
```

**Expected Output:**
```
MongoDB shell version v8.0.0
connecting to: mongodb://127.0.0.1:27017
```

Type `exit` to exit the MongoDB shell.

### Step 5: Start Your Project

Now you can run:
```bash
cd C:\Users\viswa\job-portal-backend
npm run seed
npm run dev
```

---

## Option 2: Use MongoDB Atlas (Cloud Database)

### Advantages:
- ✅ No installation required
- ✅ Free tier available (512MB storage)
- ✅ Accessible from anywhere
- ✅ Automatic backups
- ✅ Works if local installation fails

### Setup Steps:

#### Step 1: Create Account
1. Go to: https://www.mongodb.com/cloud/atlas/register
2. Sign up with email or Google account
3. Verify your email

#### Step 2: Create Cluster
1. Click **"Build a Database"**
2. Select **"M0 Free"** tier
3. Choose a cloud provider (AWS recommended)
4. Choose region closest to you
5. Cluster Name: `job-portal-cluster`
6. Click **"Create Cluster"** (takes 3-5 minutes)

#### Step 3: Create Database User
1. Click **"Database Access"** in left sidebar
2. Click **"Add New Database User"**
3. Authentication Method: **Password**
4. Username: `jobportal_admin`
5. Password: Generate a secure password (copy it!)
6. Database User Privileges: **Read and write to any database**
7. Click **"Add User"**

#### Step 4: Whitelist IP Address
1. Click **"Network Access"** in left sidebar
2. Click **"Add IP Address"**
3. Click **"Allow Access from Anywhere"** (for development)
   - This adds `0.0.0.0/0` (all IPs)
4. Click **"Confirm"**

#### Step 5: Get Connection String
1. Click **"Database"** in left sidebar
2. Click **"Connect"** on your cluster
3. Select **"Connect your application"**
4. Driver: **Node.js**, Version: **5.5 or later**
5. Copy the connection string:
   ```
   mongodb+srv://jobportal_admin:<password>@job-portal-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

#### Step 6: Update Your Project

1. Open `.env` file in your project:
   ```bash
   cd C:\Users\viswa\job-portal-backend
   nano .env
   # or use any text editor
   ```

2. Replace the MONGODB_URI with your Atlas connection string:
   ```env
   PORT=5000
   MONGODB_URI=mongodb+srv://jobportal_admin:YOUR_PASSWORD_HERE@job-portal-cluster.xxxxx.mongodb.net/job_portal?retryWrites=true&w=majority
   JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_2026
   JWT_EXPIRES_IN=7d
   ```

   **Important:** Replace `<password>` with your actual password!

3. Add database name `job_portal` to the connection string (between `.net/` and `?`)

#### Step 7: Test Connection

```bash
npm run seed
```

**Expected Output:**
```
MongoDB connected: job-portal-cluster-shard-00-00.xxxxx.mongodb.net
🗑️  Clearing existing data...
👥 Creating users...
...
✅ Seed data created successfully!
```

---

## Comparison: Local vs Cloud

| Feature | Local (Community Server) | Cloud (Atlas) |
|---------|-------------------------|---------------|
| **Installation** | Requires download & install | No installation |
| **Speed** | Faster (local) | Depends on internet |
| **Internet Required** | No | Yes |
| **Storage** | Unlimited (disk space) | 512MB free tier |
| **Setup Time** | 10-15 minutes | 5-10 minutes |
| **Cost** | Free | Free tier available |
| **Best For** | Development, Testing | Production, Remote access |

---

## Troubleshooting

### Issue 1: MongoDB Service Won't Start
**Error:** "MongoDB service failed to start"

**Solution:**
1. Open Services (Win + R, type `services.msc`)
2. Find "MongoDB Server (MongoDB)"
3. Right-click → Properties
4. Startup type: **Automatic**
5. Click **Start**
6. If error persists, check Event Viewer for details

### Issue 2: Port 27017 Already in Use
**Error:** "Address already in use"

**Solution:**
```bash
# Find process using port 27017
netstat -ano | findstr :27017

# Kill the process (replace PID with actual number)
taskkill /PID <PID> /F

# Restart MongoDB service
net stop MongoDB
net start MongoDB
```

### Issue 3: MongoDB Compass Won't Connect
**Error:** "Network error"

**Solution:**
1. Check MongoDB service is running
2. Try connection string: `mongodb://localhost:27017`
3. Firewall might be blocking - temporarily disable to test

### Issue 4: "Access Denied" During Installation
**Error:** Permission issues

**Solution:**
1. Right-click installer → "Run as Administrator"
2. Ensure you have admin rights on Windows

### Issue 5: MongoDB Shell Not Found
**Error:** "mongosh: command not found"

**Solution:**
1. The new shell is separate from MongoDB server
2. Download from: https://www.mongodb.com/try/download/shell
3. Or use legacy `mongo` command if available
4. Add MongoDB bin folder to PATH:
   - Path: `C:\Program Files\MongoDB\Server\8.0\bin`

---

## Quick Start After Installation

Once MongoDB is installed and running:

```bash
# Navigate to project
cd C:\Users\viswa\job-portal-backend

# Verify .env is configured
cat .env

# Seed database
npm run seed

# Start server
npm run dev

# In another terminal, test API
curl http://localhost:5000/health
```

---

## Verification Checklist

After installation, verify:

- [ ] `mongod --version` shows version number
- [ ] MongoDB service is running (check services)
- [ ] Can connect with `mongosh` or `mongo`
- [ ] Project seed script runs successfully
- [ ] Server starts without errors
- [ ] Health check endpoint responds

---

## Which Option Should You Choose?

### Choose **Local Installation** if:
- ✅ You have admin rights on your computer
- ✅ You want faster database operations
- ✅ You'll be working offline
- ✅ You're comfortable with system installation

### Choose **MongoDB Atlas** if:
- ✅ You can't install software (no admin rights)
- ✅ You want zero setup time
- ✅ You'll be presenting from different machines
- ✅ You want your database accessible from anywhere

---

## Recommended: Local Installation

For your CIA-3 project, I recommend **local installation** because:
1. Faster performance for demonstrations
2. Works offline during presentation
3. No internet dependency
4. Full control over database
5. Industry-standard development practice

---

## Next Steps

1. **Choose your installation method** (Local or Cloud)
2. **Follow the steps** in the appropriate section above
3. **Verify installation** using the checklist
4. **Run the seed script:** `npm run seed`
5. **Start the server:** `npm run dev`
6. **Test the API** using the TESTING_GUIDE.md

---

## Need Help?

If you encounter issues:
1. Check the Troubleshooting section above
2. Review MongoDB installation logs
3. Check Windows Event Viewer for errors
4. Ensure you have admin rights
5. Try the cloud option (MongoDB Atlas) as backup

---

**Installation Time Estimates:**
- Local Installation: 10-15 minutes
- MongoDB Atlas Setup: 5-10 minutes
- Project Setup After DB: 2-3 minutes

**Total Time to Running Server: 15-20 minutes**

---

Good luck with the installation! Once MongoDB is running, your project will work perfectly. 🚀

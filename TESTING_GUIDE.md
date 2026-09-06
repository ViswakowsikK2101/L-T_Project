# Job Portal Backend - Testing Guide

## Prerequisites

### 1. Install MongoDB

**Windows:**
1. Download MongoDB Community Server from: https://www.mongodb.com/try/download/community
2. Run the installer (MSI file)
3. Choose "Complete" installation
4. Install as a Windows Service (check the box)
5. After installation, MongoDB should start automatically

**Alternative - MongoDB Atlas (Cloud):**
If you don't want to install locally, use MongoDB Atlas:
1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account
3. Create a free cluster
4. Get your connection string
5. Update `.env` with the Atlas connection string

**Verify MongoDB is Running:**
```bash
# Check if MongoDB service is running
net start | findstr MongoDB

# Or check the port
netstat -an | findstr 27017
```

### 2. Install Node.js
Ensure Node.js v18+ is installed:
```bash
node --version
npm --version
```

---

## Setup Instructions

### Step 1: Install Dependencies
```bash
cd /c/Users/viswa/job-portal-backend
npm install
```

### Step 2: Configure Environment
The `.env` file has already been created with:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/job_portal
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_2026
JWT_EXPIRES_IN=7d
```

**For MongoDB Atlas**, update `MONGODB_URI` to:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/job_portal?retryWrites=true&w=majority
```

### Step 3: Seed Database
```bash
npm run seed
```

**Expected Output:**
```
MongoDB connected: localhost
🗑️  Clearing existing data...
👥 Creating users...
🏢 Creating companies...
💼 Creating job postings...
📝 Creating candidate profiles...
📋 Creating applications...
🎤 Creating interviews...
⭐ Creating saved jobs...
🔔 Creating job alerts...
💰 Creating offers...
✅ Seed data created successfully!

📧 Login Credentials:
Admin: admin@jobportal.com / Admin123
Recruiter: recruiter1@techcorp.com / Recruiter123
Candidate: candidate1@email.com / Candidate123
```

### Step 4: Start Server
```bash
# Development mode with auto-reload
npm run dev

# Or production mode
npm start
```

**Expected Output:**
```
MongoDB connected: localhost
Server running in development mode on port 5000
```

---

## Testing with Postman

### Import Collection
1. Open Postman
2. Click "Import"
3. Select `postman/Job-Portal-API.postman_collection.json`
4. Create an environment with variable `baseUrl` = `http://localhost:5000`

### Test Credentials (from seed data)
- **Admin**: admin@jobportal.com / Admin123
- **Recruiter 1**: recruiter1@techcorp.com / Recruiter123
- **Recruiter 2**: recruiter2@startupinc.com / Recruiter123
- **Candidate 1**: candidate1@email.com / Candidate123
- **Candidate 2**: candidate2@email.com / Candidate123
- **Candidate 3**: candidate3@email.com / Candidate123

---

## End-to-End Testing Workflow

### 1. Authentication Tests

#### Test 1.1: Register New Candidate
```http
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "Test Candidate",
  "email": "testcandidate@email.com",
  "password": "Test123",
  "role": "candidate"
}
```

**Expected Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "_id": "...",
    "name": "Test Candidate",
    "email": "testcandidate@email.com",
    "role": "candidate",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Test 1.2: Login as Candidate
```http
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "candidate1@email.com",
  "password": "Candidate123"
}
```

**Save the token from response for subsequent requests!**

#### Test 1.3: Duplicate Registration (Should Fail)
```http
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "Duplicate",
  "email": "candidate1@email.com",
  "password": "Test123",
  "role": "candidate"
}
```

**Expected Response (409):**
```json
{
  "success": false,
  "message": "An account with this email already exists",
  "errorCode": "DUPLICATE_EMAIL"
}
```

#### Test 1.4: Invalid Login
```http
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "candidate1@email.com",
  "password": "WrongPassword"
}
```

**Expected Response (401):**
```json
{
  "success": false,
  "message": "Invalid email or password",
  "errorCode": "INVALID_CREDENTIALS"
}
```

---

### 2. Candidate Profile Tests

#### Test 2.1: Create Profile
```http
POST http://localhost:5000/api/candidates/profile
Authorization: Bearer <candidate_token>
Content-Type: application/json

{
  "skills": ["Node.js", "React", "MongoDB"],
  "experienceYears": 3,
  "resumeSummary": "Full-stack developer with 3 years of experience",
  "education": "B.Tech in Computer Science",
  "location": "Bangalore",
  "phone": "+91-9876543210"
}
```

#### Test 2.2: Get Own Profile
```http
GET http://localhost:5000/api/candidates/profile
Authorization: Bearer <candidate_token>
```

---

### 3. Job Posting Tests

#### Test 3.1: Get All Jobs (Public - No Auth Required)
```http
GET http://localhost:5000/api/jobs?page=1&limit=10
```

#### Test 3.2: Search Jobs
```http
GET http://localhost:5000/api/jobs?title=developer&location=Bangalore&experienceLevel=senior
```

#### Test 3.3: Create Job (Recruiter Only)
```http
POST http://localhost:5000/api/jobs
Authorization: Bearer <recruiter_token>
Content-Type: application/json

{
  "company": "<company_id>",
  "title": "Backend Developer",
  "description": "We are looking for an experienced backend developer...",
  "skills": ["Node.js", "Express", "MongoDB"],
  "location": "Bangalore",
  "salaryRange": {
    "min": 800000,
    "max": 1200000
  },
  "experienceLevel": "mid",
  "employmentType": "full-time",
  "status": "open"
}
```

#### Test 3.4: Candidate Cannot Create Job (Should Fail - 403)
```http
POST http://localhost:5000/api/jobs
Authorization: Bearer <candidate_token>
Content-Type: application/json

{
  "company": "...",
  "title": "Test"
}
```

**Expected Response (403):**
```json
{
  "success": false,
  "message": "Access denied. Required roles: recruiter",
  "errorCode": "FORBIDDEN"
}
```

---

### 4. Application Tests

#### Test 4.1: Apply for Job
```http
POST http://localhost:5000/api/applications
Authorization: Bearer <candidate_token>
Content-Type: application/json

{
  "job": "<job_id>",
  "coverLetter": "I am very interested in this position..."
}
```

#### Test 4.2: Duplicate Application (Should Fail - 409)
```http
POST http://localhost:5000/api/applications
Authorization: Bearer <candidate_token>
Content-Type: application/json

{
  "job": "<same_job_id>",
  "coverLetter": "Applying again..."
}
```

**Expected Response (409):**
```json
{
  "success": false,
  "message": "You have already applied to this job",
  "errorCode": "ALREADY_APPLIED"
}
```

#### Test 4.3: Apply to Closed Job (Should Fail - 400)
```http
POST http://localhost:5000/api/applications
Authorization: Bearer <candidate_token>
Content-Type: application/json

{
  "job": "<closed_job_id>"
}
```

**Expected Response (400):**
```json
{
  "success": false,
  "message": "This job is no longer accepting applications",
  "errorCode": "JOB_NOT_ACTIVE"
}
```

#### Test 4.4: Get Own Applications
```http
GET http://localhost:5000/api/applications
Authorization: Bearer <candidate_token>
```

---

### 5. Pipeline Workflow Tests

#### Test 5.1: Move Application from Applied → Shortlisted
```http
PUT http://localhost:5000/api/applications/<application_id>/stage
Authorization: Bearer <recruiter_token>
Content-Type: application/json

{
  "stage": "shortlisted",
  "note": "Profile looks promising"
}
```

#### Test 5.2: Move Application from Shortlisted → Interview
```http
PUT http://localhost:5000/api/applications/<application_id>/stage
Authorization: Bearer <recruiter_token>
Content-Type: application/json

{
  "stage": "interview",
  "note": "Scheduling technical round"
}
```

#### Test 5.3: Invalid Transition (Should Fail - 400)
```http
PUT http://localhost:5000/api/applications/<application_id>/stage
Authorization: Bearer <recruiter_token>
Content-Type: application/json

{
  "stage": "hired",
  "note": "Skipping stages"
}
```

**Expected Response (400):**
```json
{
  "success": false,
  "message": "Invalid stage transition from 'interview' to 'hired'",
  "errorCode": "INVALID_STAGE_TRANSITION"
}
```

#### Test 5.4: Candidate Cannot Change Stage (Should Fail - 403)
```http
PUT http://localhost:5000/api/applications/<application_id>/stage
Authorization: Bearer <candidate_token>
Content-Type: application/json

{
  "stage": "hired"
}
```

---

### 6. Interview Tests

#### Test 6.1: Schedule Interview
```http
POST http://localhost:5000/api/interviews
Authorization: Bearer <recruiter_token>
Content-Type: application/json

{
  "application": "<application_id>",
  "scheduledAt": "2026-09-15T10:00:00.000Z",
  "mode": "video",
  "meetingLink": "https://zoom.us/j/123456789"
}
```

#### Test 6.2: Get Interviews (Candidate View)
```http
GET http://localhost:5000/api/interviews
Authorization: Bearer <candidate_token>
```

---

### 7. Saved Jobs & Alerts Tests

#### Test 7.1: Save a Job
```http
POST http://localhost:5000/api/saved-jobs
Authorization: Bearer <candidate_token>
Content-Type: application/json

{
  "job": "<job_id>"
}
```

#### Test 7.2: Get Saved Jobs
```http
GET http://localhost:5000/api/saved-jobs
Authorization: Bearer <candidate_token>
```

#### Test 7.3: Create Job Alert
```http
POST http://localhost:5000/api/job-alerts
Authorization: Bearer <candidate_token>
Content-Type: application/json

{
  "keywords": ["backend", "nodejs"],
  "skills": ["Node.js", "MongoDB"],
  "location": "Bangalore",
  "experienceLevel": "mid"
}
```

---

### 8. Offer Management Tests

#### Test 8.1: Create Offer (Recruiter)
```http
POST http://localhost:5000/api/offers
Authorization: Bearer <recruiter_token>
Content-Type: application/json

{
  "application": "<application_id_at_offered_stage>",
  "salary": 1200000,
  "joiningDate": "2026-10-01T00:00:00.000Z",
  "notes": "Welcome to the team!"
}
```

#### Test 8.2: Accept Offer (Candidate)
```http
PUT http://localhost:5000/api/offers/<offer_id>/status
Authorization: Bearer <candidate_token>
Content-Type: application/json

{
  "status": "accepted"
}
```

---

### 9. Admin Analytics Tests

#### Test 9.1: Get Hiring Funnel
```http
GET http://localhost:5000/api/admin/reports/funnel
Authorization: Bearer <admin_token>
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Hiring funnel data retrieved",
  "data": {
    "totalCompanies": 2,
    "totalRecruiters": 2,
    "totalCandidates": 5,
    "totalJobs": 5,
    "activeJobs": 4,
    "totalApplications": 7,
    "stageCounts": {
      "applied": 3,
      "shortlisted": 1,
      "interview": 1,
      "offered": 1,
      "hired": 0,
      "rejected": 1
    },
    "conversionRates": {
      "shortlistedRate": 14.29,
      "interviewRate": 100,
      "offeredRate": 100,
      "hiredRate": 0
    }
  }
}
```

#### Test 9.2: Non-Admin Cannot Access (Should Fail - 403)
```http
GET http://localhost:5000/api/admin/reports/funnel
Authorization: Bearer <candidate_token>
```

---

## Security & Validation Tests

### 10. Authorization Tests

#### Test 10.1: No Token (Should Fail - 401)
```http
GET http://localhost:5000/api/candidates/profile
```

#### Test 10.2: Invalid Token (Should Fail - 401)
```http
GET http://localhost:5000/api/candidates/profile
Authorization: Bearer invalid_token_here
```

#### Test 10.3: Wrong Role Access (Should Fail - 403)
```http
POST http://localhost:5000/api/jobs
Authorization: Bearer <candidate_token>
```

### 11. Validation Tests

#### Test 11.1: Missing Required Fields
```http
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "email": "test@test.com"
}
```

**Expected Response (400):**
```json
{
  "success": false,
  "message": "\"name\" is required. \"password\" is required",
  "errorCode": "VALIDATION_ERROR"
}
```

#### Test 11.2: Invalid Email Format
```http
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "Test",
  "email": "invalid-email",
  "password": "Test123"
}
```

#### Test 11.3: Salary Range Validation (min > max)
```http
POST http://localhost:5000/api/jobs
Authorization: Bearer <recruiter_token>
Content-Type: application/json

{
  "company": "<company_id>",
  "title": "Test Job",
  "salaryRange": {
    "min": 1000000,
    "max": 500000
  }
}
```

---

## Performance Tests

### 12. Pagination Tests

#### Test 12.1: Get Jobs with Pagination
```http
GET http://localhost:5000/api/jobs?page=1&limit=2
```

**Verify response includes:**
```json
{
  "pagination": {
    "page": 1,
    "limit": 2,
    "total": 5,
    "totalPages": 3
  }
}
```

#### Test 12.2: Invalid Page Number
```http
GET http://localhost:5000/api/jobs?page=0&limit=10
```

---

## Error Handling Tests

### 13. Edge Cases

#### Test 13.1: Invalid MongoDB ObjectId
```http
GET http://localhost:5000/api/jobs/invalid-id
```

**Expected Response (400):**
```json
{
  "success": false,
  "message": "Invalid _id: invalid-id",
  "errorCode": "INVALID_ID"
}
```

#### Test 13.2: Non-existent Resource
```http
GET http://localhost:5000/api/jobs/507f1f77bcf86cd799439011
```

**Expected Response (404):**
```json
{
  "success": false,
  "message": "Job not found",
  "errorCode": "NOT_FOUND"
}
```

#### Test 13.3: 404 Route
```http
GET http://localhost:5000/api/nonexistent
```

**Expected Response (404):**
```json
{
  "success": false,
  "message": "Route not found",
  "errorCode": "NOT_FOUND"
}
```

---

## Testing Checklist

Use this checklist during your demonstration:

- [ ] Server starts without errors
- [ ] MongoDB connection successful
- [ ] Seed data loads correctly
- [ ] User registration works
- [ ] User login returns JWT token
- [ ] Duplicate registration blocked (409)
- [ ] Invalid login rejected (401)
- [ ] Protected routes require authentication (401)
- [ ] Role-based authorization works (403 for wrong roles)
- [ ] Candidate can create profile
- [ ] Jobs can be searched and filtered
- [ ] Recruiter can create jobs
- [ ] Candidate can apply to open jobs
- [ ] Duplicate applications blocked (409)
- [ ] Applications to closed jobs blocked (400)
- [ ] Pipeline transitions validate correctly
- [ ] Invalid stage transitions rejected (400)
- [ ] Only job owner can update applications
- [ ] Interviews can be scheduled
- [ ] Saved jobs work
- [ ] Job alerts work
- [ ] Offers can be created and updated
- [ ] Offer acceptance updates application to 'hired'
- [ ] Admin analytics return correct data
- [ ] Non-admins cannot access admin routes (403)
- [ ] Invalid ObjectIds handled gracefully (400)
- [ ] 404 for non-existent resources
- [ ] Validation errors return 400 with clear messages
- [ ] Rate limiting works (100 requests per 15 min)

---

## Common Issues & Solutions

### Issue 1: MongoDB Connection Failed
**Error:** `MongoDB connection error: connect ECONNREFUSED 127.0.0.1:27017`

**Solution:**
- Ensure MongoDB service is running
- On Windows: Run `net start MongoDB`
- Or use MongoDB Atlas cloud connection

### Issue 2: Port Already in Use
**Error:** `Error: listen EADDRINUSE: address already in use :::5000`

**Solution:**
```bash
# Find process using port 5000
netstat -ano | findstr :5000

# Kill the process (replace PID with actual process ID)
taskkill /PID <PID> /F

# Or change PORT in .env to 5001
```

### Issue 3: JWT Token Invalid
**Error:** `Invalid token`

**Solution:**
- Make sure you're including the full token in the Authorization header
- Format: `Authorization: Bearer <your_token_here>`
- Token might have expired (7 days) - login again

### Issue 4: Seed Script Fails
**Error:** Various errors during seeding

**Solution:**
```bash
# Clear the database manually
mongo
> use job_portal
> db.dropDatabase()
> exit

# Run seed again
npm run seed
```

---

## Next Steps

After successful testing:

1. **Code Review**: Review the implementation against the requirements
2. **Documentation**: Update README with any changes
3. **Postman Collection**: Export updated collection with test cases
4. **Presentation**: Prepare slides with architecture diagrams
5. **Viva Preparation**: Review common questions about the implementation

---

## Support

If you encounter issues:
1. Check the console logs for detailed error messages
2. Verify all environment variables are set correctly
3. Ensure MongoDB is running and accessible
4. Check network connectivity for MongoDB Atlas (if using cloud)

---

**Project Status:** ✅ Ready for Testing
**Last Updated:** 2026-09-06

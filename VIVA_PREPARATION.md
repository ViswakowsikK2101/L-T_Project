# VIVA Preparation Guide - Job Portal Backend

## Table of Contents
1. [Project Overview Questions](#project-overview-questions)
2. [Technology Stack Questions](#technology-stack-questions)
3. [Architecture & Design Questions](#architecture--design-questions)
4. [Database & MongoDB Questions](#database--mongodb-questions)
5. [Security Questions](#security-questions)
6. [API & REST Questions](#api--rest-questions)
7. [Business Logic Questions](#business-logic-questions)
8. [Testing & Debugging Questions](#testing--debugging-questions)
9. [Advanced Concepts](#advanced-concepts)

---

## Project Overview Questions

### Q1: What is your project about?
**Answer:** This is a Job Portal and Recruitment Management System backend API that connects job seekers with employers. It provides a complete hiring workflow from job posting to candidate hiring, including features like application tracking, interview scheduling, and analytics. The system supports three user roles: Candidates (job seekers), Recruiters (hiring managers), and Admins (platform managers).

### Q2: What problem does your project solve?
**Answer:** Traditional recruitment processes are fragmented and manual. Our system solves:
- **For Candidates**: Difficulty finding relevant jobs, tracking application status, and staying informed about opportunities
- **For Recruiters**: Challenges in managing applications, tracking candidates through hiring stages, and making data-driven hiring decisions
- **For Organizations**: Lack of structured workflows and visibility into recruitment metrics

### Q3: What are the main features of your system?
**Answer:** 
- **Authentication & Authorization**: Secure JWT-based login with role-based access control
- **Job Management**: Post, search, and filter job listings
- **Application Workflow**: Complete applicant pipeline from applied to hired with stage validations
- **Interview Scheduling**: Coordinate interviews between recruiters and candidates
- **Analytics**: Hiring funnel metrics and conversion rate tracking
- **Candidate Features**: Profile management, job alerts, saved jobs
- **Offer Management**: Create, accept, and track job offers

---

## Technology Stack Questions

### Q4: Why did you choose Node.js for this project?
**Answer:** 
- **JavaScript Everywhere**: Same language for frontend and backend reduces context switching
- **Asynchronous I/O**: Non-blocking architecture handles multiple concurrent API requests efficiently
- **NPM Ecosystem**: Rich library ecosystem (Express, Mongoose, JWT, etc.)
- **Fast Development**: Rapid prototyping and development
- **JSON Native**: Perfect for REST APIs that exchange JSON data
- **Active Community**: Large community support and regular updates

### Q5: Why Express.js instead of other Node.js frameworks?
**Answer:**
- **Minimalist & Flexible**: Unopinionated framework that doesn't enforce structure
- **Middleware Architecture**: Easy to add functionality through middleware
- **Mature & Stable**: Battle-tested in production environments
- **Large Ecosystem**: Tons of middleware packages available
- **Performance**: Lightweight and fast
- **Easy to Learn**: Simple API and extensive documentation

### Q6: Why MongoDB instead of MySQL or PostgreSQL?
**Answer:**
- **Schema Flexibility**: Can easily add fields without migrations (e.g., adding new candidate profile fields)
- **JSON/Document Model**: Natural fit for JavaScript/Node.js - documents map to objects
- **Horizontal Scalability**: Easier to scale out with sharding
- **Embedded Documents**: Can store related data together (e.g., stageHistory in applications)
- **No Complex Joins**: Better performance for denormalized data
- **Fast Development**: No need to define rigid schemas upfront

### Q7: What is Mongoose and why did you use it?
**Answer:** Mongoose is an ODM (Object Data Modeling) library for MongoDB and Node.js. We used it because:
- **Schema Definition**: Provides structure to MongoDB documents
- **Validation**: Built-in and custom validators ensure data integrity
- **Middleware**: Pre/post hooks for business logic (e.g., password hashing before save)
- **Type Casting**: Automatic type conversion and validation
- **Query Building**: Elegant API for building complex queries
- **Relationships**: Easy reference population across collections

### Q8: Why JWT for authentication?
**Answer:**
- **Stateless**: Server doesn't need to store session data - JWT contains all user info
- **Scalable**: No session storage means easy horizontal scaling
- **Cross-Domain**: Works across different domains and services
- **Mobile-Friendly**: Perfect for mobile apps and SPAs
- **Secure**: Digitally signed tokens prevent tampering
- **Self-Contained**: Token includes user ID and role, reducing database lookups

### Q9: Why bcrypt for password hashing?
**Answer:**
- **Slow by Design**: Computationally expensive, which protects against brute-force attacks
- **Salting Built-In**: Automatic salt generation prevents rainbow table attacks
- **Adaptive**: Cost factor can be increased as hardware improves
- **Industry Standard**: Widely trusted and battle-tested
- **One-Way Function**: Mathematically impossible to reverse
- **10 Salt Rounds**: Balances security and performance

---

## Architecture & Design Questions

### Q10: What is MVC architecture?
**Answer:** MVC stands for Model-View-Controller. It separates application logic into three components:
- **Model**: Data layer (Mongoose schemas) - defines data structure and database interactions
- **View**: Presentation layer (in our case, JSON responses sent to clients)
- **Controller**: Business logic layer - handles requests, processes data, and returns responses

In our project: Routes → Middleware → Controllers → Models → Database

### Q11: Explain your project's folder structure.
**Answer:**
- **config/**: Configuration files (database connection)
- **models/**: Mongoose schemas defining data structure
- **controllers/**: Business logic for handling requests
- **routes/**: API endpoint definitions and route mapping
- **middleware/**: Reusable functions (authentication, validation, error handling)
- **validators/**: Joi schemas for input validation
- **utils/**: Helper functions (token generation, pagination, error classes)
- **seeds/**: Database seeding scripts for testing

### Q12: What is middleware in Express?
**Answer:** Middleware are functions that execute during the request-response cycle. They have access to the request object (req), response object (res), and the next middleware function.

**Our middleware:**
- **authenticate**: Verifies JWT token and adds user to req.user
- **authorize**: Checks if user's role matches required roles
- **validate**: Validates request body against Joi schema
- **errorHandler**: Catches and formats all errors

**Flow:** Request → Route → validate → authenticate → authorize → Controller → Response

### Q13: What is the difference between authentication and authorization?
**Answer:**
- **Authentication**: Verifying WHO you are (identity verification)
  - Example: Login with email/password, verify JWT token
  - Question: "Are you really who you claim to be?"
  
- **Authorization**: Verifying WHAT you can do (permission checking)
  - Example: Only recruiters can create jobs, only admins can view analytics
  - Question: "Do you have permission to perform this action?"

In our system: JWT provides authentication, middleware checks authorization based on roles.

### Q14: Explain your error handling approach.
**Answer:** We use centralized error handling with a custom ApiError class:

1. **Controllers**: Throw ApiError for known errors, wrap in try-catch
2. **Custom Errors**: ApiError(statusCode, message, errorCode)
3. **Centralized Handler**: errorHandler middleware catches all errors
4. **Error Types Handled**:
   - Validation errors (400)
   - Authentication errors (401)
   - Authorization errors (403)
   - Not found errors (404)
   - Duplicate key errors (409)
   - MongoDB CastError (400)
   - Unknown errors (500)

**Benefits**: Consistent error format, no exposed stack traces, cleaner code.

---

## Database & MongoDB Questions

### Q15: What is the difference between SQL and NoSQL databases?
**Answer:**

| Aspect | SQL (MySQL, PostgreSQL) | NoSQL (MongoDB) |
|--------|------------------------|-----------------|
| **Schema** | Fixed, predefined schema | Flexible, dynamic schema |
| **Data Model** | Tables with rows/columns | Documents (JSON-like) |
| **Relationships** | Foreign keys, JOINs | Embedded or references |
| **Scalability** | Vertical (bigger server) | Horizontal (more servers) |
| **ACID** | Strong ACID guarantees | Eventual consistency |
| **Use Case** | Complex relationships | Rapid development, flexible data |

### Q16: What are MongoDB indexes and why did you create them?
**Answer:** Indexes are data structures that improve query performance by allowing MongoDB to find documents without scanning the entire collection.

**Our indexes:**
- `users { email: 1 }` - unique, for fast login lookup
- `applications { job: 1, candidate: 1 }` - compound unique, prevents duplicate applications and speeds up lookups
- `jobPostings { title: 'text', skills: 'text' }` - text index for full-text search
- `jobPostings { status: 1 }` - for filtering open/closed jobs

**Without indexes**: MongoDB scans every document (O(n) time)
**With indexes**: Fast lookup using B-tree structure (O(log n) time)

### Q17: When should you embed documents vs reference them in MongoDB?
**Answer:**

**Embed when:**
- Data is small and bounded (e.g., stageHistory in applications)
- Data is tightly coupled and always read together
- One-to-few relationships
- Data doesn't change independently

**Reference when:**
- Data is large or unbounded
- Data is shared across documents (e.g., company referenced by multiple jobs)
- Data changes independently
- One-to-many or many-to-many relationships

**Our decisions:**
- Embedded: stageHistory in applications (small, always read together)
- Referenced: company in jobPostings (large, shared, independently managed)

### Q18: How did you prevent duplicate applications?
**Answer:** We used a compound unique index on the Application collection:
```javascript
{ job: 1, candidate: 1 } // unique
```

This creates a database-level constraint that prevents inserting two documents with the same job and candidate combination. MongoDB returns a duplicate key error (code 11000) which we catch and return a 409 Conflict response.

**Why not just check before insert?** Race conditions - two simultaneous requests could both check (no duplicate found) and both insert. The unique index prevents this at the database level.

### Q19: Explain your Application schema's stageHistory field.
**Answer:** stageHistory is an embedded array that maintains an audit trail of all stage transitions:

```javascript
stageHistory: [
  {
    stage: 'applied',
    changedAt: Date,
    changedBy: ObjectId (recruiter who made the change),
    note: 'Optional reason for change'
  }
]
```

**Benefits:**
- Complete audit trail of hiring pipeline
- Shows who changed status and when
- Provides context through notes
- Enables reporting on time spent in each stage

**Why embedded?** Always read with application, small size, doesn't need independent queries.

---

## Security Questions

### Q20: How do you secure passwords in your system?
**Answer:**
1. **Never store plain text**: Passwords are hashed before storage
2. **bcrypt hashing**: One-way cryptographic hash with 10 salt rounds
3. **Salt**: Random data added before hashing prevents rainbow table attacks
4. **Pre-save hook**: Mongoose middleware automatically hashes password when modified
5. **select: false**: Password field excluded from queries by default
6. **Login**: Use bcrypt.compare() to verify password against hash

### Q21: How does JWT authentication work in your project?
**Answer:**

**Login Flow:**
1. User sends email/password
2. Server verifies credentials
3. Server generates JWT containing user ID and role
4. Server returns token to client
5. Client stores token (localStorage/sessionStorage)
6. Client includes token in Authorization header for subsequent requests

**Protected Route Flow:**
1. Client sends request with `Authorization: Bearer <token>`
2. authenticate middleware extracts and verifies token
3. If valid, decode token and attach user info to req.user
4. If invalid/expired, return 401 Unauthorized
5. Controller accesses req.user for business logic

**Token Structure:** Header.Payload.Signature (signed with JWT_SECRET)

### Q22: What is RBAC and how did you implement it?
**Answer:** RBAC (Role-Based Access Control) restricts system access based on user roles.

**Our roles:**
- **Candidate**: Apply for jobs, manage profile, view own applications
- **Recruiter**: Create jobs, manage applications, schedule interviews
- **Admin**: Platform analytics, view all data

**Implementation:**
1. User model has a `role` field (enum: candidate/recruiter/admin)
2. JWT token includes role
3. `authorize(...roles)` middleware checks if req.user.role is in allowed roles
4. Routes specify required roles: `router.post('/', authenticate, authorize('recruiter'), createJob)`

**Example:** Candidate trying to access recruiter route → 403 Forbidden

### Q23: How do you prevent SQL/NoSQL injection?
**Answer:**
1. **Mongoose Schema Validation**: Type checking prevents injection
2. **Parameterized Queries**: Mongoose uses parameterized queries internally
3. **Input Validation**: Joi validates and sanitizes all inputs
4. **ObjectId Validation**: Regex validation for MongoDB ObjectIds
5. **No String Interpolation**: Never build queries with string concatenation
6. **Schema Enforcement**: Strict schemas reject unexpected fields

### Q24: What security headers did you implement?
**Answer:** We use Helmet middleware which sets multiple HTTP security headers:
- **X-Content-Type-Options**: Prevents MIME sniffing
- **X-Frame-Options**: Prevents clickjacking
- **X-XSS-Protection**: Enables browser XSS filter
- **Strict-Transport-Security**: Forces HTTPS
- **Content-Security-Policy**: Prevents XSS attacks
- **Referrer-Policy**: Controls referrer information

### Q25: How does rate limiting work?
**Answer:** We use express-rate-limit middleware:
- **Limit**: 100 requests per 15 minutes per IP address
- **Purpose**: Prevent brute-force attacks and API abuse
- **Action**: Returns 429 Too Many Requests when limit exceeded
- **Scope**: Applied to all /api/* routes

---

## API & REST Questions

### Q26: What is REST API?
**Answer:** REST (Representational State Transfer) is an architectural style for designing networked applications. Key principles:
- **Stateless**: Each request contains all information needed
- **Client-Server**: Separation of concerns
- **Resource-Based**: URLs represent resources (/api/jobs)
- **HTTP Methods**: GET (read), POST (create), PUT (update), DELETE (delete)
- **JSON Format**: Data exchanged as JSON

### Q27: What HTTP status codes did you use and why?
**Answer:**
- **200 OK**: Successful GET, PUT requests
- **201 Created**: Successful POST (resource created)
- **400 Bad Request**: Validation errors, invalid input
- **401 Unauthorized**: Missing or invalid authentication token
- **403 Forbidden**: Valid authentication but insufficient permissions
- **404 Not Found**: Resource doesn't exist
- **409 Conflict**: Duplicate resource (e.g., duplicate application)
- **422 Unprocessable Entity**: Valid format but business rule violation
- **500 Internal Server Error**: Unexpected server errors

### Q28: Explain your API response format.
**Answer:** We use a consistent format for all responses:

**Success:**
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... },
  "pagination": { page, limit, total, totalPages }
}
```

**Error:**
```json
{
  "success": false,
  "message": "Error description",
  "errorCode": "ERROR_CODE"
}
```

**Benefits**: Predictable structure, easy client-side parsing, clear success/failure indication.

### Q29: What is pagination and why is it important?
**Answer:** Pagination divides large result sets into smaller pages.

**Our implementation:**
- Query parameters: `?page=1&limit=10`
- Returns: `{ data: [...], pagination: { page, limit, total, totalPages } }`
- Uses MongoDB skip() and limit()

**Benefits:**
- Prevents loading thousands of records at once
- Improves API performance and response time
- Reduces database load
- Better user experience (faster page loads)

**Example:** 1000 jobs → 100 pages of 10 jobs each

### Q30: How did you implement job search and filtering?
**Answer:**
1. **Query Parameters**: Accept filters in URL: `?title=developer&location=Bangalore&experienceLevel=senior`
2. **Build Query Object**: Construct MongoDB query based on parameters
3. **Text Search**: Use regex for case-insensitive title matching
4. **Array Filtering**: Use $in operator for skills
5. **Exact Match**: Direct equality for experienceLevel, status
6. **Combine Filters**: All filters applied with AND logic
7. **Pagination**: Apply skip/limit after filtering

```javascript
const query = {};
if (title) query.title = new RegExp(title, 'i');
if (skills) query.skills = { $in: skills };
if (location) query.location = new RegExp(location, 'i');
```

---

## Business Logic Questions

### Q31: Explain the applicant pipeline workflow.
**Answer:** Our pipeline has 6 stages with strict transition rules:

```
Applied → Shortlisted → Interview → Offered → Hired
   ↓          ↓            ↓          ↓
Rejected   Rejected     Rejected   Rejected
```

**Valid Transitions:**
- Applied can move to: Shortlisted or Rejected
- Shortlisted can move to: Interview or Rejected
- Interview can move to: Offered or Rejected
- Offered can move to: Hired or Rejected
- Hired/Rejected are terminal (no further changes)

**Validation:** Controller checks STAGE_TRANSITIONS map before allowing update. Invalid transitions return 400 error.

**Why?** Prevents illogical workflows (e.g., jumping from Applied to Hired without interview).

### Q32: How do you prevent candidates from applying to closed jobs?
**Answer:** Multi-layer validation:

1. **Schema Enum**: Job status must be 'open', 'closed', or 'draft'
2. **Controller Check**: When creating application, verify job.status === 'open'
3. **Business Rule**: If status is 'closed' or 'draft', throw ApiError(400, 'Job not accepting applications')
4. **Frontend**: Disable apply button for closed jobs (not sufficient alone)

**Why server-side validation?** Client-side validation can be bypassed. Server is the source of truth.

### Q33: Why can't a candidate change their application stage?
**Answer:** Business logic reasons:
- Only hiring team (recruiters) should control pipeline
- Candidates could mark themselves as hired
- Maintains integrity of hiring process
- Candidates are observers, not decision-makers

**Implementation:** authorize('recruiter') middleware on stage update route. Candidates trying to access get 403 Forbidden.

### Q34: How does offer acceptance work?
**Answer:**
1. Recruiter creates offer for application at "offered" stage
2. Candidate receives offer (via GET /api/offers)
3. Candidate updates status: PUT /api/offers/:id/status with { status: 'accepted' }
4. Authorization check: Only candidate who owns offer can update
5. Business logic: Can only accept offers in 'pending' status
6. Side effect: If accepted, application stage automatically updates to 'hired'
7. stageHistory updated with acceptance timestamp

### Q35: Explain ownership checks in your system.
**Answer:** Ownership ensures users can only modify their own resources:

**Examples:**
- **Jobs**: Recruiter can only update/delete jobs where job.recruiter === req.user.id
- **Applications**: Recruiter can only update stages for applications to their jobs
- **Profiles**: Candidates can only update their own profile
- **Companies**: Recruiters can only update companies they're associated with

**Implementation:**
```javascript
if (job.recruiter.toString() !== req.user.id) {
  throw new ApiError(403, 'Not authorized', 'FORBIDDEN');
}
```

---

## Testing & Debugging Questions

### Q36: How would you test this API?
**Answer:**
1. **Postman**: Manual testing with saved collections
2. **cURL**: Command-line testing for quick checks
3. **Unit Tests**: Test individual functions (controllers, utilities)
4. **Integration Tests**: Test complete workflows (apply → interview → hire)
5. **Load Testing**: Test performance under high load
6. **Security Testing**: Test for vulnerabilities (injection, unauthorized access)

**Our testing workflow:**
- Import Postman collection
- Test happy paths (successful operations)
- Test error cases (validation, authorization, not found)
- Test edge cases (duplicate applications, invalid transitions)

### Q37: How would you debug an API error?
**Answer:**
1. **Check Console Logs**: Look for error messages in server logs
2. **Inspect Request**: Verify request body, headers, and parameters
3. **Check Token**: Ensure JWT token is valid and not expired
4. **Verify Database**: Check if data exists in MongoDB
5. **Test Validation**: Ensure input passes Joi validation
6. **Check Authorization**: Verify user has required role/permissions
7. **Review Stack Trace**: Identify exact line where error occurred
8. **Use Debugger**: Set breakpoints in VS Code

**Common issues:**
- 401: Missing/invalid token
- 403: Wrong role or not owner
- 404: Resource doesn't exist
- 400: Validation failed or invalid input

### Q38: What would you monitor in production?
**Answer:**
- **Error Rate**: Track 4xx and 5xx responses
- **Response Time**: Monitor API latency
- **Database Performance**: Query execution time, connection pool
- **Authentication Failures**: Potential security issues
- **Rate Limit Hits**: Identify abuse or need for adjustment
- **Resource Usage**: CPU, memory, disk space
- **Business Metrics**: Applications per day, conversion rates

**Tools:** Winston for logging, PM2 for process management, MongoDB Atlas monitoring.

---

## Advanced Concepts

### Q39: How would you scale this application?
**Answer:**
1. **Horizontal Scaling**: Deploy multiple Node.js instances behind load balancer
2. **Database Scaling**: MongoDB replica sets for read scaling, sharding for write scaling
3. **Caching**: Redis for frequently accessed data (job listings, user sessions)
4. **CDN**: Serve static assets through CDN
5. **Database Indexing**: Optimize queries with proper indexes
6. **Async Operations**: Move heavy tasks to background jobs (email notifications)
7. **Microservices**: Split into services (auth, jobs, applications, analytics)

### Q40: What is the difference between PUT and PATCH?
**Answer:**
- **PUT**: Complete replacement of resource (all fields required)
- **PATCH**: Partial update (only changed fields)

In our project, we mostly use PUT but only update provided fields (PATCH-like behavior):
```javascript
if (req.body.title) job.title = req.body.title;
if (req.body.description) job.description = req.body.description;
```

### Q41: How would you add email notifications?
**Answer:**
1. **Install NodeMailer**: `npm install nodemailer`
2. **Configure SMTP**: Gmail, SendGrid, or AWS SES
3. **Create Email Templates**: HTML templates for different notifications
4. **Add to Workflow**:
   - Application submitted → Email recruiter
   - Stage changed → Email candidate
   - Interview scheduled → Email both
   - Offer extended → Email candidate
5. **Async Processing**: Use bull queue to avoid blocking API response
6. **Error Handling**: Gracefully handle email failures without breaking workflow

### Q42: Explain async/await vs callbacks.
**Answer:**

**Callbacks (old way):**
```javascript
User.findOne({ email }, (err, user) => {
  if (err) return handleError(err);
  bcrypt.compare(password, user.password, (err, isMatch) => {
    if (err) return handleError(err);
    // Callback hell
  });
});
```

**Async/Await (our way):**
```javascript
try {
  const user = await User.findOne({ email });
  const isMatch = await bcrypt.compare(password, user.password);
  // Clean, readable code
} catch (err) {
  handleError(err);
}
```

**Benefits:** Cleaner code, easier error handling, reads like synchronous code.

### Q43: What is mongoose populate?
**Answer:** Populate replaces ObjectId references with actual documents.

**Without populate:**
```javascript
{
  job: "64f8a9b3c...", // Just the ID
  candidate: "64f8a9c4d..."
}
```

**With populate:**
```javascript
{
  job: { _id: "64f8a9b3c...", title: "Senior Developer", company: {...} },
  candidate: { _id: "64f8a9c4d...", name: "John Doe", email: "john@email.com" }
}
```

**Usage:**
```javascript
await Application.find()
  .populate('job', 'title company')
  .populate('candidate', 'name email');
```

### Q44: How would you implement real-time notifications?
**Answer:**
1. **WebSockets (Socket.io)**: Bi-directional communication
2. **Server-Sent Events (SSE)**: One-way server-to-client
3. **Polling**: Client checks for updates periodically (inefficient)

**Socket.io implementation:**
```javascript
io.on('connection', (socket) => {
  socket.join(`user_${userId}`);
});

// When application status changes:
io.to(`user_${candidateId}`).emit('statusUpdate', {
  message: 'Your application was shortlisted'
});
```

### Q45: What security vulnerabilities did you consider?
**Answer:**
1. **SQL/NoSQL Injection**: Prevented with Mongoose and validation
2. **XSS**: Prevented with Helmet headers
3. **CSRF**: Less relevant for stateless JWT APIs
4. **Brute Force**: Prevented with rate limiting
5. **Password Leaks**: Prevented with bcrypt hashing
6. **Token Theft**: Use HTTPS, short expiry, secure storage
7. **Unauthorized Access**: Prevented with authentication and authorization middleware
8. **Data Leakage**: Passwords excluded from responses, ownership checks

---

## Confidence Tips for Viva

1. **Know Your Code**: Be able to explain any file or function
2. **Understand Why**: Know why you made each design decision
3. **Admit Gaps**: If you don't know something, say "That's a great question, I'd research X approach"
4. **Be Specific**: Give examples from your actual code
5. **Draw Diagrams**: Visual explanations help (architecture, database schema, workflow)
6. **Stay Calm**: Think before answering, it's okay to pause

---

**Remember:** The goal is to demonstrate understanding, not memorization. Be ready to explain your reasoning and choices!

**Good luck with your viva! 🎓**

const express = require('express');
const router = express.Router();
const { createCompany, getCompanies, getCompany, updateCompany, deleteCompany } = require('../controllers/companyController');
const { validate } = require('../middleware/validate');
const { createCompanySchema, updateCompanySchema } = require('../validators/companyValidator');
const authenticate = require('../middleware/auth');
const authorize = require('../middleware/authorize');

router.route('/')
  .post(authenticate, authorize('recruiter'), validate(createCompanySchema), createCompany)
  .get(getCompanies);

router.route('/:id')
  .get(getCompany)
  .put(authenticate, authorize('recruiter'), validate(updateCompanySchema), updateCompany)
  .delete(authenticate, authorize('recruiter'), deleteCompany);

module.exports = router;
const express = require('express');
const router = express.Router();
const { createCompany, getCompanies, getCompany, updateCompany, deleteCompany } = require('../controllers/companyController');
const { authenticate } = require('../middleware/auth');
const { authorize } = require('../middleware/authorize');
const { validate } = require('../middleware/validate');
const { createCompanySchema, updateCompanySchema } = require('../validators/companyValidator');

router.post('/', authenticate, authorize('recruiter'), validate(createCompanySchema), createCompany);
router.get('/', getCompanies);
router.get('/:id', getCompany);
router.put('/:id', authenticate, authorize('recruiter'), validate(updateCompanySchema), updateCompany);
router.delete('/:id', authenticate, authorize('recruiter'), deleteCompany);

module.exports = router;

const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/upload.controller');
const { authenticate, requireRole } = require('../middlewares/auth.middleware');

router.post('/', authenticate, requireRole(['admin', 'sub_admin']), uploadController.upload);

module.exports = router;

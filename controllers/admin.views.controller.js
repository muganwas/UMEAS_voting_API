const express = require('express');
const router = express.Router();
const path = require('path');
const { validateFirebaseAdmin } = require('../_helpers/functions');

const { enums: { VALIDATION_ERROR, UNAUTHORIZED_ERROR }, messages: { VALIDATION_MESSAGE, UNAUTHORIZED_MESSAGE } } = require('../_helpers/constants');

router.get('/', function (req, res, next) {
    res.sendFile(path.join(__dirname, '../public/views/Admin/index.html'));
});

router.get('/dashboard', async function (req, res, next) {
    if (!req.headers.authorization) return next({ name: VALIDATION_ERROR, message: VALIDATION_MESSAGE }, req, res, next);
    if (!await validateFirebaseAdmin(req.headers.authorization)) return next({ name: UNAUTHORIZED_ERROR, message: UNAUTHORIZED_MESSAGE }, req, res, next);
    res.sendFile(path.join(__dirname, '../public/views/Admin/pages/dashboard.html'));
});

module.exports = router;
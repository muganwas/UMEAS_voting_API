const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

const { validateFirebaseAdmin, validateFirebaseUser } = require('../_helpers/functions');
const campaignsService = require('../services/campaigns.service');

const { enums: { VALIDATION_ERROR, UNAUTHORIZED_ERROR }, messages: { VALIDATION_MESSAGE, UNAUTHORIZED_MESSAGE } } = require('../_helpers/constants');

async function createCampaign(req, res, next) {
    const { name, companyId, categoryIds, companyName, agencyName, brandName, intro, agencyId, emailAddress } = req.body;
    campaignsService.createCampaign({ name, companyId, companyName, agencyName, intro, catIds: categoryIds, brandName, agencyId, emailAddress }, req.files).then(data => res.json(data)).catch(err => next(err));
}

async function updateCampaign(req, res, next) {
    if (!req.headers.authorization) return next({ name: VALIDATION_ERROR, message: VALIDATION_MESSAGE }, req, res, next);
    if (!await validateFirebaseAdmin(req.headers.authorization)) return next({ name: UNAUTHORIZED_ERROR, message: UNAUTHORIZED_MESSAGE }, req, res, next);

    const { id, name, companyId, fileURL, categoryIds, brandName, agencyId, emailAddress } = req.body;
    campaignsService.updateCampaign({ id, name, companyId, fileURL, catIds: categoryIds, brandName, agencyId, emailAddress }, req.files).then(data => res.json(data)).catch(err => next(err));
}

async function retrieveCampaigns(req, res, next) {
    if (!req.headers.authorization) return next({ name: VALIDATION_ERROR, message: VALIDATION_MESSAGE }, req, res, next);
    if (!await validateFirebaseUser(req.headers.authorization)) return next({ name: UNAUTHORIZED_ERROR, message: UNAUTHORIZED_MESSAGE }, req, res, next);

    const { limit, page, catId } = req.query;
    campaignsService.retrieveCampaigns({ limit, page, catId }).then(data => res.json(data)).catch(err => next(err));
}

async function retrieveCampaign(req, res, next) {
    if (!req.headers.authorization) return next({ name: VALIDATION_ERROR, message: VALIDATION_MESSAGE }, req, res, next);
    if (!await validateFirebaseUser(req.headers.authorization)) return next({ name: UNAUTHORIZED_ERROR, message: UNAUTHORIZED_MESSAGE }, req, res, next);

    const { campaignId } = req.params;
    campaignsService.retrieveCampaign({ campaignId }).then(data => res.json(data)).catch(err => next(err));
}

async function deleteCampaign(req, res, next) {
    if (!req.headers.authorization) return next({ name: VALIDATION_ERROR, message: VALIDATION_MESSAGE }, req, res, next);
    if (!await validateFirebaseAdmin(req.headers.authorization)) return next({ name: UNAUTHORIZED_ERROR, message: UNAUTHORIZED_MESSAGE }, req, res, next);

    const { campaignId } = req.query;
    campaignsService.deleteCampaign({ campaignId }).then(data => res.json(data)).catch(err => next(err));
}

router.post('/create', upload.any('files'), createCampaign);
router.put('/update', upload.any('files'), updateCampaign);
router.get('/', retrieveCampaigns);
router.get('/:campaignId', retrieveCampaign);
router.delete('/', deleteCampaign);

module.exports = router;

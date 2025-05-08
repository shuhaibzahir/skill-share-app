const express = require('express');
const {
  createOffer,
  updateOfferStatus,
  getProviderOffers
} = require('../controllers/offer.controller');
const { authorize } = require('../middlewares/auth');

const router = express.Router();

router.route('/')
  .post(authorize('provider'), createOffer);

router.route('/provider')
  .get(authorize('provider'), getProviderOffers);

router.route('/:id/status')
  .put(authorize('user'), updateOfferStatus);

module.exports = router;

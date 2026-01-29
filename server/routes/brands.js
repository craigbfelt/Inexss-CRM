const express = require('express');
const router = express.Router();
const brandController = require('../controllers/brandController');
const { auth, adminAuth, brandRepAuth } = require('../middleware/auth');

router.post('/', auth, adminAuth, brandController.createBrand);
router.get('/', auth, brandRepAuth, brandController.getAllBrands);
router.get('/:id', auth, brandRepAuth, brandController.getBrandById);
router.put('/:id', auth, adminAuth, brandController.updateBrand);
router.delete('/:id', auth, adminAuth, brandController.deleteBrand);

module.exports = router;

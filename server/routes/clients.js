const express = require('express');
const router = express.Router();
const clientController = require('../controllers/clientController');
const { auth, restrictedRoleCheck } = require('../middleware/auth');

router.post('/', auth, restrictedRoleCheck, clientController.createClient);
router.get('/', auth, clientController.getAllClients);
router.get('/:id', auth, clientController.getClientById);
router.put('/:id', auth, restrictedRoleCheck, clientController.updateClient);
router.delete('/:id', auth, restrictedRoleCheck, clientController.deleteClient);

module.exports = router;

const express = require('express');
const productsController = require('../controllers/productsController');
const cartsController = require('../controllers/cartsController');

const router = express.Router();

router.get('/', productsController.getProducts);
router.get('/:pid', productsController.getProductById);
router.post('/', productsController.addProduct);
router.put('/:pid', productsController.updateProduct);
router.delete('/:pid', productsController.deleteProduct);

router.post('/:cid/product/:pid', cartsController.addProductToCart);
router.get('/:cid', cartsController.getCart);

module.exports = router;
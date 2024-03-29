const {getAllProduct,getOneProduct,createProduct,deleteProduct,editProduct, uploadThumbnail, trueDelete} = require('../controllers/product.controllers')
const { authentication } = require('../middlewares/authentication/authentication')
const { authorrize } = require('../middlewares/authentication/authorrize')
const { uploadSingleImg } = require('../middlewares/upload/uploadSingleImg/uploadSingleImg')
const { checkExits } = require('../middlewares/validation/checkExits')
const productRouter = require('express-promise-router')()
const {Product} = require('../models')
productRouter.route('/')
    .get(getAllProduct)
    .post(authentication,authorrize([1]),uploadSingleImg('thumbnail'),createProduct)
productRouter.route('/deltrue')
    .get(trueDelete)
productRouter.route('/:id')
    .get(getOneProduct)
    .post(uploadSingleImg('thumbnail'),uploadThumbnail)
    .put(authentication,authorrize([1]),uploadSingleImg('thumbnail'),editProduct)
    .delete(checkExits(Product),authentication,authorrize([1]),deleteProduct)
module.exports = {
    productRouter
}
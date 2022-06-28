const express = require("express");
const { 
    getAllProducts,
    createProduct, 
    updateProduct, 
    deleteProduct, 
    getProductDetails, 
    createProductReview, 
    getProductReviews, 
    deleteReview, 
    getAdminProducts 
} = require("../controllers/productController");

const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

const router = express.Router();

//route for Get All Products
router.route("/products").get(getAllProducts); // Test on GetAllProducts 

router.route("/admin/products").get(isAuthenticatedUser, authorizeRoles("admin"), getAdminProducts);
// route for create a product -- Admin
router.route("/admin/product/new").post(isAuthenticatedUser, authorizeRoles("admin"), createProduct);
// route for update the product -- Admin
router.route("/admin/product/:id").put(isAuthenticatedUser, authorizeRoles("admin"), updateProduct);
// route for delete the product -- Admin
// router.route("/product/:id").put(updateProduct).delete(deleteProduct);
router.route("/admin/product/:id").delete(isAuthenticatedUser, authorizeRoles("admin"), deleteProduct);

// route for get Single product
// router.route("/product/:id").put(updateProduct).delete(deleteProduct).get(getProductDetails);
router.route("/product/:id").get(getProductDetails);
// route for create/update review
router.route("/review").put(isAuthenticatedUser, createProductReview);
// route for get All reviews and delete review
router.route("/reviews").get(getProductReviews).delete(isAuthenticatedUser, deleteReview);

module.exports = router;
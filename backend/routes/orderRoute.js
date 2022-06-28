const express = require("express");
const { newOrder, getSingleOrder, myOrders, getAllOrders, updateOrder, deleteOrder } = require("../controllers/orderController");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");
const router = express.Router();


// route for create Order
router.route("/order/new").post(isAuthenticatedUser, newOrder);
// route for getSingle Order
router.route("/order/:id").get(isAuthenticatedUser, getSingleOrder);
// route for get loggedIn User orders OR get my orders
router.route("/orders/me").get(isAuthenticatedUser, myOrders);

// route for get All orders -- admin
router.route("/admin/orders").get(isAuthenticatedUser, authorizeRoles("admin"),getAllOrders);
// route for update order status -- admin
router.route("/admin/order/:id").put(isAuthenticatedUser, authorizeRoles("admin"), updateOrder).delete(isAuthenticatedUser, authorizeRoles("admin"), deleteOrder);


module.exports = router;
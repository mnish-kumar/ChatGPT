const orderController = require("../controller/order.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const express = require("express");
const router = express.Router();

/**
 * @route POST api/orders
 * @desc Create a new order for the logged in user
 * @access Private (user)
 */
router.post("/", authMiddleware.createAuthMiddleware(["user"]), orderController.createOrderController);


/**
 * @route GET api/orders
 * @desc Get all orders for the logged in user
 * @access Private (user)
 */
router.get("/", authMiddleware.createAuthMiddleware(["user"]));


/**
 * @route GET api/orders/:orderId
 * @desc Get order details by order ID for the logged in user
 * @access Private (user)
 */
router.get("/:orderId", authMiddleware.createAuthMiddleware(["user"]));

module.exports = router;
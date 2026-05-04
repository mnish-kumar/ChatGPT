const paymentController = require("../controller/payment.controller");
const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth.middleware");

/**
 * @route POST api/payment/created/:orderId
 * @desc Create a new payment order for the given order ID
 * @access Private (user)
 * @returns { payment }
 */
router.post(
  "/created/:orderId",
  authMiddleware.createAuthMiddleware(["user"]),
  paymentController.createPayment,
);

/**
 * @route POST api/payment/verify
 * @desc Verify payment signature and update payment status
 * @access Private (user)
 * @returns { payment }
 */
router.post(
  "/verify",
  authMiddleware.createAuthMiddleware(["user"]),
  paymentController.verifyPayment,
);

module.exports = router;

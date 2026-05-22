import express from "express";

import { authMiddleware } from "../middleware/authMiddleware";
import { roleGuard } from "../middleware/roleGuard";

import { RoleType } from "../../domain/identity/Roles";

import { AccountsReceivableService } from "../../application/customers/AccountsReceivableService";
import { ReceiveCustomerPaymentUseCase } from "../../application/customers/ReceiveCustomerPaymentUseCase";

const router = express.Router();

/**
 * =====================================
 * TEMP IN-MEMORY CUSTOMER REPOSITORY
 * Replace with Prisma repository later
 * =====================================
 */
const customerRepo = {
  customers: new Map<string, any>(),

  async findById(id: string) {
    return this.customers.get(id) || null;
  },

  async save(customer: any) {
    this.customers.set(customer.id, customer);
  },
};

/**
 * =====================================
 * SERVICES
 * =====================================
 */
const receivableService = new AccountsReceivableService(
  customerRepo
);

const receivePaymentUseCase =
  new ReceiveCustomerPaymentUseCase(
    customerRepo
  );

/**
 * =====================================
 * GET CUSTOMER CREDIT
 * GET /customers/:id/credit
 * =====================================
 */
router.get(
  "/customers/:id/credit",
  authMiddleware,
  roleGuard([
    RoleType.ADMIN,
    RoleType.CASHIER,
    RoleType.MANAGER,
  ]),
  async (req, res) => {
    try {
      const customerId = Array.isArray(req.params.id)
        ? req.params.id[0]
        : req.params.id;

      const outstanding =
        await receivableService.getOutstanding(
          customerId
        );

      return res.json({
        message: "Customer credit fetched",
        data: {
          customerId,
          outstanding,
        },
      });
    } catch (e: any) {
      return res.status(400).json({
        message: e.message,
      });
    }
  }
);

/**
 * =====================================
 * RECEIVE CUSTOMER PAYMENT
 * POST /customers/payment
 * =====================================
 */
router.post(
  "/customers/payment",
  authMiddleware,
  roleGuard([
    RoleType.ADMIN,
    RoleType.CASHIER,
  ]),
  async (req, res) => {
    try {
      const { customerId, amount, paymentMethod } = req.body;

      if (!customerId || amount == null || !paymentMethod) {
        return res.status(400).json({
          message: "customerId, amount, and paymentMethod required",
        });
      }

      // Convert amount to number and validate
      const amountNumber = Number(amount);
      if (isNaN(amountNumber) || amountNumber <= 0) {
        return res.status(400).json({
          message: "Invalid amount",
        });
      }

      const result = await receivePaymentUseCase.execute({
        customerId,
        amount: amountNumber,
        paymentMethod,
      });

      return res.json({
        message: "Customer payment received",
        data: result,
      });
    } catch (e: any) {
      return res.status(400).json({
        message: e.message,
      });
    }
  }
);

/**
 * =====================================
 * GET CUSTOMER LOYALTY
 * GET /customers/loyalty?id=customerId
 * =====================================
 */
router.get(
  "/customers/loyalty",
  authMiddleware,
  roleGuard([
    RoleType.ADMIN,
    RoleType.CASHIER,
    RoleType.MANAGER,
  ]),
  async (req, res) => {
    try {
      const customerId = Array.isArray(req.query.id)
        ? req.query.id[0]
        : req.query.id;

      if (!customerId || typeof customerId !== "string") {
        return res.status(400).json({
          message: "Customer ID required",
        });
      }

      const customer =
        await customerRepo.findById(customerId);

      if (!customer) {
        return res.status(404).json({
          message: "Customer not found",
        });
      }

      return res.json({
        message: "Customer loyalty fetched",
        data: {
          customerId: customer.id,
          loyaltyPoints: customer.loyaltyPoints,
        },
      });
    } catch (e: any) {
      return res.status(500).json({
        message: e.message,
      });
    }
  }
);

export default router;
import express from "express";
import { CreateReturnUseCase } from "../../application/returns/CreateReturnUseCase";
import { ApproveReturnUseCase } from "../../application/returns/ApproveReturnUseCase";
import { CompleteReturnUseCase } from "../../application/returns/CompleteReturnUseCase";

const router = express.Router();

// =====================
// MOCK REPOS (replace with DB later)
// =====================
const returnRepo = {
  findById: async (id: string) => null,
  save: async (data: any) => {},
};

const saleRepo = {
  findById: async (id: string) => null,
};

const stockRepo = {
  createMovement: async (data: any) => {},
};

const paymentRepo = {
  create: async (data: any) => {},
};

const ledgerRepo = {
  createEntry: async (data: any) => {},
};

const auditLogger = {
  log: (data: any) => console.log("[AUDIT]", data),
};

// =====================
// USECASES
// =====================
const createReturnUseCase = new CreateReturnUseCase(saleRepo, returnRepo);

const approveReturnUseCase = new ApproveReturnUseCase(returnRepo);

const completeReturnUseCase = new CompleteReturnUseCase(
  returnRepo,
  stockRepo,
  paymentRepo,
  ledgerRepo,
  auditLogger
);

// =====================
// 1. CREATE RETURN
// =====================
router.post("/returns/create", async (req, res) => {
  try {
    const result = await createReturnUseCase.execute(req.body);

    return res.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

// =====================
// 2. APPROVE RETURN
// =====================
router.post("/returns/approve", async (req, res) => {
  try {
    const { returnId } = req.body;

    const result = await approveReturnUseCase.execute(returnId);

    return res.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

// =====================
// 3. COMPLETE RETURN
// =====================
router.post("/returns/complete", async (req, res) => {
  try {
    const { returnId } = req.body;

    const result = await completeReturnUseCase.execute(returnId);

    return res.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

// =====================
// 4. GET RETURN BY ID
// =====================
router.get("/returns/:id", async (req, res) => {
  try {
    const returnRequest = await returnRepo.findById(req.params.id);

    if (!returnRequest) {
      return res.status(404).json({
        success: false,
        message: "Return not found",
      });
    }

    return res.json({
      success: true,
      data: returnRequest,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

export default router;
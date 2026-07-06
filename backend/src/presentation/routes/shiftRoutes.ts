import express, { Request, Response } from "express";

import { authMiddleware } from "../middleware/authMiddleware";

import { OpenShiftUseCase } from "../../application/shifts/OpenShiftUseCase";
import { CloseShiftUseCase } from "../../application/shifts/CloseShiftUseCase";
import { GetShiftReportUseCase } from "../../application/shifts/GetShiftReportUseCase";

import { ShiftRepository } from "../../infrastructure/repositories/ShiftRepository";
import { CashDrawerService } from "../../application/shifts/CashDrawerService";


const router = express.Router();
// ======================================
// DEPENDENCIES
// ======================================

const shiftRepo = new ShiftRepository();

const cashDrawerService =
  new CashDrawerService(
    shiftRepo.movementRepository,
    shiftRepo
  );


const openShiftUseCase =
  new OpenShiftUseCase(
    shiftRepo
  );

const closeShiftUseCase =
  new CloseShiftUseCase(
    shiftRepo,
    cashDrawerService
  );

const reportUseCase =
  new GetShiftReportUseCase(
    shiftRepo,
    shiftRepo.movementRepository
  );

// ======================================
// POST /shifts/open
// ======================================

router.post(
"/open",
authMiddleware,
async(req:Request,res:Response)=>{

try{


const {
 openingCash,
 branchId
}=req.body;

const userId =
(req as any).user.id;

const shift =
await openShiftUseCase.execute({

 userId,
 branchId,
 openingCash

});



return res.status(201).json({
 message:"Shift opened successfully",
 data:shift

});


}catch(error:any){
return res.status(400).json({

 message:error.message

});
}
});




// ======================================
// POST /shifts/close
// ======================================

router.post(
"/close",
authMiddleware,
async(req:Request,res:Response)=>{

try{


const {
 shiftId,
 actualCash
}=req.body;



const result =
await closeShiftUseCase.execute({

 shiftId,
 actualCash

});



return res.json({

 message:"Shift closed successfully",

 data:result

});


}catch(error:any){

return res.status(400).json({

 message:error.message

});

}


});




// ======================================
// GET /shifts/current
// ======================================

router.get(
"/current",
authMiddleware,
async(req:Request,res:Response)=>{

try{


const userId =
(req as any).user.id;



const shift =
await shiftRepo.findOpenByUserId(
 userId
);



if(!shift){

return res.status(404).json({

 message:"No active shift"

});

}



return res.json({

 data:shift

});


}catch(error:any){

return res.status(500).json({

 message:error.message

});
}
});

// ======================================
// GET /shifts/report/:id
// ======================================

router.get(
"/report/:id",
authMiddleware,
async(req:Request,res:Response)=>{

try{
const shiftId =
String(req.params.id);
const report =
await reportUseCase.execute(
 shiftId
);



return res.json({

 message:"Shift report",

 data:report
});
}catch(error:any){

return res.status(400).json({
 message:error.message
});
}


});

export default router;
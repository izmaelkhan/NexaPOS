import { Shift, ShiftStatus } from "../../domain/shifts/Shift";


type CloseShiftInput = {
  shiftId: string;
  actualCash: number;
};


type CashDrawer = {
  calculateExpectedCash(
    shiftId: string
  ): Promise<{
    expectedCash: number;
  }>;
};


export class CloseShiftUseCase {

  constructor(
    private readonly shiftRepo: {
      findById(id:string):Promise<Shift | null>;
      save(shift:Shift):Promise<void>;
    },

    private readonly cashDrawerService: CashDrawer,

    private readonly auditLogger?: {
      log(data:any):void;
    }
  ){}



  async execute(input:CloseShiftInput){

    const {
      shiftId,
      actualCash
    } = input;


    const shift =
      await this.shiftRepo.findById(
        shiftId
      );


    if(!shift){
      throw new Error(
        "Shift not found"
      );
    }


    if(
      shift.status !== ShiftStatus.OPEN
    ){
      throw new Error(
        "Only open shifts can be closed"
      );
    }


    if(actualCash < 0){
      throw new Error(
        "Actual cash cannot be negative"
      );
    }



    const expected =
      await this.cashDrawerService
      .calculateExpectedCash(
        shiftId
      );


    const expectedCash =
      expected.expectedCash;



    const difference =
      actualCash - expectedCash;



    shift.close({
      closingCash: actualCash,
      expectedCash,
    });



    await this.shiftRepo.save(
      shift
    );



    this.auditLogger?.log({
      type:"SHIFT_CLOSED",
      timestamp:new Date(),
      data:{
        shiftId,
        actualCash,
        expectedCash,
        difference
      }
    });



    return {

      success:true,

      shiftId:shift.id,

      status:shift.status,

      openingCash:
        shift.openingCash,

      closingCash:
        actualCash,

      expectedCash,

      difference

    };

  }

}
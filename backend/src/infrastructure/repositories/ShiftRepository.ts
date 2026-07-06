import { Shift } from "../../domain/shifts/Shift";
import { ShiftStatus } from "../../domain/shifts/Shift";

export class ShiftRepository {

  private shifts: Shift[] = [];


  // =========================
  // FIND OPEN SHIFT BY USER
  // =========================

  async findOpenByUserId(
    userId:string
  ):Promise<Shift | null>{

    return (
      this.shifts.find(
        shift =>
          shift.userId === userId &&
          shift.status === ShiftStatus.OPEN
      )
      ?? null
    );

  }



  // =========================
  // FIND SHIFT
  // =========================

  async findById(
    id:string
  ):Promise<Shift | null>{

    return (
      this.shifts.find(
        shift=>shift.id===id
      )
      ?? null
    );

  }



  // =========================
  // SAVE SHIFT
  // =========================

  async save(
    shift:Shift
  ):Promise<void>{

    const index =
      this.shifts.findIndex(
        x=>x.id===shift.id
      );


    if(index >= 0){

      this.shifts[index]=shift;

    }else{

      this.shifts.push(shift);

    }

  }



  // =========================
  // CASH MOVEMENTS PLACEHOLDER
  // =========================

  movementRepository = {

    findByShiftId:
    async(shiftId:string)=>{

      return [];

    },


    create:
    async(data:any)=>{

      return;

    }

  };


}
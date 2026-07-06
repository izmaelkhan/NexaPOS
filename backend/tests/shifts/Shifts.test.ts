import { OpenShiftUseCase } from "../../src/application/shifts/OpenShiftUseCase";
import { CloseShiftUseCase } from "../../src/application/shifts/CloseShiftUseCase";
import { CashDrawerService } from "../../src/application/shifts/CashDrawerService";

import { Shift, ShiftStatus } from "../../src/domain/shifts/Shift";


describe("Shift Management System", () => {

  const mockShiftRepo = {
    findOpenByUserId: jest.fn(),
    findById: jest.fn(),
    save: jest.fn(),
  };


  const mockMovementRepo = {
    findByShiftId: jest.fn(),
    create: jest.fn(),
  };


  // ✅ Proper Jest Mock
  const mockCashDrawerService = {
    calculateExpectedCash: jest.fn(),
  } as any;



  // =====================================
  // OPEN SHIFT TESTS
  // =====================================

  describe("Open Shift", () => {


    it("should open shift with valid opening cash", async () => {

      mockShiftRepo.findOpenByUserId
        .mockResolvedValue(null);


      const useCase =
        new OpenShiftUseCase(
          mockShiftRepo
        );


      const result =
        await useCase.execute({
          userId: "U1",
          branchId: "B1",
          openingCash: 1000,
        });


      expect(result.status)
        .toBe(ShiftStatus.OPEN);


      expect(mockShiftRepo.save)
        .toHaveBeenCalled();

    });



    it("should reject duplicate open shift", async () => {


      mockShiftRepo.findOpenByUserId
        .mockResolvedValue(
          new Shift({
            id:"S1",
            userId:"U1",
            branchId:"B1",
            openingCash:1000,
            status:ShiftStatus.OPEN,
            openedAt:new Date(),
          })
        );


      const useCase =
        new OpenShiftUseCase(
          mockShiftRepo
        );


      await expect(
        useCase.execute({
          userId:"U1",
          branchId:"B1",
          openingCash:500,
        })
      )
      .rejects
      .toThrow(
        "User already has an open shift"
      );

    });

  });




  // =====================================
  // CLOSE SHIFT TESTS
  // =====================================

  describe("Close Shift", () => {



    const createOpenShift = () =>
      new Shift({
        id:"S1",
        userId:"U1",
        branchId:"B1",
        openingCash:1000,
        status:ShiftStatus.OPEN,
        openedAt:new Date(),
      });



    it("should close shift with correct calculation", async()=>{


      mockShiftRepo.findById
        .mockResolvedValue(
          createOpenShift()
        );


      mockCashDrawerService
        .calculateExpectedCash
        .mockResolvedValue({
          expectedCash:5000
        });



      const useCase =
        new CloseShiftUseCase(
          mockShiftRepo,
          mockCashDrawerService
        );



      const result =
        await useCase.execute({
          shiftId:"S1",
          actualCash:5000,
        });



      expect(result.difference)
        .toBe(0);


      expect(mockShiftRepo.save)
        .toHaveBeenCalled();

    });





    it("should detect shortage cash", async()=>{


      mockShiftRepo.findById
        .mockResolvedValue(
          createOpenShift()
        );


      mockCashDrawerService
        .calculateExpectedCash
        .mockResolvedValue({
          expectedCash:5000
        });



      const useCase =
        new CloseShiftUseCase(
          mockShiftRepo,
          mockCashDrawerService
        );



      const result =
        await useCase.execute({
          shiftId:"S1",
          actualCash:4500,
        });



      expect(result.difference)
        .toBe(-500);

    });






    it("should detect excess cash", async()=>{


      mockShiftRepo.findById
        .mockResolvedValue(
          createOpenShift()
        );


      mockCashDrawerService
        .calculateExpectedCash
        .mockResolvedValue({
          expectedCash:5000
        });



      const useCase =
        new CloseShiftUseCase(
          mockShiftRepo,
          mockCashDrawerService
        );



      const result =
        await useCase.execute({
          shiftId:"S1",
          actualCash:5500,
        });



      expect(result.difference)
        .toBe(500);

    });


  });






  // =====================================
  // CASH MOVEMENT TESTS
  // =====================================

  describe("Cash Movement",()=>{


    it("should add cash",async()=>{


      const service =
        new CashDrawerService(
          mockMovementRepo,
          mockShiftRepo
        );


      await service.addCash({
        shiftId:"S1",
        amount:1000,
        reason:"cash in"
      });



      expect(
        mockMovementRepo.create
      )
      .toHaveBeenCalled();

    });






    it("should remove cash",async()=>{


      const service =
        new CashDrawerService(
          mockMovementRepo,
          mockShiftRepo
        );


      await service.removeCash({
        shiftId:"S1",
        amount:500,
        reason:"expense"
      });



      expect(
        mockMovementRepo.create
      )
      .toHaveBeenCalled();

    });


  });


});
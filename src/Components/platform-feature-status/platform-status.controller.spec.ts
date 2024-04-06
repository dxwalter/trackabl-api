import { Test, TestingModule } from "@nestjs/testing";
import { PlatformFeatureStatusController } from "./platform-status.controller";
import { PlatformFeatureStatusService } from "./platform-status.service";

describe("PlatformFeatureStatusController", () => {
  let controller: PlatformFeatureStatusController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlatformFeatureStatusController],
      providers: [PlatformFeatureStatusService],
    }).compile();

    controller = module.get<PlatformFeatureStatusController>(
      PlatformFeatureStatusController
    );
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});

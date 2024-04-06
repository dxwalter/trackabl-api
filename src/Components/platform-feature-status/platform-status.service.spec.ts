import { Test, TestingModule } from '@nestjs/testing';
import { PlatformStatusService } from './platform-status.service';

describe('PlatformStatusService', () => {
  let service: PlatformStatusService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PlatformStatusService],
    }).compile();

    service = module.get<PlatformStatusService>(PlatformStatusService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

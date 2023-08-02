import { Test, TestingModule } from '@nestjs/testing';
import { JobRunnerController } from './job-runner.controller';
import { JobRunnerService } from './job-runner.service';

describe('JobRunnerController', () => {
  let jobRunnerController: JobRunnerController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [JobRunnerController],
      providers: [JobRunnerService],
    }).compile();

    jobRunnerController = app.get<JobRunnerController>(JobRunnerController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(jobRunnerController.getHello()).toBe('Hello World!');
    });
  });
});

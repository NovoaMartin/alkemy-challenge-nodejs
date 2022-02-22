import * as chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import sinonChai from 'sinon-chai';
import { describe } from 'mocha';
import { createSandbox, SinonSandbox, SinonStubbedInstance } from 'sinon';
import { expect } from 'chai';
import { mockReq, mockRes } from 'sinon-express-mock';
import CharacterController from '../../../../src/modules/character/controller/CharacterController';
import CharacterService from '../../../../src/modules/character/service/CharacterService';
import CharacterListDTO from '../../../../src/modules/character/dto/characterListDTO';

chai.use(chaiAsPromised);
chai.use(sinonChai);

describe('characterController test', () => {
  let characterController : CharacterController;
  let characterService : SinonStubbedInstance<CharacterService>;
  let sandbox : SinonSandbox;
  beforeEach(() => {
    sandbox = createSandbox();
    characterService = sandbox.createStubInstance(CharacterService);
    characterController = new CharacterController(characterService);
  });
  afterEach(() => {
    sandbox.restore();
  });

  describe('getAll test', () => {
    it('calls service with correct parameters', async () => {
      await characterController.getAll(mockReq(), mockRes());
      expect(characterService.getAll).to.have.been.calledOnceWithExactly();
    });
    it('responds with correct data', async () => {
      const expectedResponse = [new CharacterListDTO('1', 'name', 'test')];
      characterService.getAll.resolves(expectedResponse);
      const resMock = mockRes();
      await characterController.getAll(mockReq(), resMock);
      expect(resMock.status).to.have.been.calledOnceWithExactly(200);
      expect(resMock.json).to.have.been.calledOnceWithExactly({ data: expectedResponse });
    });
  });
});

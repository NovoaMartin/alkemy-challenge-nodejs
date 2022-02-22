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
import Character from '../../../../src/modules/character/entity/Character';
import CharacterNotFoundException from '../../../../src/modules/character/exception/CharacterNotFoundException';

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

  describe('getById test', async () => {
    it('calls service with correct parameters', async () => {
      const req = mockReq({
        params: {
          id: 'id',
        },
      });
      const res = mockRes();

      await characterController.getById(req, res);
      expect(characterService.getById).to.have.been.calledOnceWithExactly('id');
    });
    it('responds with the character details if character is found', async () => {
      const expectedReturn = new Character('id', 'test', 'name', 'story', 42, 170);
      const req = mockReq({
        params: {
          id: 'id',
        },
      });
      const res = mockRes();
      characterService.getById.resolves(expectedReturn);
      await characterController.getById(req, res);
      expect(res.status).to.have.been.calledOnceWithExactly(200);
      expect(res.json).to.have.been.calledOnceWithExactly({ data: expectedReturn });
    });

    it('responds with error if no character is found', async () => {
      characterService.getById.callsFake(() => { throw new CharacterNotFoundException(); });
      const req = mockReq({
        params: {
          id: 'id',
        },
      });
      const res = mockRes();
      await characterController.getById(req, res);
      expect(res.status).to.have.been.calledOnceWithExactly(404);
      expect(res.json).to.have.been.calledOnceWithExactly({ data: {}, err: { msg: 'Character not found' } });
    });
    it('responds with error if no id is specified', async () => {
      const res = mockRes();
      await characterController.getById(mockReq(), res);
      expect(res.status).to.have.been.calledOnceWithExactly(404);
      expect(res.json).to.have.been.calledOnceWithExactly({ data: {}, err: { msg: 'No ID specified' } });
    });
  });

  describe('delete test', () => {
    it('responds with error if no id is specified', async () => {
      const res = mockRes();
      await characterController.delete(mockReq(), res);
      expect(res.status).to.have.been.calledOnceWithExactly(404);
      expect(res.json).to.have.been.calledOnceWithExactly({ data: {}, err: { msg: 'No ID specified' } });
    });
    it('calls service with correct parameters', async () => {
      const req = mockReq({
        params: {
          id: 'id',
        },
      });
      const res = mockRes();
      await characterController.delete(req, res);
      expect(characterService.delete).to.have.been.calledOnceWithExactly('id');
    });
    it('responds with status 200 if sucessfull', async () => {
      const req = mockReq({
        params: {
          id: 'id',
        },
      });
      const res = mockRes();
      characterService.delete.resolves(true);
      await characterController.delete(req, res);
      expect(res.status).to.have.been.calledOnceWithExactly(200);
      expect(res.json).to.have.been.calledOnceWithExactly({ data: { deleted: true } });
    });
    it('responds with status 404 if no character found', async () => {
      const req = mockReq({
        params: {
          id: 'id',
        },
      });
      const res = mockRes();
      characterService.delete.resolves(false);
      await characterController.delete(req, res);
      expect(res.status).to.have.been.calledOnceWithExactly(404);
      expect(res.json).to.have.been.calledOnceWithExactly({ data: { deleted: false } });
    });
  });
});
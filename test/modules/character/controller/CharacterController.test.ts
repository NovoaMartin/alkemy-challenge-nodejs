import * as chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import sinonChai from 'sinon-chai';
import { describe } from 'mocha';
import { createSandbox, SinonSandbox, SinonStubbedInstance } from 'sinon';
import { expect } from 'chai';
import { mockReq, mockRes } from 'sinon-express-mock';
import { v4 } from 'uuid';
import CharacterController from '../../../../src/modules/character/controller/CharacterController';
import CharacterService from '../../../../src/modules/character/service/CharacterService';
import CharacterListDTO from '../../../../src/modules/character/dto/characterListDTO';
import Character from '../../../../src/modules/character/entity/Character';
import CharacterNotFoundException from '../../../../src/modules/character/exception/CharacterNotFoundException';
import InvalidFilmGivenException from '../../../../src/modules/character/exception/InvalidFilmGivenException';

chai.use(chaiAsPromised);
chai.use(sinonChai);

describe('characterController test', () => {
  let characterController: CharacterController;
  let characterService: SinonStubbedInstance<CharacterService>;
  let sandbox: SinonSandbox;
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

  describe('create test', () => {
    describe('filters request body', () => {
      it('filters missing name', async () => {
        const req = mockReq({
          body: {
            story: 'shrekStory',
            age: 40,
            weight: 500,
            films: ['id1', 'id2'],
          },
        });

        const res = mockRes();
        await characterController.create(req, res);
        expect(res.status).to.have.been.calledOnceWithExactly(404);
        expect(res.json).to.have.been.calledOnceWithExactly({ data: {}, err: { msg: 'No name specified' } });
      });
      it('filters missing story', async () => {
        const req = mockReq({
          body: {
            name: 'shrek',
            age: 40,
            weight: 500,
            films: ['id1', 'id2'],
          },
        });

        const res = mockRes();
        await characterController.create(req, res);
        expect(res.status).to.have.been.calledOnceWithExactly(404);
        expect(res.json).to.have.been.calledOnceWithExactly({ data: {}, err: { msg: 'No story specified' } });
      });
    });

    it('Calls service with correct parameters', async () => {
      const req = mockReq({
        body: {
          name: 'shrek',
          story: 'shrekStory',
          age: 40,
          weight: 500,
          films: ['id1', 'id2'],
        },
      });

      const res = mockRes();
      await characterController.create(req, res);
      expect(characterService.save).to.have.been.calledOnceWithExactly({
        image: undefined, name: 'shrek', story: 'shrekStory', age: 40, weight: 500,
      }, ['id1', 'id2']);
    });
    it('Responds with the saved user', async () => {
      const req = mockReq({
        body: {
          name: 'shrek',
          story: 'shrekStory',
          age: 40,
          weight: 500,
          films: [],
        },
      });

      const res = mockRes();
      const character = new Character(v4(), 'test', 'shrek', 'shrekStory', 40, 500, []);
      characterService.save.resolves(character);

      await characterController.create(req, res);
      expect(res.status).to.have.been.calledOnceWithExactly(200);
      expect(res.json).to.have.been.calledOnceWithExactly({ data: character });
    });
    it('Responds with error if given an invalid film', async () => {
      const req = mockReq({
        body: {
          name: 'shrek',
          story: 'shrekStory',
          age: 40,
          weight: 500,
          films: ['id1'],
        },
      });

      const res = mockRes();
      characterService.save.callsFake(() => { throw new InvalidFilmGivenException(); });

      await characterController.create(req, res);
      expect(res.status).to.have.been.calledOnceWithExactly(404);
      expect(res.json).to.have.been.calledOnceWithExactly({ data: {}, err: { msg: 'Invalid film provided' } });
    });
  });

  describe('update test', () => {
    it('Filters invalid id', async () => {
      const res = mockRes();
      await characterController.update(mockReq(), res);
      expect(res.status).to.have.been.calledOnceWithExactly(404);
      expect(res.json).to.have.been.calledOnceWithExactly({ data: {}, err: { msg: 'Invalid ID specified' } });
    });
    it('Responds with the updated character', async () => {
      const req = mockReq({
        body: {
          name: 'shrek',
          story: 'shrekStory',
          age: 40,
          weight: 500,
          films: [],
        },
        params: {
          id: 'id',
        },
      });
      const res = mockRes();
      const character = new Character('id', 'test', 'shrek', 'shrekStory', 40, 500, []);
      characterService.save.resolves(character);
      characterService.getById.resolves(character);
      await characterController.update(req, res);
      expect(res.status).to.have.been.calledOnceWithExactly(200);
      expect(res.json).to.have.been.calledOnceWithExactly({
        data: character,
      });
    });
    it('Responds with error if given invalid film id', async () => {
      const req = mockReq({
        body: {
          films: ['id1', 'id2'],
        },
        params: {
          id: 'id',
        },
      });
      const res = mockRes();
      characterService.save.callsFake(() => { throw new InvalidFilmGivenException(); });

      await characterController.update(req, res);
      expect(res.status).to.have.been.calledOnceWithExactly(404);
      expect(res.json).to.have.been.calledOnceWithExactly({ data: {}, err: { msg: 'Invalid film id provided' } });
    });
  });
});

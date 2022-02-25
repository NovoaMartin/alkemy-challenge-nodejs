import { createSandbox, SinonSandbox, SinonStubbedInstance } from 'sinon';
import { expect } from 'chai';
import sinonChai from 'sinon-chai';
import chaiAsPromised from 'chai-as-promised';
import * as chai from 'chai';
import CharacterService from '../../../../src/modules/character/service/CharacterService';
import CharacterRepository from '../../../../src/modules/character/repository/CharacterRepository';
import CharacterListDTO from '../../../../src/modules/character/dto/characterListDTO';
import Character from '../../../../src/modules/character/entity/Character';

chai.use(sinonChai);
chai.use(chaiAsPromised);

describe('CharacterService test', () => {
  let characterService: CharacterService;
  let characterRepository : SinonStubbedInstance<CharacterRepository>;
  let sandbox : SinonSandbox;
  beforeEach(() => {
    sandbox = createSandbox();
    characterRepository = sandbox.createStubInstance(CharacterRepository);
    characterService = new CharacterService(characterRepository);
  });
  afterEach(() => sandbox.restore());

  describe('getAll test', () => {
    it('calls characterRepository with the correct parameters', async () => {
      await characterService.getAll({});
      expect(characterRepository.search).to.have.been.calledOnceWithExactly({
        name: undefined, age: undefined, weight: undefined, filmName: undefined,
      });
    });
    it('returns the correct data', async () => {
      const expectedReturn = [new CharacterListDTO('1', 'name', 'test')];
      characterRepository.search.resolves(expectedReturn);
      const result = await characterService.getAll({});
      expect(result).to.be.deep.eq(expectedReturn);
    });
  });

  describe('getById test', () => {
    it('calls characterRepository with the correct parameters', async () => {
      await characterService.getById('test');
      expect(characterRepository.getById).to.have.been.calledOnceWithExactly('test');
    });
    it('returns the correct data', async () => {
      const expectedReturn = new Character('id', 'test', 'name', 'story', 42, 170, []);
      characterRepository.getById.resolves(expectedReturn);
      const result = await characterService.getById('id');
      expect(result).to.be.deep.eq(expectedReturn);
    });
  });

  describe('delete test', () => {
    it('calls characterRepository with the correct parameters', async () => {
      await characterService.delete('test');
      expect(characterRepository.delete).to.have.been.calledOnceWithExactly('test');
    });
    it('returns the correct data', async () => {
      const expectedReturn = true;
      characterRepository.delete.resolves(expectedReturn);
      const result = await characterService.delete('id');
      expect(result).to.be.eq(expectedReturn);
    });
  });

  describe('save test', () => {
    it('calls characterRepository with the correct parameters', async () => {
      const character = new Character('id', 'test', 'name', 'story', 42, 170, []);
      await characterService.save(character, ['id1', 'id2']);
      expect(characterRepository.save).to.have.been.calledOnceWithExactly(character, ['id1', 'id2']);
    });
    it('returns the correct data', async () => {
      const expectedReturn = new Character('id', 'test', 'name', 'story', 42, 170, []);
      characterRepository.save.resolves(expectedReturn);
      const result = await characterService.save(expectedReturn, []);
      expect(result).to.be.eq(expectedReturn);
    });
  });
});

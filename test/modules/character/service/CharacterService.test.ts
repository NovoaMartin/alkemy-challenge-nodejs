import { createSandbox, SinonSandbox, SinonStubbedInstance } from 'sinon';
import { expect } from 'chai';
import sinonChai from 'sinon-chai';
import chaiAsPromised from 'chai-as-promised';
import * as chai from 'chai';
import CharacterService from '../../../../src/modules/character/service/CharacterService';
import CharacterRepository from '../../../../src/modules/character/repository/CharacterRepository';
import CharacterListDTO from '../../../../src/modules/character/dto/characterListDTO';

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
      await characterService.getAll();
      expect(characterRepository.getAll).to.have.been.calledOnceWithExactly();
    });
    it('returns the correct data', async () => {
      const expectedReturn = [new CharacterListDTO('1', 'name', 'test')];
      characterRepository.getAll.resolves(expectedReturn);
      const result = await characterService.getAll();
      expect(result).to.be.deep.eq(expectedReturn);
    });
  });
});

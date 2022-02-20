import * as chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { describe } from 'mocha';
import { createSandbox, SinonSandbox } from 'sinon';
import { Sequelize } from 'sequelize-typescript';
import { expect } from 'chai';
import { v4 } from 'uuid';
import CharacterRepository from '../../../../src/modules/character/repository/CharacterRepository';
import CharacterModel from '../../../../src/models/CharacterModel';
import Character from '../../../../src/modules/character/entity/Character';
import CharacterNotFoundException from '../../../../src/modules/character/exception/CharacterNotFoundException';
import FilmModel from '../../../../src/models/FilmModel';
import GenreModel from '../../../../src/models/GenreModel';
import { UserModel } from '../../../../src/modules/auth/module';
import { fromModelToCharacter } from '../../../../src/modules/character/mapper/characterMapper';
import CharacterFilm  from '../../../../src/models/CharacterFilm';

chai.use(chaiAsPromised);

describe('CharacterRepository test', () => {
  let characterRespository : CharacterRepository;
  let sandbox : SinonSandbox;
  beforeEach(async () => {
    sandbox = createSandbox();
    const sequelizeInstance : Sequelize = new Sequelize('sqlite::memory');
    sequelizeInstance.addModels([UserModel, CharacterModel, FilmModel, GenreModel, CharacterFilm]);
    await sequelizeInstance.sync({ force: true });
    characterRespository = new CharacterRepository(CharacterModel);
  });
  afterEach(() => {
    sandbox.restore();
  });

  it('test', async () => {
    const char1 : Partial<Character> = new Character(v4(), 'none', 'name', 'sry', 1, 1, []);
    const charModel = await CharacterModel.create(char1, { isNewRecord: true });
    const filmModel = await FilmModel.create({
      id: v4(), image: 'none', title: 'title', releaseDate: new Date(),
    });
    await charModel.addFilm(filmModel);
    const retrieve = await CharacterModel.findAll({ });
    const res = await fromModelToCharacter(retrieve[0]);
    console.log(res);
  });

  describe('getAll test', () => {
    it('returns an empty array if no character is found', async () => {
      const result = await characterRespository.getAll();
      expect(result).to.deep.eq([]);
    });
    it('returns an array of dtos', async () => {
      const char1 : Partial<Character> = new Character(v4(), 'none', 'name', 'story', 1, 1);
      const char2 : Partial<Character> = new Character(v4(), 'none', 'shrek', 'story', 1, 1);

      await CharacterModel.create(char1, { isNewRecord: true });
      await CharacterModel.create(char2, { isNewRecord: true });

      const expectedResult = [{ id: char1.id, name: char1.name, image: char1.image },
        { id: char2.id, name: char2.name, image: char2.image }];

      const result = await characterRespository.getAll();
      expect(result).to.deep.eq(expectedResult);
    });
  });

  describe('getById test', () => {
    it('throws error if no character is found', async () => {
      expect(characterRespository.getById('')).to.be.rejectedWith(CharacterNotFoundException);
    });
    it('returns the found character', async () => {
      const char1 : Partial<Character> = new Character(v4(), 'none', 'name', 'story', 1, 1, []);
      await CharacterModel.create(char1, { isNewRecord: true });
      const result = await characterRespository.getById(char1.id!);
      expect(result).to.deep.eq(char1);
    });
  });

  describe('save test', () => {
    it('persists a new character', async () => {
      await characterRespository.save(new Character(null, 'shrek.png', 'shrek', 'shrekStory'));
      const result = await CharacterModel.findOne({ where: { name: 'shrek' } });
      expect(result).to.have.property('id').to.not.be.null;
    });

    it('updates a character', async () => {
      const characterData : Partial<Character> = {
        id: v4(), name: 'shrek', image: 'shrek.jpg', story: 'shrekStory',
      };
      const characterModel = await CharacterModel.build(characterData, { isNewRecord: true });
      await characterModel.save();

      await characterRespository.save({ ...characterData, story: 'updatedField' });

      const result = await CharacterModel.findByPk(characterData.id!);
      expect(result).to.have.property('story').to.be.eq('updatedField');
    });
  });

  describe('delete test', () => {
    it('deletes the character', async () => {
      const char1 : Partial<Character> = new Character(v4(), 'none', 'name', 'story', 1, 1);
      await CharacterModel.create(char1, { isNewRecord: true });
      const returnValue = await characterRespository.delete(char1.id!);
      const result = await CharacterModel.findByPk(char1.id!);
      expect(result).to.be.null;
      expect(returnValue).to.be.true;
    });
    it('returns false if no character was deleted', async () => {
      const result = await characterRespository.delete('');
      expect(result).to.be.false;
    });
  });

  describe('search test', () => {
    const char1 : Partial<Character> = new Character(v4(), 'none', 'name', 'story', 1, 1);
    const char2 : Partial<Character> = new Character(v4(), 'none', 'shrek', 'story', 1, 4);
    const char3 : Partial<Character> = new Character(v4(), 'none', 'fiona', 'story', 2, 4);
    let charModel1: CharacterModel;
    beforeEach(async () => {
      charModel1 = await CharacterModel.create(char1, { isNewRecord: true });
       await CharacterModel.create(char2, { isNewRecord: true });
       await CharacterModel.create(char3, { isNewRecord: true });
    });
    it('searches by age', async () => {
      const result = await characterRespository.search({age:1});
      const expectedResult = [
        { id: char1.id, name: char1.name, image: char1.image },
        { id: char2.id, name: char2.name, image: char2.image }];
      expect(result).to.deep.eq(expectedResult);
    });
    it('searches by weight', async () => {
      const result = await characterRespository.search({weight:4});
      const expectedResult = [
        { id: char2.id, name: char2.name, image: char2.image },
        { id: char3.id, name: char3.name, image: char3.image }];
      expect(result).to.deep.eq(expectedResult);
    });
    it('searches by name', async () => {
      const result = await characterRespository.search({name:"on"});
      const expectedResult = [{ id: char3.id, name: char3.name, image: char3.image }];
      expect(result).to.deep.eq(expectedResult);
    });
    it("searches by associated film", async()=>{
      const filmModel1 = await FilmModel.create(
        {id:v4(), title:"example", image:"testImage.jpg", releaseDate : new Date(), rating:5},{isNewRecord:true})
      await charModel1.addFilm(filmModel1);

      const result = await characterRespository.search({filmName:"xampl"});
       expect(result).to.be.deep.eq([{id:char1.id, name:char1.name, image:char1.image}]);
    })
    it('returns empty array if no character is found', async () => {
      const result = await characterRespository.search({name:"invalidName"});
      expect(result).to.deep.eq([]);
    });
  });
});

import { v4 } from 'uuid';
import { Op } from 'sequelize';
import CharacterModel from '../../../models/CharacterModel';
import CharacterListDTO from '../dto/characterListDTO';
import { fromModelToCharacter, fromModelToCharacterList } from '../mapper/characterMapper';
import CharacterNotFoundException from '../exception/CharacterNotFoundException';
import Character from '../entity/Character';
import FilmModel from '../../../models/FilmModel';
import InvalidFilmGivenException from '../exception/InvalidFilmGivenException';

interface ISearchParams {
  name?: string | null;
  age?: number | null;
  weight?: number | null;
  filmName?: string | null;
}

export default class CharacterRepository {
  constructor(private characterModel: typeof CharacterModel, private filmModel: typeof FilmModel) {}

  async getAll(): Promise<CharacterListDTO[]> {
    return (await this.characterModel.findAll({ attributes: ['id', 'name', 'image'] })).map(
      (item) => fromModelToCharacterList(item),
    );
  }

  async getById(id: string): Promise<Character> {
    const result = await this.characterModel.findByPk(id, { include: FilmModel });
    if (!result) throw new CharacterNotFoundException();
    return fromModelToCharacter(result);
  }

  async save(character: Partial<Character>, associatedFilms?: string[]) {
    let films: FilmModel[] = [];
    if (associatedFilms) {
      films = await this.filmModel.findAll({
        where: {
          id: { [Op.in]: associatedFilms },
        },
      });
      if (films.length !== associatedFilms.length) throw new InvalidFilmGivenException();
    }

    const isNewRecord = !character.id;
    if (isNewRecord) {
      character.id = v4();
    }
    const instance = this.characterModel.build(character, { isNewRecord });
    await instance.save();
    await instance.setFilms(films);
    return fromModelToCharacter(await instance.reload());
  }

  async delete(id: string) {
    return !!(await this.characterModel.destroy({ where: { id } }));
  }

  async search({
    name, age, weight, filmName,
  }: ISearchParams) {
    const whereCondition: any = {};
    let includeCondition: any = [];
    if (name) {
      whereCondition.name = { [Op.like]: `%${name}%` };
    }
    if (age) {
      whereCondition.age = age;
    }
    if (weight) {
      whereCondition.weight = weight;
    }
    if (filmName) {
      includeCondition = [
        { model: FilmModel, where: { title: { [Op.like]: `%${filmName}%` } } },
      ];
    }
    return (await this.characterModel.findAll({ attributes: ['id', 'name', 'image'], where: whereCondition, include: includeCondition }))
      .map(
        (item) => fromModelToCharacterList(item),
      );
  }
}

import CharacterRepository from '../repository/CharacterRepository';
import CharacterListDTO from '../dto/characterListDTO';
import Character from '../entity/Character';

interface ISearchParams {
  name?: string | null;
  age?: number | null;
  weight?: number | null;
  filmName?: string | null;
}

export default class CharacterService {
  constructor(private characterRepository : CharacterRepository) {}

  async getAll({
    name, age, weight, filmName,
  }: ISearchParams) : Promise<CharacterListDTO[]> {
    return this.characterRepository.search({
      name, age, weight, filmName,
    });
  }

  async getById(id : string) : Promise<Character> {
    return this.characterRepository.getById(id);
  }

  async delete(id: string) {
    return this.characterRepository.delete(id);
  }

  async save(character : Partial<Character>, associatedFilm : string[]) {
    return this.characterRepository.save(character, associatedFilm);
  }
}

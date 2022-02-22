import CharacterRepository from '../repository/CharacterRepository';
import CharacterListDTO from '../dto/characterListDTO';
import Character from '../entity/Character';

export default class CharacterService {
  constructor(private characterRepository : CharacterRepository) {}

  async getAll() : Promise<CharacterListDTO[]> {
    return this.characterRepository.getAll();
  }

  async getById(id : string) : Promise<Character> {
    return this.characterRepository.getById(id);
  }

  async delete(id: string) {
    return this.characterRepository.delete(id);
  }

  async save(character : Character, associatedFilm : string[]) {
    return this.characterRepository.save(character, associatedFilm);
  }
}

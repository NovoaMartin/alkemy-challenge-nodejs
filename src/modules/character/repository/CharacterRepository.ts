import { v4 } from 'uuid';
import CharacterModel from '../model/CharacterModel';
import CharacterListDTO from '../dto/characterListDTO';
import { fromModelToCharacter, fromModelToCharacterList } from '../mapper/characterMapper';
import CharacterNotFoundException from '../exception/CharacterNotFoundException';
import Character from '../entity/Character';

export default class CharacterRepository {
  constructor(private characterModel : typeof CharacterModel) {}

  async getAll() : Promise<CharacterListDTO[]> {
    return (await this.characterModel.findAll({ attributes: ['id', 'name', 'image'] })).map(
      (item) => fromModelToCharacterList(item),
    );
  }

  async getById(id : string) : Promise<Character> {
    const result = await this.characterModel.findByPk(id);
    if (!result) throw new CharacterNotFoundException();
    return fromModelToCharacter(result);
  }

  async save(character : Partial<Character>) {
    const isNewRecord = !character.id;
    if (isNewRecord) {
      character.id = v4();
    }
    const instance = this.characterModel.build(character, { isNewRecord });
    return (await instance.save()).toJSON();
  }

  async delete(id : string) {
    return !!(await this.characterModel.destroy({ where: { id } }));
  }
}

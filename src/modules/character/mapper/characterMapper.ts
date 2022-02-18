import CharacterModel from '../model/CharacterModel';
import Character from '../entity/Character';
import CharacterListDTO from '../dto/characterListDTO';

export function fromModelToCharacter(model: CharacterModel) {
  return new Character(
    model.getDataValue('id'),
    model.getDataValue('image'),
    model.getDataValue('name'),
    model.getDataValue('story'),
    model.getDataValue('age'),
    model.getDataValue('weight'),
  );
}

export function fromModelToCharacterList(model : CharacterModel) {
  return new CharacterListDTO(
    model.getDataValue('id'),
    model.getDataValue('name'),
    model.getDataValue('image'),
  );
}

import CharacterModel from '../../../models/CharacterModel';
import Character from '../entity/Character';
import CharacterListDTO from '../dto/characterListDTO';

export async function fromModelToCharacter(model: CharacterModel) : Promise<Character> {
  return new Character(
    model.id,
    model.image,
    model.name,
    model.story,
    model.age,
    model.weight,
    (await model.getFilms()).map((film) => (
      {  title: film.title, href: `${process.env.BASE_URL}/movies/${film.id}` })
    ),
  );
}

export function fromModelToCharacterList(model : CharacterModel) {
  return new CharacterListDTO(
    model.id,
    model.name,
    model.image,
  );
}

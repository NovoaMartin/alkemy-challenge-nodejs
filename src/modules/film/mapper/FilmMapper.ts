import FilmModel from '../../../models/FilmModel';
import Film from '../entity/Film';

export default async function fromModelToFilm(model : FilmModel) {
  const { id, name } = await model.getGenre();
  return new Film(
    model.id,
    model.image,
    model.title,
    model.releaseDate,
    model.rating,
    { name, href:`${process.env.BASE_URL}/genres/${id}` },
    (await model.getCharacters()).map((item) => (
      { name: item.name, href:`${process.env.BASE_URL}/characters/${item.id}` }
    )),
  );
}

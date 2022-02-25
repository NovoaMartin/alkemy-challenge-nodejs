import { Application, Request, Response } from 'express';
import CharacterService from '../service/CharacterService';
import CharacterNotFoundException from '../exception/CharacterNotFoundException';
import validateToken from '../../../lib/auth';
import InvalidFilmGivenException from '../exception/InvalidFilmGivenException';

export default class CharacterController {
  ROUTE = '/characters';

  constructor(private characterService : CharacterService) {}

  /* istanbul ignore next */
  configureRoutes(app : Application) {
    app.get(`${this.ROUTE}`, validateToken, this.getAll.bind(this));
    app.get(`${this.ROUTE}/:id`, validateToken, this.getById.bind(this));
    app.delete(`${this.ROUTE}/:id`, validateToken, this.delete.bind(this));
    app.post(`${this.ROUTE}`, validateToken, this.create.bind(this));
    app.patch(`${this.ROUTE}/:id`, validateToken, this.update.bind(this));
  }

  async getAll(req : Request, res: Response) {
    const data = await this.characterService.getAll();
    return res.status(200).json({ data });
  }

  async getById(req : Request, res:Response) {
    if (!req.params.id) {
      return res.status(404).json({ data: {}, err: { msg: 'No ID specified' } });
    }
    let data;
    try {
      data = await this.characterService.getById(req.params.id);
    } catch (e) {
      if (e instanceof CharacterNotFoundException) {
        return res.status(404).json({ data: {}, err: { msg: 'Character not found' } });
      }
    }
    return res.status(200).json({ data });
  }

  async delete(req: Request, res:Response) {
    if (!req.params.id) {
      return res.status(404).json({ data: {}, err: { msg: 'No ID specified' } });
    }
    const deleted = await this.characterService.delete(req.params.id);
    return res.status(deleted ? 200 : 404).json({ data: { deleted } });
  }

  async create(req : Request, res:Response) {
    const {
      name, story, weight, age, films,
    } = req.body;
    if (!name) {
      return res.status(404).json({ data: {}, err: { msg: 'No name specified' } });
    }
    if (!story) {
      return res.status(404).json({ data: {}, err: { msg: 'No story specified' } });
    }

    const image = req.file?.path;

    let result;
    try {
      result = await this.characterService.save({
        image, name, story, age, weight,
      }, films || []);
    } catch (e) {
      if (e instanceof InvalidFilmGivenException) return res.status(404).json({ data: {}, err: { msg: 'Invalid film provided' } });
    }
    return res.status(200).json({ data: result });
  }

  async update(req: Request, res: Response) {
    const {
      name, story, weight, age,
    } = req.body;
    let { films } = req.body;
    const image = req.file?.path;
    const { id } = req.params;
    if (!id) return res.status(404).json({ data: {}, err: { msg: 'Invalid ID specified' } });

    const existingCharacter = await this.characterService.getById(id);
    if (!id) return res.status(404).json({ data: {}, err: { msg: 'Invalid ID specified' } });

    if (!Array.isArray(films)) {
      films = existingCharacter.films?.map((film) => film.href.split('/movies/')[1]);
    }
    let result;
    try {
      result = await this.characterService.save({
        id,
        name: name || existingCharacter.name,
        image: image || existingCharacter.image,
        story: story || existingCharacter.story,
        weight: weight || existingCharacter.weight,
        age: age || existingCharacter.age,
      }, films);
    } catch (e) {
      return res.status(404).json({ data: {}, err: { msg: 'Invalid film id provided' } });
    }

    return res.status(200).json({ data: result });
  }
}

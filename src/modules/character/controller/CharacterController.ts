import { Application, Request, Response } from 'express';
import CharacterService from '../service/CharacterService';
import CharacterNotFoundException from '../exception/CharacterNotFoundException';
import validateToken from '../../../lib/auth';

export default class CharacterController {
  ROUTE = '/characters';

  constructor(private characterService : CharacterService) {}

  configureRoutes(app : Application) {
    app.get(`${this.ROUTE}`, validateToken, this.getAll.bind(this));
    app.get(`${this.ROUTE}/:id`, validateToken, this.getById.bind(this));
    app.delete(`${this.ROUTE}/:id`, validateToken, this.delete.bind(this));
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
}

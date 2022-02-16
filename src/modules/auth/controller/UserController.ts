import { Application, Request, Response } from 'express';
import { validate as emailValidator } from 'email-validator';
import UserService from '../service/UserService';
import User from '../entity/User';

export default class UserController {
  private readonly ROUTE : string;

  constructor(private userService : UserService) {
    this.ROUTE = '/auth';
  }

  /* istanbul ignore next */
  configureRoutes(app : Application) {
    console.log('Reached');
    app.post(`${this.ROUTE}/register`, this.register.bind(this));
    app.post(`${this.ROUTE}/login`, this.signIn.bind(this));
  }

  async register(req : Request, res : Response) {
    console.log('REgister');
    const { username, password, email } = req.body;

    if (!username) {
      return res.status(400).json({ data: {}, err: { msg: 'No username specified' } });
    }
    if (!password) {
      return res.status(400).json({ data: {}, err: { msg: 'No password specified' } });
    }
    if (!email) {
      return res.status(400).json({ data: {}, err: { msg: 'No email specified' } });
    }
    if (username.length < 6) {
      return res.status(400).json({ data: {}, err: { msg: 'Username too short' } });
    }
    if (password.length < 6) {
      return res.status(400).json({ data: {}, err: { msg: 'Password too short' } });
    }
    if (!emailValidator(email)) {
      return res.status(400).json({ data: {}, err: { msg: 'Invalid email' } });
    }

    let existingUser;
    try {
      existingUser = await this.userService.getByName(req.body.username);
    } catch (e) {
      existingUser = null;
    }

    if (existingUser) {
      return res.status(400).json({ data: {}, err: { msg: 'Username already registered' } });
    }

    const savedUser : User = await this.userService.add({ username, password, email });
    await this.userService.sendWelcomeEmail(savedUser);

    return res.status(200).json({
      data: {
        id: savedUser.id,
      },
    });
  }

  async signIn(req : Request, res : Response) {
    const { username, password } = req.body;
    if (!username) {
      return res.status(400).json({ data: {}, err: { msg: 'No username specified' } });
    }
    if (!password) {
      return res.status(400).json({ data: {}, err: { msg: 'No password specified' } });
    }
    let token;
    try {
      token = await this.userService.signIn(username, password);
    } catch (e) {
      return res.status(400).json({ data: {}, err: { msg: 'Invalid credentials' } });
    }
    return res.status(200).json({ data: { token } });
  }
}

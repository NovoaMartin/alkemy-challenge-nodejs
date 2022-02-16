import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { MailService } from '@sendgrid/mail';
import UserRepository from '../repository/UserRepository';
import User from '../entity/User';
import UserNotFoundException from '../exception/UserNotFoundException';
import IncorrectPasswordException from '../exception/IncorrectPasswordException';

export default class UserService {
  constructor(
    private userRepository : UserRepository,
    private encryption: typeof bcrypt,
    private emailService: MailService,
  ) { }

  async getByName(username : string) : Promise<User> {
    return this.userRepository.getByName(username);
  }

  async add(user : Partial<User> & { password:string }) : Promise<User> {
    user.password = await this.encryption.hash(user.password, 10);
    return this.userRepository.save(user);
  }

  async signIn(username: string, password: string) : Promise<string> {
    const user = await this.getByName(username);
    if (!user) {
      throw new UserNotFoundException();
    }
    const passwordsMatch = await this.encryption.compare(password, user.password);
    if (!passwordsMatch) {
      throw new IncorrectPasswordException();
    }
    return jwt.sign({ id: user.id }, process.env.TOKEN_SECRET!, { expiresIn: '7d' });
  }

  async sendWelcomeEmail(user: User) {
    const msg = {
      to: user.email,
      from: process.env.SENDER_EMAIL!,
      subject: `Welcome ${user.username} to disney world api`,
      html: `
        <strong>Welcome ${user.username}</strong>\n 
        <p>You have succesfully registered to the disney world api</p>\n
        <p>This is a challenge for alkemy node.js acceleration</p>
        \n\n<p>You signed up at: ${user.createdAt}</p>
        `,
    };
    return this.sendEmail(msg);
  }

  async sendEmail(msg : { to: string, from:string, subject: string, html:string }) {
    return this.emailService.send(msg);
  }
}

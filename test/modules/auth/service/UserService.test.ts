import * as chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import sinonChai from 'sinon-chai';
import { describe } from 'mocha';
import { createSandbox, SinonSandbox, SinonStubbedInstance } from 'sinon';
import { expect } from 'chai';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { MailService } from '@sendgrid/mail';
import UserRepository from '../../../../src/modules/auth/repository/UserRepository';
import User from '../../../../src/modules/auth/entity/User';
import UserService from '../../../../src/modules/auth/service/UserService';
import UserNotFoundException from '../../../../src/modules/auth/exception/UserNotFoundException';
import IncorrectPasswordException from '../../../../src/modules/auth/exception/IncorrectPasswordException';

chai.use(chaiAsPromised);
chai.use(sinonChai);

describe('UserService tests', () => {
  let userService: UserService;
  let userRepository: SinonStubbedInstance<UserRepository>;
  let mailService : SinonStubbedInstance<MailService>;
  let sandbox: SinonSandbox;
  beforeEach(() => {
    sandbox = createSandbox();
    userRepository = sandbox.createStubInstance(UserRepository);
    mailService = sandbox.createStubInstance(MailService);
    userService = new UserService(userRepository, bcrypt, mailService);
  });
  afterEach(() => {
    sandbox.restore();
  });

  describe('getByName test', () => {
    it('calls repository correctly', async () => {
      await userService.getByName('name');
      expect(userRepository.getByName).to.have.been.calledOnceWithExactly('name');
    });
  });

  describe('add test', () => {
    it('calls repository with correct values', async () => {
      const userData = new User(null, 'name', 'pass', 'test');
      await userService.add(userData);
      expect(userRepository.save).to.have.been.calledOnceWith(userData);
      expect(bcrypt.compare('pass', userData.password)).to.eventually.be.true;
    });
    it('returns the user', async () => {
      const userData = new User(null, 'name', 'pass', 'test');
      userRepository.save.resolves(userData);
      const result = await userService.add(userData);
      expect(result).to.deep.eq(userData);
    });
  });

  describe('signIn test', () => {
    it('calls repository with correct value', async () => {
      try {
        await userService.signIn('name', 'password');
      } catch (e) {
        // Should throw exception userNotFound after calling repository
      }
      expect(userRepository.getByName).to.have.been.calledOnceWithExactly('name');
    });
    it('throws with incorrect password', async () => {
      const userData = new User('1', 'user', 'password', 'test');
      userRepository.getByName.resolves(userData);
      const promise = userService.signIn('user', 'incorrectPassword');
      expect(promise).to.be.rejectedWith(IncorrectPasswordException);
    });
    it('throws with incorrect username', async () => {
      const userData = new User('1', 'user', 'password', 'test');
      userRepository.getByName.resolves(userData);
      const promise = userService.signIn('incorrectUsername', 'password');
      expect(promise).to.be.rejectedWith(UserNotFoundException);
    });

    it('returns a valid jwt on success', async () => {
      process.env.TOKEN_SECRET = 'asd';
      const userData = new User('1', 'user', 'password', 'test');
      userData.password = bcrypt.hashSync(userData.password, 10);
      userRepository.getByName.resolves(userData);

      const token = await userService.signIn('user', 'password') || '';
      const result = jwt.verify(token, process.env.TOKEN_SECRET);

      expect(result).to.have.property('id', '1');
      expect(result).to.have.property('exp');
    });
  });

  describe('sendWelcomeEmail test', () => {
    it('calls sendEmail with correct parameter', async () => {
      const userData = new User('1', 'name', 'pass', 'test@test.test', '1/1/2020');
      await userService.sendWelcomeEmail(userData);

      expect(mailService.send).to.have.been.calledOnce;
      const parameter = mailService.send.getCalls()[0].args[0];
      expect(parameter).to.have.property('to', 'test@test.test');
      expect(parameter).to.have.property('from', process.env.SENDER_EMAIL);
      expect(parameter).to.have.property('subject', `Welcome ${userData.username} to disney world api`);
      expect(parameter).to.have.property('html');
    });
  });
});

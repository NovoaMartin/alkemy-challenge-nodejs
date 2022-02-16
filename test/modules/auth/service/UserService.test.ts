import * as chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import sinonChai from 'sinon-chai';
import { describe } from 'mocha';
import { createSandbox, SinonSandbox, SinonStubbedInstance } from 'sinon';
import { expect } from 'chai';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import UserRepository from '../../../../src/modules/auth/repository/UserRepository';
import User from '../../../../src/modules/auth/entity/User';
import UserService from '../../../../src/modules/auth/service/UserService';

chai.use(chaiAsPromised);
chai.use(sinonChai);

describe('UserService tests', () => {
  let userService: UserService;
  let userRepository: SinonStubbedInstance<UserRepository>;
  let sandbox: SinonSandbox;
  beforeEach(() => {
    sandbox = createSandbox();
    userRepository = sandbox.createStubInstance(UserRepository);
    userService = new UserService(userRepository, bcrypt, null);
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
      await userService.signIn('name', 'password');
      expect(userRepository.getByName).to.have.been.calledOnceWithExactly('name');
    });
    it('returns null with incorrect password', async () => {
      const userData = new User('1', 'user', 'password', 'test');
      userRepository.getByName.resolves(userData);
      const result = await userService.signIn('user', 'incorrectPassword');

      expect(result).to.be.null;
    });
    it('returns null with incorrect username', async () => {
      const userData = new User('1', 'user', 'password', 'test');
      userRepository.getByName.resolves(userData);
      const result = await userService.signIn('incorrectUsername', 'password');

      expect(result).to.be.null;
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
});

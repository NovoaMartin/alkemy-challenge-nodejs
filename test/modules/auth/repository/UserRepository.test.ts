import * as chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { describe } from 'mocha';
import { createSandbox, SinonSandbox } from 'sinon';
import { Sequelize } from 'sequelize';
import { expect } from 'chai';
import { v4 } from 'uuid';
import UserRepository from '../../../../src/modules/auth/repository/UserRepository';
import UserModel from '../../../../src/modules/auth/model/UserModel';
import User from '../../../../src/modules/auth/entity/User';
import UserNotFoundException from '../../../../src/modules/auth/exception/UserNotFoundException';

chai.use(chaiAsPromised);

describe('UserRepository test', () => {
  let userRepository : UserRepository;
  let sandbox : SinonSandbox;
  beforeEach(async () => {
    sandbox = createSandbox();
    await UserModel.setup(new Sequelize('sqlite::memory')).sync({ force: true });
    userRepository = new UserRepository(UserModel);
  });
  afterEach(() => {
    sandbox.restore();
  });
  describe('getByName test', () => {
    it('throws exception if no user is found', async () => {
      sandbox.stub(UserModel, 'findOne').resolves(null);
      expect(userRepository.getByName('name')).to.be.rejectedWith(UserNotFoundException);
    });
    it('returns the user', async () => {
      const userData: Partial<User> = new User('1', 'name', 'pass', 'test');
      const userModel = UserModel.build(userData, { isNewRecord: true });
      sandbox.stub(UserModel, 'findOne').callsFake(async () => userModel);
      const result = await userRepository.getByName('name');
      expect(result).to.be.deep.eq(userData);
    });
  });
  describe('save test', () => {
    it('persists a new user', async () => {
      await userRepository.save(new User(null, 'testname', 'testpass', 'test'));
      const result = await UserModel.findOne({ where: { username: 'testname' } });
      expect(result).to.have.property('id').to.not.be.null;
    });

    it('updates a user', async () => {
      const userData : Partial<User> = {
        id: v4(), username: 'testname', password: 'testpass', email: 'test',
      };
      let userModel = await UserModel.build(userData, { isNewRecord: true });
      userModel = await userModel.save();

      await userRepository.save({ ...userData, password: 'newpass' });

      const result = await UserModel.findOne({ where: { username: 'testname' } });
      expect(result).to.have.property('password').to.be.eq('newpass');
      expect(result).property('createdAt').to.be.deep.eq(userModel.getDataValue('createdAt'));
      expect(result).property('updatedAt').to.not.be.deep.eq(userModel.getDataValue('updatedAt'));
    });
  });
});

import * as chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { describe } from 'mocha';
import { createSandbox, SinonSandbox } from 'sinon';
import { Sequelize } from 'sequelize';
import { expect } from 'chai';
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
});

import * as chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import sinonChai from 'sinon-chai';
import { describe } from 'mocha';
import { createSandbox, SinonSandbox, SinonStubbedInstance } from 'sinon';
import { expect } from 'chai';
import { mockReq, mockRes } from 'sinon-express-mock';
import UserService from '../../../../src/modules/auth/service/UserService';
import UserController from '../../../../src/modules/auth/controller/UserController';
import User from '../../../../src/modules/auth/entity/User';
import UserNotFoundException from '../../../../src/modules/auth/exception/UserNotFoundException';
import IncorrectPasswordException from '../../../../src/modules/auth/exception/IncorrectPasswordException';

chai.use(chaiAsPromised);
chai.use(sinonChai);

describe('userController test', () => {
  let userController: UserController;
  let userService: SinonStubbedInstance<UserService>;
  let sandbox: SinonSandbox;

  beforeEach(() => {
    sandbox = createSandbox();
    userService = sandbox.createStubInstance(UserService);
    userController = new UserController(userService);
  });
  afterEach(() => {
    sandbox.restore();
  });

  describe('register test', () => {
    describe('filters request body', () => {
      it('filters missing username', async () => {
        const request = {
          body: { password: 'password', email: 'test@test.test' },
        };
        const res = mockRes();
        await userController.register(mockReq(request), res);
        expect(res.status).to.have.been.calledOnceWithExactly(400);
        expect(res.json).to.have.been.calledOnceWithExactly(
          { data: {}, err: { msg: 'No username specified' } },
        );
      });
      it('filters missing password', async () => {
        const request = {
          body: { username: '123456', email: 'test@test.test' },
        };
        const res = mockRes();
        await userController.register(mockReq(request), res);
        expect(res.status).to.have.been.calledOnceWithExactly(400);
        expect(res.json).to.have.been.calledOnceWithExactly(
          { data: {}, err: { msg: 'No password specified' } },
        );
      });

      it('filters missing email', async () => {
        const request = {
          body: { username: '123456', password: '123456' },
        };
        const res = mockRes();
        await userController.register(mockReq(request), res);
        expect(res.status).to.have.been.calledOnceWithExactly(400);
        expect(res.json).to.have.been.calledOnceWithExactly(
          { data: {}, err: { msg: 'No email specified' } },
        );
      });

      it('filters invalid email', async () => {
        const request = {
          body: { username: '123456', password: '123456', email: 'invalid' },
        };
        const res = mockRes();
        await userController.register(mockReq(request), res);
        expect(res.status).to.have.been.calledOnceWithExactly(400);
        expect(res.json).to.have.been.calledOnceWithExactly(
          { data: {}, err: { msg: 'Invalid email' } },
        );
      });

      it('filters short password', async () => {
        const request = {
          body: { username: '123456', password: '12345', email: 'test@test.test' },
        };
        const res = mockRes();
        await userController.register(mockReq(request), res);
        expect(res.status).to.have.been.calledOnceWithExactly(400);
        expect(res.json).to.have.been.calledOnceWithExactly(
          { data: {}, err: { msg: 'Password too short' } },
        );
      });

      it('filters short username', async () => {
        const request = {
          body: { username: '12345', password: '123456', email: 'test@test.test' },
        };
        const res = mockRes();
        await userController.register(mockReq(request), res);
        expect(res.status).to.have.been.calledOnceWithExactly(400);
        expect(res.json).to.have.been.calledOnceWithExactly(
          { data: {}, err: { msg: 'Username too short' } },
        );
      });
    });
    it('calls userService with correct parameters', async () => {
      const request = {
        body: { username: 'username', password: 'password', email: 'test@test.test' },
      };

      const userData = new User(
        '1',
        'username',
        'password',
        'test@test.test',
        '1/1/1',
        '1/1/1',
      );

      userService.getByName.callsFake(() => { throw new UserNotFoundException(); });
      userService.add.resolves(userData);

      const res = mockRes();
      await userController.register(mockReq(request), res);

      expect(userService.getByName).to.have.been.calledOnceWithExactly('username');
      expect(userService.add).to.have.been.calledOnceWithExactly(
        { username: 'username', password: 'password', email: 'test@test.test' },
      );
      expect(userService.sendWelcomeEmail).to.have.been.calledOnceWithExactly(userData);
    });
    it('responds with the saved user', async () => {
      const request = {
        body: { username: 'username', password: 'password', email: 'test@test.test' },
      };

      const userData: any = {
        id: '1',
        username: 'username',
        password: 'password',
        email: 'test@test.test',
        createdAt: '1/1/1',
        updatedAt: '1/1/1',
      };

      userService.getByName.callsFake(() => { throw new UserNotFoundException(); });
      userService.add.resolves(userData);

      const res = mockRes();
      await userController.register(mockReq(request), res);

      delete userData.password;
      expect(res.status).to.have.been.calledOnceWithExactly(200);
      expect(res.json).to.have.been.calledOnceWithExactly(userData);
    });
    it('responds with error if username exists', async () => {
      const request = {
        body: { username: 'username', password: 'password', email: 'test@test.test' },
      };

      userService.getByName.resolves(new User('1,', 'username', 'password', 'test@test.test'));

      const res = mockRes();
      await userController.register(mockReq(request), res);

      expect(res.status).to.have.been.calledOnceWithExactly(400);
      expect(res.json).to.have.been.calledOnceWithExactly({
        data: {},
        err: {
          msg: 'Username already registered',
        },
      });
    });
  });

  describe('signIn test', () => {
    describe('filters request body', () => {
      it('filters missing username', async () => {
        const request = {
          body: { password: 'password' },
        };
        const res = mockRes();
        await userController.signIn(mockReq(request), res);
        expect(res.status).to.have.been.calledOnceWithExactly(400);
        expect(res.json).to.have.been.calledOnceWithExactly(
          { data: {}, err: { msg: 'No username specified' } },
        );
      });
      it('filters missing password', async () => {
        const request = {
          body: { username: 'username' },
        };
        const res = mockRes();
        await userController.signIn(mockReq(request), res);
        expect(res.status).to.have.been.calledOnceWithExactly(400);
        expect(res.json).to.have.been.calledOnceWithExactly(
          { data: {}, err: { msg: 'No password specified' } },
        );
      });
    });
    it('calls userService with correct parameters', async () => {
      const request = {
        body: { username: 'username', password: 'password' },
      };

      userService.signIn.resolves('1');

      const res = mockRes();
      await userController.signIn(mockReq(request), res);
      expect(userService.signIn).to.have.been.calledOnceWithExactly('username', 'password');
    });
    it('responds with the token if successful', async () => {
      const request = {
        body: { username: 'username', password: 'password' },
      };

      userService.signIn.resolves('1');

      const res = mockRes();
      await userController.signIn(mockReq(request), res);

      expect(res.status).to.have.been.calledOnceWithExactly(200);
      expect(res.json).to.have.been.calledOnceWithExactly({ data: { token: '1' } });
    });
    it('responds with error if user not found', async () => {
      const request = {
        body: { username: 'username', password: 'password' },
      };

      userService.signIn.callsFake(() => { throw new UserNotFoundException(); });

      const res = mockRes();
      await userController.signIn(mockReq(request), res);

      expect(res.status).to.have.been.calledOnceWithExactly(400);
      expect(res.json).to.have.been.calledOnceWithExactly({ data: {}, err: { msg: 'Invalid credentials' } });
    });
    it('responds with error if passwords dont match', async () => {
      const request = {
        body: { username: 'username', password: 'password' },
      };

      userService.signIn.callsFake(() => { throw new IncorrectPasswordException(); });

      const res = mockRes();
      await userController.signIn(mockReq(request), res);

      expect(res.status).to.have.been.calledOnceWithExactly(400);
      expect(res.json).to.have.been.calledOnceWithExactly({ data: {}, err: { msg: 'Invalid credentials' } });
    });
  });
});

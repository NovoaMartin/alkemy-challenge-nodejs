import { mockReq, mockRes } from 'sinon-express-mock';
import { expect } from 'chai';
import sinonChai from 'sinon-chai';
import * as chai from 'chai';
import jwt from 'jsonwebtoken';
import { config } from 'dotenv';
import sinon from 'sinon';
import validateToken from '../../src/lib/auth';

config();

chai.use(sinonChai);
describe('Validate token test', () => {
  it('Responds with 401 if no token is provided', async () => {
    const req = mockReq();
    const res = mockRes();
    await validateToken(req, res, () => {});
    expect(res.status).to.have.been.calledOnceWithExactly(401);
    expect(res.json).to.have.been.calledOnceWithExactly({ data: {}, err: { msg: 'Access denied' } });
  });
  it('Responds with 401 if given invalid token', async () => {
    const req = mockReq(
      {
        header: {
          Authorization: 'invalid',
        },
      },
    );
    const res = mockRes();
    await validateToken(req, res, () => {});
    expect(res.status).to.have.been.calledOnceWithExactly(401);
    expect(res.json).to.have.been.calledOnceWithExactly({ data: {}, err: { msg: 'Access denied' } });
  });
  it('Calls next function and sets userId if token is valid', async () => {
    const token = jwt.sign({ id: 'test' }, process.env.TOKEN_SECRET!);
    const req = mockReq(
      { header: () => {} },
    );
    const res = mockRes();
    const next = sinon.stub();
    sinon.stub(req, 'header').returns(token);
    await validateToken(req, res, next);
    expect(req).to.have.property('userId', 'test');
    expect(next).to.have.been.calledOnce;
  });
});

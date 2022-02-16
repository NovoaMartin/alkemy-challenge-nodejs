import { QueryInterface, Sequelize as T } from 'sequelize';
import UserModel from '../../modules/auth/model/UserModel';

export default {
  async up(queryInterface: QueryInterface, Sequelize: T) {
    await UserModel.setup(queryInterface.sequelize).sync({ force: true });
  },

  async down(queryInterface: QueryInterface, Sequelize: T) {
    await queryInterface.dropTable('users');
  },
};

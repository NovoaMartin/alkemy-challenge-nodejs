import {
  Column, DataType, PrimaryKey, Table, Unique, Model,
} from 'sequelize-typescript';

@Table({
  tableName: 'users',
  modelName: 'user',
})
export default class UserModel extends Model {
  @PrimaryKey
  @Unique
  @Column(DataType.UUID)
    id!: string;

  @Unique
  @Column
    username! : string;

  @Column
    password! : string;

  @Column
    email! : string;
}

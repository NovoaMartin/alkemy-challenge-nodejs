import {
  DataType, Model, Column, PrimaryKey, Unique, Default, HasMany, Table,
} from 'sequelize-typescript';
// eslint-disable-next-line import/no-cycle
import FilmModel from '../../film/model/FilmModel';

@Table({
  tableName: 'genres',
  modelName: 'genre',
})
export default class GenreModel extends Model {
  @PrimaryKey
  @Unique
  @Column(DataType.UUID)
    id! : string;

  @Column
    name! : string;

  @Default('')
  @Column
    image! : string;

  @HasMany(() => FilmModel)
    films! : FilmModel[];
}

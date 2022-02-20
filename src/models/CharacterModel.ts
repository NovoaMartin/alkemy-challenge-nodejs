import {
  AllowNull,
  BelongsToMany,
  Column,
  DataType,
  Default,
  Model,
  PrimaryKey,
  Table,
  Unique,
} from 'sequelize-typescript';
// eslint-disable-next-line import/no-cycle
import {
  BelongsToManyAddAssociationMixin,
  BelongsToManyGetAssociationsMixin,
  BelongsToManyRemoveAssociationMixin, BelongsToManySetAssociationsMixin,
} from 'sequelize';
import FilmModel from './FilmModel';
import CharacterFilm from './CharacterFilm';

@Table({
  tableName: 'characters',
  modelName: 'character',
})
export default class CharacterModel extends Model {
  @PrimaryKey
  @Unique
  @Column(DataType.UUID)
    id! : string;

  @Default('')
  @Column
    image! : string;

  @Column
    name! : string;

  @Column(DataType.TEXT)
    story! : string;

  @AllowNull
  @Column(DataType.INTEGER)
    age! : number;

  @AllowNull
  @Column(DataType.FLOAT)
    weight! : number;

  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  @BelongsToMany(() => FilmModel, () => CharacterFilm)
    films!: FilmModel[];

  declare getFilms : BelongsToManyGetAssociationsMixin<FilmModel>;

  declare addFilm : BelongsToManyAddAssociationMixin<FilmModel, FilmModel['id']>;

  declare setFilms : BelongsToManySetAssociationsMixin<FilmModel, FilmModel["id"]>

  declare removeFilm : BelongsToManyRemoveAssociationMixin<FilmModel, FilmModel['id']>;

}

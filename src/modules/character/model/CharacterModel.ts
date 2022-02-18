// eslint-disable-next-line max-classes-per-file
import {
  AllowNull, BelongsToMany,
  Column, DataType, Default, ForeignKey, Model, PrimaryKey, Table, Unique,
} from 'sequelize-typescript';
// eslint-disable-next-line import/no-cycle
import FilmModel from '../../film/model/FilmModel';

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
}

@Table({
  tableName: 'character_film_rel',
  modelName: 'character_film',
})
export class CharacterFilm extends Model {
  @ForeignKey(() => CharacterModel)
  @Column(DataType.UUID)
    characterId! : string;

  @ForeignKey(() => FilmModel)
  @Column(DataType.UUID)
    filmId! : string;
}

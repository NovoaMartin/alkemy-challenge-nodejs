import {
  BelongsTo, BelongsToMany,
  Column, DataType, Default, ForeignKey, Model, PrimaryKey, Table, Unique,
} from 'sequelize-typescript';
// eslint-disable-next-line import/no-cycle
import CharacterModel, { CharacterFilm } from '../../character/model/CharacterModel';
// eslint-disable-next-line import/no-cycle
import GenreModel from '../../genre/model/GenreModel';

@Table({
  tableName: 'films',
  modelName: 'film',
})
export default class FilmModel extends Model {
  @PrimaryKey
  @Unique
  @Column(DataType.UUID)
    id! : string;

  @Default('')
  @Column
    image! : string;

  @Column
    title! : string;

  @Column(DataType.DATE)
    releaseDate! : Date;

  @Column(DataType.FLOAT)
    rating! : number;

  @ForeignKey(() => GenreModel)
  @Column(DataType.UUID)
    genreId!: number;

  @BelongsTo(() => GenreModel)
    genre! : GenreModel;

  @BelongsToMany(() => CharacterModel, () => CharacterFilm)
    characters!: CharacterModel[];
}

import {
  BelongsTo, BelongsToMany,
  Column, DataType, Default, ForeignKey, Model, PrimaryKey, Table, Unique,
} from 'sequelize-typescript';
import {
  BelongsToGetAssociationMixin, BelongsToManyAddAssociationMixin,
  BelongsToManyGetAssociationsMixin, BelongsToManyRemoveAssociationMixin,
  BelongsToSetAssociationMixin
} from 'sequelize';
import CharacterModel from './CharacterModel';
import GenreModel from './GenreModel';
import CharacterFilm from './CharacterFilm';

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
    genreId!: string;

  @BelongsTo(() => GenreModel)
    genre! : GenreModel;

  @BelongsToMany(() => CharacterModel, () => CharacterFilm)
    characters!: CharacterModel[];

  declare getCharacters : BelongsToManyGetAssociationsMixin<CharacterModel>;
  declare addCharacter : BelongsToManyAddAssociationMixin<CharacterModel, CharacterModel['id']>
  declare removeCharacter : BelongsToManyRemoveAssociationMixin<CharacterModel, CharacterModel['id']>

  declare getGenre : BelongsToGetAssociationMixin<GenreModel>
  declare setGenre : BelongsToSetAssociationMixin<GenreModel, GenreModel['id']>
}

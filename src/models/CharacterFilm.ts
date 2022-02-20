import {
  Column, DataType, ForeignKey, Model, Table,
} from 'sequelize-typescript';
import FilmModel from './FilmModel';
import CharacterModel from './CharacterModel';

@Table({
  tableName: 'character_film_rel',
  modelName: 'character_film',
})
export default class CharacterFilm extends Model {
  @ForeignKey(() => CharacterModel)
  @Column(DataType.UUID)
    characterId!: string;

  @ForeignKey(() => FilmModel)
  @Column(DataType.UUID)
    filmId!: string;
}

export default class Character {
  constructor(
    public id : string | null,
    public image : string,
    public name : string,
    public story : string,
    public age? : number,
    public weight? : number,
  ) {}
}
export default class Character {
  constructor(
    public id : string | null,
    public image : string | null,
    public name : string,
    public story : string,
    public age? : number,
    public weight? : number,
    public films? : { title:string, href:string }[],
  ) {}
}

export default class Film {
  constructor(
    public id:string,
    public image : string,
    public title : string,
    public releaseDate : Date,
    public rating : number,
    public genre : { name:string, href: string },
    public characters : { name:string, href:string }[],
  ) {}
}

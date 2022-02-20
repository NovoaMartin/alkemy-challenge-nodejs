export default class Genre {
  constructor(
    public id : string,
    public name : string,
    public image : string,
    public films : {title: string, href: string}[],
  ) {}
}

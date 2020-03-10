export class Ingredient {
  id: number = new Date().getUTCMilliseconds();
  constructor(public name: string, public amount: number) {}
}

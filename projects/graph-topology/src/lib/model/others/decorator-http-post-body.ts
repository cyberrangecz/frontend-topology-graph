export class DecoratorHttpPostBody {
  from: string | number;
  to: string | number;
  decorators_type: string;
  ids: number[];

  constructor(decorators_type: string, ids: number[], from: string | number, to: string | number) {
    this.decorators_type = decorators_type;
    this.ids = ids;
    this.from = from;
    this.to = to;
  }
}

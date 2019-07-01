export class DecoratorHttpPostBody {
  from: string | number;
  to: string | number;
  decorators_type: string;
  names: string[];

  constructor(decorators_type: string, names: string[], from: string | number, to: string | number) {
    this.decorators_type = decorators_type;
    this.names = names;
    this.from = from;
    this.to = to;
  }
}

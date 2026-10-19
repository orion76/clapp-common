
export interface IClapp {
  run(argv?: string[]): Promise<void>;
}
export interface Type<T> extends Function {
  new (...args: any[]): T;
}

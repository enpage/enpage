export class Http401Error extends Error {
  constructor(msg: string) {
    super(msg);
    // Set the prototype explicitly.
    Object.setPrototypeOf(this, Http401Error.prototype);
  }
}

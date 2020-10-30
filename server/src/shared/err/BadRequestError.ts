export default class BadRequestError {
  message: string;
  code = 400;

  constructor(message: string, code?: number) {
    this.message = message;

    if (code) {
      this.code = code;
    }
  }
}

class CustomError extends Error {
  constructor(name: string, message: string) {
    super(message);
    this.name = name;
  }
}

export class ValidationError extends CustomError {
  constructor(message: string) {
    super("ValidationError", message);
  }
}

export default CustomError;

export class ValidationError extends Error {
  constructor(message?: string) {
    super(message ?? 'Validation error');
    this.name = 'ValidationError';
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}

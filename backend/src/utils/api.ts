export class ApiError extends Error {
  statusCode: number;
  code: string;

  constructor(statusCode: number, message: string, code?: string) {
    super(message);
    this.statusCode = statusCode;
    this.code = code ?? 'INTERNAL_ERROR';
  }
}

export function ok<T>(data: T) {
  return { success: true as const, data };
}

export function fail(message: string, code = 'ERROR') {
  return { success: false as const, message, error: code };
}

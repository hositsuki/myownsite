export class ApiResponse {
  private static readonly STATUS_SUCCESS = 'success';
  private static readonly STATUS_ERROR = 'error';

  static success<T>(data: T, message: string = 'Success') {
    return {
      status: this.STATUS_SUCCESS,
      message,
      data,
    };
  }

  static error(message: string = 'Error', code: number = 500) {
    return {
      status: this.STATUS_ERROR,
      message,
      code,
    };
  }
}

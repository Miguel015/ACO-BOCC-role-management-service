export class ApiResponse {
  static json(rqUID: string, statusCode: number, message: string, data?: any) {
    const body = { rqUID, timestamp: new Date().toISOString(), message, data };
    return {
      statusCode,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    };
  }

  static ok(rqUID: string, data?: any) {
    return ApiResponse.json(rqUID, 200, 'OK', data);
  }

  static badRequest(rqUID: string, message: string) {
    return ApiResponse.json(rqUID, 400, message);
  }

  static notFound(rqUID: string, message: string) {
    return ApiResponse.json(rqUID, 404, message);
  }

  static serverError(rqUID: string, message: string) {
    return ApiResponse.json(rqUID, 500, message);
  }
}

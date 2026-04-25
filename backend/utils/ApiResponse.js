class ApiResponse {
  static success(res, data, message = "OK", statusCode = 200) {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
    });
  }

  static error(res, error, fallbackMessage = "Internal server error") {
    const statusCode = error?.statusCode || 500;
    return res.status(statusCode).json({
      success: false,
      message: error?.message || fallbackMessage,
    });
  }
}

module.exports = ApiResponse;

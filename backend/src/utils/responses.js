export function success(reply, data, statusCode = 200) {
  return reply.code(statusCode).send(data);
}

export function error(reply, message, statusCode = 400) {
  return reply.code(statusCode).send({
    error: {
      message,
      code: getErrorCode(statusCode),
    },
  });
}

export function paginated(reply, data, meta) {
  return reply.send({
    data,
    pagination: {
      page: meta.page,
      limit: meta.limit,
      total: meta.total,
      totalPages: meta.totalPages,
    },
  });
}

function getErrorCode(statusCode) {
  const codes = {
    400: 'BAD_REQUEST',
    401: 'UNAUTHORIZED',
    403: 'FORBIDDEN',
    404: 'NOT_FOUND',
    409: 'CONFLICT',
    422: 'VALIDATION_ERROR',
    500: 'INTERNAL_SERVER_ERROR',
  };
  return codes[statusCode] || 'UNKNOWN_ERROR';
}

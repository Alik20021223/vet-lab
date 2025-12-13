import * as authService from './service.js';
import { success, error } from '../../utils/responses.js';

export async function login(request, reply) {
  try {
    const { email, password } = request.body;
    const result = await authService.login(email, password);
    
    if (!result) {
      return error(reply, 'Invalid credentials', 401);
    }
    
    return success(reply, result);
  } catch (err) {
    return error(reply, err.message, 500);
  }
}

export async function refresh(request, reply) {
  try {
    const { refreshToken } = request.body;
    
    if (!refreshToken) {
      return error(reply, 'Refresh token is required', 400);
    }
    
    const result = await authService.refreshToken(refreshToken);
    
    if (!result) {
      return error(reply, 'Invalid refresh token', 401);
    }
    
    return success(reply, result);
  } catch (err) {
    return error(reply, err.message, 500);
  }
}

export async function logout(request, reply) {
  try {
    // In a stateless JWT system, logout is typically handled client-side
    // But we can log the action or invalidate tokens in a blacklist if needed
    return success(reply, { message: 'Successfully logged out' });
  } catch (err) {
    return error(reply, err.message, 500);
  }
}

export async function register(request, reply) {
  try {
    const userData = request.body;
    const result = await authService.register(userData);
    return success(reply, result, 201);
  } catch (err) {
    return error(reply, err.message, 500);
  }
}

export async function me(request, reply) {
  try {
    const userId = request.user.id;
    const user = await authService.getUserById(userId);
    return success(reply, user);
  } catch (err) {
    return error(reply, err.message, 500);
  }
}

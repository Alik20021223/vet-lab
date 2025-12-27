import { useEffect, useMemo, useState } from 'react';
import { useLoginMutation, useLogoutMutation, useGetMeQuery } from '../services/auth.service';

export function useAuth() {
  const [token, setToken] = useState<string | null>(localStorage.getItem('accessToken'));
  const [storedUser, setStoredUser] = useState<string | null>(localStorage.getItem('user'));
  
  const [login, { isLoading: isLoggingIn, error: loginError }] = useLoginMutation();
  const [logout, { isLoading: isLoggingOut }] = useLogoutMutation();
  const { data: userData, isLoading: isLoadingUser, error: userError, refetch } = useGetMeQuery(undefined, {
    skip: !token, // Не делаем запрос если нет токена
  });

  // Слушаем изменения в localStorage из других вкладок
  useEffect(() => {
    const handleStorageChange = () => {
      setToken(localStorage.getItem('accessToken'));
      setStoredUser(localStorage.getItem('user'));
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Получаем пользователя из API или из localStorage
  // Если API вернул ошибку, но есть данные в localStorage, используем их
  const user = useMemo(() => {
    if (userData?.data) {
      return userData.data;
    }
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        return parsedUser;
      } catch {
        return null;
      }
    }
    return null;
  }, [userData?.data, storedUser]);

  const handleLogin = async (email: string, password: string) => {
    try {
      const result = await login({ email, password }).unwrap();
      if (result.token) {
        localStorage.setItem('accessToken', result.token);
        localStorage.setItem('refreshToken', result.refreshToken);
        localStorage.setItem('user', JSON.stringify(result.user));
        // Обновляем состояние сразу
        setToken(result.token);
        setStoredUser(JSON.stringify(result.user));
        // Не ждем refetch - данные уже есть в localStorage
      }
      return result;
    } catch (error) {
      throw error;
    }
  };

  const handleLogout = async () => {
    try {
      await logout().unwrap();
    } catch (error) {
      // Игнорируем ошибки при выходе
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      // Обновляем состояние сразу
      setToken(null);
      setStoredUser(null);
    }
  };

  // Проверяем авторизацию: есть токен И (есть данные из API ИЛИ есть данные в localStorage)
  const isAuthenticated = !!token && !!user;

  return {
    user,
    isLoading: isLoggingIn || isLoggingOut || (isLoadingUser && !!token),
    isAuthenticated,
    login: handleLogin,
    logout: handleLogout,
    loginError,
    userError,
  };
}



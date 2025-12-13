import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card } from '../../components/ui/card';
import { Lock, Mail } from 'lucide-react';
import { BRAND } from '../../shared/constants/brand';
import logo from '../../assets/vetLab-logo.png';
import { useAuth } from '../../shared/hooks/useAuth';
import { toast } from 'sonner';

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated, isLoading } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Если уже авторизован, редиректим на дашборд
  useEffect(() => {
    if (isAuthenticated) {
      const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/admin';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await login(formData.email, formData.password);
      // После успешного логина данные уже сохранены в localStorage
      // Навигация произойдет автоматически через useEffect когда isAuthenticated станет true
      toast.success('Успешный вход в систему');
    } catch (error: any) {
      // Показываем ошибку без перезагрузки страницы
      let errorMessage = 'Неверный email или пароль';
      
      if (error?.data) {
        // Пробуем разные форматы ответа от API
        errorMessage = error.data.message || error.data.error || error.data.error?.message || errorMessage;
      } else if (error?.message) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#00AADC] to-[#0088B8] flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <img src={logo} alt="VET-LAB" className="h-16 mx-auto mb-4" />
          <h1 className="mb-2">Админ-панель</h1>
          <p className="text-muted-foreground">
            Войдите для управления контентом
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="admin@vet-lab.tj"
                className="pl-10"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="password">Пароль</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••••"
                className="pl-10"
                required
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full"
            style={{ backgroundColor: BRAND.colors.primary }}
            disabled={isSubmitting || isLoading}
          >
            {isSubmitting ? 'Вход...' : 'Войти'}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          <p>Демо учетные данные:</p>
          <p className="text-xs mt-1">admin@vet-lab.tj / password</p>
        </div>
      </Card>
    </div>
  );
}

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function resetPassword() {
  const email = process.argv[2] || 'admin@vet-lab.tj';
  const newPassword = process.argv[3] || 'admin123';
  
  try {
    // Находим пользователя
    const user = await prisma.user.findUnique({
      where: { email },
    });
    
    if (!user) {
      console.log(`❌ Пользователь с email ${email} не найден`);
      return;
    }
    
    // Хешируем новый пароль
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    // Обновляем пароль
    await prisma.user.update({
      where: { email },
      data: {
        password: hashedPassword,
        role: 'super_admin', // Убеждаемся, что роль правильная
      },
    });
    
    console.log('✅ Пароль успешно обновлен!');
    console.log(`Email: ${email}`);
    console.log(`Новый пароль: ${newPassword}`);
  } catch (error) {
    console.error('❌ Ошибка при обновлении пароля:', error);
  } finally {
    await prisma.$disconnect();
  }
}

resetPassword();


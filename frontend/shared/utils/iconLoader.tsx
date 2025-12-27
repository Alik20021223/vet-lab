import React from 'react';
import * as LucideIcons from 'lucide-react';
import { Microscope } from 'lucide-react'; // Fallback icon

/**
 * Компонент для динамического отображения иконки из lucide-react
 */
interface DynamicIconProps {
  iconName?: string | null;
  className?: string;
}

export function DynamicIcon({ iconName, className }: DynamicIconProps) {
  if (!iconName) {
    return <Microscope className={className} />;
  }

  // Преобразуем имя в PascalCase, если нужно
  const normalizedName = iconName
    .split(/[-_\s]/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('');

  // Пытаемся получить иконку из lucide-react
  const IconComponent = (LucideIcons as Record<string, React.ComponentType<{ className?: string }>>)[normalizedName];

  // Если иконка найдена, рендерим её
  if (IconComponent && typeof IconComponent === 'function') {
    return <IconComponent className={className} />;
  }

  // Если не найдена, рендерим fallback
  return <Microscope className={className} />;
}

/**
 * Динамически загружает иконку из lucide-react по имени (legacy функция для обратной совместимости)
 * @param iconName - Имя иконки (например, "Microscope", "ChefHat", "Stethoscope")
 * @returns React компонент иконки или fallback иконку (Microscope)
 * @deprecated Используйте компонент DynamicIcon вместо этой функции
 */
export function getLucideIcon(iconName: string | undefined | null): React.ComponentType<{ className?: string }> {
  if (!iconName) {
    return Microscope;
  }

  // Преобразуем имя в PascalCase, если нужно
  const normalizedName = iconName
    .split(/[-_\s]/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('');

  // Пытаемся получить иконку из lucide-react
  const IconComponent = (LucideIcons as Record<string, React.ComponentType<{ className?: string }>>)[normalizedName];

  // Если иконка найдена, возвращаем её
  if (IconComponent && typeof IconComponent === 'function') {
    return IconComponent;
  }

  // Если не найдена, возвращаем fallback
  return Microscope;
}


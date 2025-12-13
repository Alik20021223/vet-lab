import { useState, useRef, useEffect } from 'react';
import { Button } from '../ui/button';
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Link as LinkIcon,
  Image as ImageIcon,
} from 'lucide-react';
import { cn } from '../ui/utils';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = 'Введите текст...',
  className,
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (editorRef.current && !isInitialized) {
      editorRef.current.innerHTML = value;
      setIsInitialized(true);
    }
  }, [value, isInitialized]);

  // Очищаем белый цвет текста при изменении контента
  useEffect(() => {
    if (editorRef.current) {
      const observer = new MutationObserver(() => {
        const allElements = editorRef.current?.querySelectorAll('*');
        allElements?.forEach((el) => {
          const htmlEl = el as HTMLElement;
          const computedColor = window.getComputedStyle(htmlEl).color;
          // Если цвет белый или очень светлый, заменяем на черный
          if (computedColor === 'rgb(255, 255, 255)' || computedColor === 'rgb(255, 255, 254)') {
            htmlEl.style.color = 'black';
          }
        });
      });

      observer.observe(editorRef.current, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['style', 'class'],
      });

      return () => observer.disconnect();
    }
  }, [isInitialized]);

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    
    // Получаем текст без форматирования
    const plainText = e.clipboardData.getData('text/plain');
    
    // Получаем HTML если есть
    const htmlContent = e.clipboardData.getData('text/html');
    
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;
    
    const range = selection.getRangeAt(0);
    range.deleteContents();
    
    if (htmlContent) {
      // Создаем временный контейнер для очистки HTML
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = htmlContent;
      
      // Удаляем все стили цвета из всех элементов
      const allElements = tempDiv.querySelectorAll('*');
      allElements.forEach((el) => {
        const htmlEl = el as HTMLElement;
        htmlEl.style.removeProperty('color');
        htmlEl.style.removeProperty('background-color');
        htmlEl.style.removeProperty('background');
        // Удаляем атрибут style если он пустой
        if (!htmlEl.style.cssText.trim()) {
          htmlEl.removeAttribute('style');
        }
      });
      
      // Вставляем очищенный HTML
      const fragment = document.createDocumentFragment();
      while (tempDiv.firstChild) {
        fragment.appendChild(tempDiv.firstChild);
      }
      range.insertNode(fragment);
    } else {
      // Вставляем простой текст
      const textNode = document.createTextNode(plainText);
      range.insertNode(textNode);
    }
    
    range.collapse(false);
    selection.removeAllRanges();
    selection.addRange(range);
    
    handleInput();
  };

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  };

  const insertLink = () => {
    const url = prompt('Введите URL:');
    if (url) {
      execCommand('createLink', url);
    }
  };

  const insertImage = () => {
    const url = prompt('Введите URL изображения:');
    if (url) {
      execCommand('insertImage', url);
    }
  };

  const toolbarButtons = [
    { icon: Bold, command: 'bold', title: 'Жирный' },
    { icon: Italic, command: 'italic', title: 'Курсив' },
    { icon: Underline, command: 'underline', title: 'Подчеркнутый' },
    { icon: List, command: 'insertUnorderedList', title: 'Маркированный список' },
    { icon: ListOrdered, command: 'insertOrderedList', title: 'Нумерованный список' },
    { icon: AlignLeft, command: 'justifyLeft', title: 'По левому краю' },
    { icon: AlignCenter, command: 'justifyCenter', title: 'По центру' },
    { icon: AlignRight, command: 'justifyRight', title: 'По правому краю' },
  ];

  return (
    <div className={cn('border border-gray-300 rounded-lg overflow-hidden', className)}>
      {/* Toolbar */}
      <div className="flex items-center gap-1 p-2 bg-gray-50 border-b border-gray-300 flex-wrap">
        {toolbarButtons.map(({ icon: Icon, command, title }) => (
          <Button
            key={command}
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => execCommand(command)}
            title={title}
            className="h-8 w-8 p-0"
          >
            <Icon className="w-4 h-4" />
          </Button>
        ))}
        <div className="w-px h-6 bg-gray-300 mx-1" />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={insertLink}
          title="Вставить ссылку"
          className="h-8 w-8 p-0"
        >
          <LinkIcon className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={insertImage}
          title="Вставить изображение"
          className="h-8 w-8 p-0"
        >
          <ImageIcon className="w-4 h-4" />
        </Button>
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onPaste={handlePaste}
        className="min-h-[200px] p-4 focus:outline-none prose prose-sm max-w-none text-black [&_*]:text-black [&_*]:!text-black"
        style={{ color: 'black' }}
        data-placeholder={placeholder}
        suppressContentEditableWarning
      />
    </div>
  );
}

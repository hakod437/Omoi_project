import { Palette } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/app/components/ui/dropdown-menu';

export type ThemeColor = 'pastel' | 'cyber' | 'shonen';

interface ThemeSelectorProps {
  currentTheme: ThemeColor;
  onThemeChange: (theme: ThemeColor) => void;
}

const themes = [
  {
    id: 'pastel' as ThemeColor,
    name: 'Pastel Kawaii',
    description: 'Violet et rose doux',
    colors: ['#c77dff', '#ffd6ff', '#ffe5f7'],
  },
  {
    id: 'cyber' as ThemeColor,
    name: 'Cyber Otaku',
    description: 'Bleu néon et cyan',
    colors: ['#00d9ff', '#7b2cbf', '#4cc9f0'],
  },
  {
    id: 'shonen' as ThemeColor,
    name: 'Shonen Energy',
    description: 'Orange et rouge dynamique',
    colors: ['#ff6b35', '#ff9e00', '#ffd60a'],
  },
];

export function ThemeSelector({ currentTheme, onThemeChange }: ThemeSelectorProps) {
  const current = themes.find((t) => t.id === currentTheme);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Palette className="size-4" />
          <span className="hidden sm:inline">{current?.name}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {themes.map((theme) => (
          <DropdownMenuItem
            key={theme.id}
            onClick={() => onThemeChange(theme.id)}
            className="flex items-center justify-between cursor-pointer"
          >
            <div>
              <p className="font-medium">{theme.name}</p>
              <p className="text-xs text-muted-foreground">{theme.description}</p>
            </div>
            <div className="flex gap-1">
              {theme.colors.map((color, i) => (
                <div
                  key={i}
                  className="size-4 rounded-full border"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

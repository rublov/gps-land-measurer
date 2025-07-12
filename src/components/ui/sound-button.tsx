import React from 'react';
import { Button, ButtonProps } from '@/components/ui/button';
import { useSound } from '@/hooks/useSound';
import { SoundType } from '@/utils/sound';

interface SoundButtonProps extends ButtonProps {
  soundType?: SoundType;
  soundDelay?: number;
  soundVolume?: number;
}

export const SoundButton: React.FC<SoundButtonProps> = ({
  soundType = 'click',
  soundDelay = 0,
  soundVolume,
  onClick,
  children,
  ...props
}) => {
  const { play } = useSound();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    // Воспроизводим звук
    play(soundType, { delay: soundDelay, volume: soundVolume });
    
    // Вызываем оригинальный onClick если он есть
    if (onClick) {
      onClick(event);
    }
  };

  return (
    <Button {...props} onClick={handleClick}>
      {children}
    </Button>
  );
};

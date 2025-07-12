import { useCallback } from 'react';
import { playSound, SoundType } from '@/utils/sound';

export const useSound = () => {
  const play = useCallback((soundType: SoundType, options?: { volume?: number; delay?: number }) => {
    playSound(soundType, options);
  }, []);

  return { play };
};

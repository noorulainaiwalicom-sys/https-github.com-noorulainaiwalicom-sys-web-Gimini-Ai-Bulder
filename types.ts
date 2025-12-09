export enum ViewMode {
  PREVIEW = 'PREVIEW',
  CODE = 'CODE',
  SPLIT = 'SPLIT'
}

export enum DeviceFrame {
  DESKTOP = 'w-full',
  TABLET = 'max-w-[768px]',
  MOBILE = 'max-w-[375px]'
}

export interface GenerationHistory {
  id: string;
  prompt: string;
  code: string;
  timestamp: number;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}
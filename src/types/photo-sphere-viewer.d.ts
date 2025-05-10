declare module 'photo-sphere-viewer' {
  export interface ViewerAPI {
    addEventListener: (event: string, callback: () => void) => void;
    removeEventListener: (event: string, callback: () => void) => void;
    destroy: () => void;
    [key: string]: any; // Allow any other properties
  }
} 
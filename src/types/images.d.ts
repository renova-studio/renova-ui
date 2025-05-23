declare module '*.png' {
  const value: string;
  export default value;
}

declare module '*.jpg' {
  const value: string;
  export default value;
}

declare module '*.jpeg' {
  const value: string;
  export default value;
}

declare module '*.svg' {
  const value: string;
  export default value;
}

interface ImportMetaGlob {
  (pattern: string): Record<string, () => Promise<{ default: string }>>;
}

declare interface ImportMeta {
  glob: ImportMetaGlob;
} 
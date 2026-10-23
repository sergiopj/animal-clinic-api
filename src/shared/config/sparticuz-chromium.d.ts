declare module '@sparticuz/chromium' {
  export const args: string[];
  export const defaultViewport: { width: number; height: number } | null;
  export const headless: boolean;
  export function executablePath(): Promise<string>;

  const chromium: {
    args: string[];
    defaultViewport: { width: number; height: number } | null;
    headless: boolean;
    executablePath(): Promise<string>;
  };

  export default chromium;
}

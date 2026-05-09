declare module 'wordwrapjs' {
  interface WrapOptions {
    width: number;
    break: boolean;
    noTrim?: boolean;
  }

  const wordwrap: {
    wrap(text: string, options: WrapOptions): string;
  };

  export default wordwrap;
}

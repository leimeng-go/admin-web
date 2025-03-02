declare module 'js-cookie' {
  interface CookieAttributes {
    path?: string;
    domain?: string;
    expires?: number | Date;
    secure?: boolean;
    sameSite?: 'strict' | 'lax' | 'none';
  }

  interface CookiesStatic {
    get(name: string): string | undefined;
    set(name: string, value: string | object, options?: CookieAttributes): string | undefined;
    remove(name: string, options?: CookieAttributes): void;
    withAttributes(attributes: CookieAttributes): CookiesStatic;
    withConverter(converter: Function): CookiesStatic;
  }

  const Cookies: CookiesStatic;
  export default Cookies;
} 
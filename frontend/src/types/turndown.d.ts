declare module 'turndown' {
  interface TurndownOptions {
    headingStyle?: 'setext' | 'atx';
    bulletListMarker?: '*' | '+' | '-';
    codeBlockStyle?: 'indented' | 'fenced';
    emDelimiter?: '_' | '*';
    strongDelimiter?: '__' | '**';
    linkStyle?: 'inlined' | 'referenced';
    linkReferenceStyle?: 'full' | 'collapsed' | 'shortcut';
    fence?: string;
  }

  interface TurndownRule {
    filter: string | string[] | ((node: HTMLElement) => boolean);
    replacement: (content: string, node: HTMLElement, options?: any) => string;
  }

  class TurndownService {
    constructor(options?: TurndownOptions);
    turndown(html: string): string;
    addRule(key: string, rule: TurndownRule | Partial<TurndownRule>): this;
    use(plugin: (service: TurndownService) => void): this;
    remove(filter: string | string[]): this;
    keep(filter: string | string[]): this;
    escape(str: string): string;
  }

  export = TurndownService;
} 
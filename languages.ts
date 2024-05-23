// * types
type Languages = Record<LanguageName, Language>;

type Language = { resolver: Resolver; stringLiterals?: string[] };

type LanguageName = 'JS' | 'CSS' | 'HTML' | 'CPP' | 'GO' | 'PYTHON' | 'PHP';

export type Resolver =
  | string
  | { block: string }
  | { inline: string }
  | { block: string; inline: string };

const DEFAULT_RESOLVER = { inline: '//.*', block: '/\\*(?:.|\n)*?\\*/' };
const DEFAULT_STRING_LITERALS = ["'", '"'];

const languages: Languages = {
  JS: {
    resolver: DEFAULT_RESOLVER,
    stringLiterals: ["'", '"', '`'],
  },
  CSS: {
    resolver: DEFAULT_RESOLVER.block,
    stringLiterals: DEFAULT_STRING_LITERALS,
  },
  HTML: {
    resolver: '<!--[\\s\\S]*?-->',
    stringLiterals: DEFAULT_STRING_LITERALS,
  },
  CPP: {
    resolver: DEFAULT_RESOLVER,
    stringLiterals: ['"'],
  },
  GO: {
    resolver: DEFAULT_RESOLVER,
    stringLiterals: ['"'],
  },
  PYTHON: {
    resolver: '#.*',
    stringLiterals: ["'", '"', "'''", '"""'],
  },
  PHP: {
    resolver: { inline: '(?:#|//).*' },
    stringLiterals: DEFAULT_STRING_LITERALS,
  },
};

export default languages;

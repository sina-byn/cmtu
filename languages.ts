// * types
type Languages = Record<LanguageName, Language>;

type LanguageName = 'JS';

type Language = { resolver: Resolver; options?: { stringLiterals?: string[] } };

export type Resolver =
  | string
  | { block: string }
  | { inline: string }
  | { block: string; inline: string };

const languages: Languages = {
  JS: { resolver: { inline: '//.*', block: '/\\*(?:.|\n)*?\\*/' } },
};

export default languages;

// * data
const DEFAULT_STRING_LITERALS = ["'", '"', '`'];

// * types
type Resolver = string | { block: string } | { inline: string } | { block: string; inline: string };

type Options = {
  stringSensitive?: boolean;
  stringLiterals?: string[];
};

const cmtu = (resolver: Resolver, options?: Options) => {
  const { stringSensitive, stringLiterals = DEFAULT_STRING_LITERALS } = options ?? {};

  // * validation goes here

  let pattern = typeof resolver === 'string' ? resolver : Object.values(resolver).join('|');

  if (stringSensitive) {
    pattern =
      stringLiterals.reduce((stringPatterns, stringLiteral) => {
        const stringPattern = `${stringLiteral}(?:\\[\s\S]|[^"])*${stringLiteral}|`;

        return stringPatterns + stringPattern;
      }, '') + pattern;
  }

  const commentRegex = new RegExp(pattern, 'gm');

  const exec = (code: string, replace: boolean = true): [string, string[]] => {
    const matches: string[] = [];

    code = code.replace(commentRegex, match => {
      if (stringSensitive && stringLiterals.some(sl => match.startsWith(sl))) return match;

      matches.push(match);
      return replace ? '' : match;
    });

    return [code, matches];
  };

  return {
    strip: (code: string) => exec(code, true)[0],
    extract: (code: string) => exec(code, false)[1],
    magic: (code: string) => exec(code, true),
  };
};

module.exports = cmtu;

const jsCode = `
// this is a js comment

this is not a js comment

const callout = '// this is not a comment';

/*
this is a js multi-line comment
*/
`;

const jsCmtu = cmtu({ inline: '//.*', block: '/\\*(?:.|\n)*?\\*/' }, { stringSensitive: true });

const noComments = jsCmtu.strip(jsCode);

console.log(noComments);

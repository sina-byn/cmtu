// * types
type Resolver =
  | string
  | { block: string }
  | { inline: string }
  | { block: string; inline: string };

const cmtu = (resolver: Resolver) => {
  let pattern =
    typeof resolver === 'string'
      ? resolver
      : Object.values(resolver).filter(Boolean).join('|');

  const commentRegex = new RegExp(pattern, 'gm');

  const exec = (code: string, replace: boolean = true): [string, string[]] => {
    const matches: string[] = [];

    code = code.replace(commentRegex, match => {
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

/*
this is a js multi-line comment
*/
`;

const jsCmtu = cmtu({ inline: '//.*', block: '/\\*(?:.|\n)*?\\*/' });

const noComments = jsCmtu.strip(jsCode);

console.log(noComments);


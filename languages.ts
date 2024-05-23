// * types
export type Resolver =
  | string
  | { block: string }
  | { inline: string }
  | { block: string; inline: string };

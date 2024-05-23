import Joi, { string, valid, type Schema } from 'joi';

// * types
import type { Resolver } from './languages';

const validate = (input: unknown, schema: Schema) => {
  const { error } = schema.validate(input, { abortEarly: true });

  if (error) throw new Error(error.details[0].message);
};

export const resolverValidator = (resolver: Resolver) => {
  if (typeof resolver === 'string') validate(resolver, Joi.string().min(1).label('resolver'));

  validate(resolver, Joi.object().keys().min(1).message('"resolver" can not be an empty object'));

  validate(
    resolver,
    Joi.object({
      inline: Joi.string().min(1).label('resolver.inline'),
      block: Joi.string().min(1).label('resolver.block'),
    })
  );
};

export const stringLiteralsValidator = (stringLiterals?: string[]) => {
  validate(
    stringLiterals,
    Joi.array()
      .min(1)
      .items(
        Joi.string()
          .min(1)
          .messages({ 'string.empty': 'empty strings are not allowed as string literlas' })
      )
      .label('stringLiterals')
  );
};

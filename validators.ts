import Joi, { type Schema } from 'joi';

// * types
import type { Resolver } from './languages';

const validate = (input: unknown, schema: Schema) => {
  const { error } = schema.validate(input, { abortEarly: true });

  if (error) throw new Error(error.details[0].message);
};

export const resolverValidator = (resolver: Resolver) => {
  if (typeof resolver === 'string') {
    return validate(resolver, Joi.string().min(1).label('resolver'));
  }

  validate(
    resolver,
    Joi.object().keys().min(1).message('"resolver" can not be an empty object').label('resolver')
  );

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

export const excludeValidator = (exclude?: RegExp[]) => {
  const errorMessage = 'only RegExp objects are allowed as exclude items';

  validate(
    exclude,
    Joi.array()
      .items(
        Joi.object()
          .instance(RegExp)
          .messages({ 'object.base': errorMessage, 'object.instance': errorMessage })
      )
      .min(1)
      .messages({ 'array.min': '"exclude" must contain at least 1 item' })
  );
};

declare module 'joi-objectid' {
  import Joi from 'joi';
  function JoiObjectId(joi: typeof Joi): Joi.Extension;
  export = JoiObjectId;
}

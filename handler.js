'use strict';

module.exports.hello = async event => {
  console.log(`Hello handler called......${process.env.MY_ENV_VAR}`)
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: `hello handler executed successfully! ${process.env.MY_ENV_VAR}`,
        input: event,
      },
      null,
      2
    ),
  };
};

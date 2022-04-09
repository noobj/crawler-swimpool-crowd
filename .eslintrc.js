module.exports = {
    env: {
        'es6': true,
        'node': true
    },
    "parserOptions": {
        "ecmaVersion": 2017
    },
    extends: ['eslint:recommended', 'plugin:prettier/recommended'],
    ignorePatterns: ['.eslintrc.js'],
    rules: {
        'no-extra-parens': 2,
        'no-unexpected-multiline': 2,
        eqeqeq: [2, 'smart']
    }
};

module.exports = {
    "env": {
        "browser": true,
        "commonjs": true,
        "es2021": true,
        "node":true,
        "mocha":true
    },
    "extends": "eslint:recommended",
    "overrides": [
        {
            "env": {
                "node": true
            },
            "files": [
                ".eslintrc.{js,cjs}"
            ],
            "parserOptions": {
                "sourceType": "script"
            }
        }
    ],
    "parserOptions": {
        "ecmaVersion": "latest"
    },
    "rules": {
        "no-redeclare": "error",
        "max-len": ["error", {
            "code": 230,
            "tabWidth": 2
        }],
        "no-var": "error",
        "prefer-const":"error",
        "sort-imports": "off",
        "max-lines": ["error", {max:700,"skipComments":true}],
    }
}

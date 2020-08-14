# Example of trying to use `inputSourceMap` option with `@babel/parse`

Please see https://github.com/babel/babel/issues/11960.

Run `node index.js` to run the case.

I would expect the combined source map to reference the original files, but it does not - it references the intermediates.

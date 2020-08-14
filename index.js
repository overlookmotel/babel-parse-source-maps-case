'use strict';

const {parse} = require('@babel/parser'),
  generate = require('@babel/generator').default,
  {SourceMapConsumer} = require('source-map'),
  t = require('@babel/types');

// Original files
const inputA = 'var x = 1;';
const inputB = 'var y = 2;';

// Create intermediates
const astA = parse(inputA, {sourceFilename: 'a.js'});
astA.program.body.unshift(
  t.variableDeclaration(
    'var',
    [t.variableDeclarator(t.identifier('q'))]
  )
);
const {code: codeA, map: mapA} = generate(
  astA,
  {sourceMaps: true, sourceFileName: 'a.js'},
  inputA
);

const astB = parse(inputB, {sourceFilename: 'b.js'});
astB.program.body.unshift(
  t.variableDeclaration(
    'var',
    [t.variableDeclarator(t.identifier('r'))]
  )
);
const {code: codeB, map: mapB} = generate(
  astB,
  {sourceMaps: true, sourceFileName: 'b.js'},
  inputB
);

// Parse intermediates
const ast2A = parse(codeA, {sourceFilename: 'a.transpiled.js', inputSourceMap: mapA});
const ast2B = parse(codeB, {sourceFilename: 'b.transpiled.js', inputSourceMap: mapB});

// Combine the two
const astCombined = t.program(
  [...ast2A.program.body, ...ast2B.program.body]
);

const {code: codeCombined, map: mapCombined} = generate(
  astCombined,
  {sourceMaps: true},
  {
    'a.transpiled.js': codeA,
    'b.transpiled.js': codeB,
    'a.js': inputA,
    'b.js': inputB
  }
);

console.log('codeCombined:', codeCombined);
console.log('mapCombined:', mapCombined);

const consumer = new SourceMapConsumer(mapCombined);
console.log('posX:', consumer.originalPositionFor({line: 2, column: 4}));
console.log('posY:', consumer.originalPositionFor({line: 4, column: 4}));

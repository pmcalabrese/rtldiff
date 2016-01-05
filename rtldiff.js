/*
USAGE

USAGE WITH A LESS FILE
node rtldiff.js --less [path where to look for less dependencies] < [main less file]

example:
node rtldiff.js --less mylesstest/ < mylesstest/mylesstest.less

USAGE WITH A CSS FILE

node rtldiff.js < [main css file]

example:
node rtldiff.js < mytest.css
*/

var cssLib = require('css');
var fs = require('fs');
var flip = require('css-flip');
var sass = require('node-sass');
var less = require('less');
var _ = require('lodash');
var Promise = require('promise');

var css = [];
const OUTPUT_FILE_NAME = "rtl.std";

var stdin = process.stdin;
stdin.setEncoding('utf8');
stdin.resume();

stdin.on('data', function (chunk) {
    css.push(chunk);
});

stdin.on('end', function () {

    css = css.join('').toString();

    var promise = new Promise(function (resolve, reject) {
        if (process.argv[2] === "--less") {
            console.log("I'm goning to using LESS parser");
            less.render(css,
                {
                    paths: process.argv[3].split(","),
                    compress: false
                },
                function (e, output) {
                    if (e) {
                        console.log("e", e);
                        reject(e);
                    } else {
                        resolve(output.css)
                    }
                });
        } else {
            console.log("I'm goning to using CSS parser");
            resolve(css)
        }
    })

    promise.then(function (css) {

        var ast = cssLib.parse(css);
        console.log("parsing...done");
        console.log("flipping...");
        var astFlipped = cssLib.parse(flip(cssLib.stringify(ast)));
        console.log("flipping...done");
        console.log("diffing...");
        var properties = ['left', 'right', 'padding', 'margin', 'text-align', 'float', 'border-left', 'border-right', 'margin-left', 'margin-right', 'padding-left', 'padding-right'];

        var totalDifferentDecleration = 0;
        var totalResetDeclaration = 0;

        _.map(astFlipped.stylesheet.rules, function (rule, i) {

            var differentDecleration = [];
            var resetDeclaration = [];

            _.each(rule.declarations, function (declarations, j, l) {

                if (_.contains(properties, declarations.property)) {

                    if (!ast.stylesheet.rules[i].declarations) {
                        console.log("[ERROR] the rule that starts at", ast.stylesheet.rules[i - 1].position.start, "and finish at", ast.stylesheet.rules[i - 1].position.end, "is empty");
                        return;
                    } else {

                    }
                    if (!ast.stylesheet.rules[i].declarations || !ast.stylesheet.rules[i].declarations[j])  {
                        return;
                    }

                    try {

                        if (declarations.property === ast.stylesheet.rules[i].declarations[j].property && declarations.value !== ast.stylesheet.rules[i].declarations[j].value) {
                            differentDecleration.push(declarations);
                        }

                        if (declarations.property !== ast.stylesheet.rules[i].declarations[j].property) {
                            differentDecleration.push(declarations);
                            if (ast.stylesheet.rules[i].declarations[j].property === "border-left" || ast.stylesheet.rules[i].declarations[j].property === "border-right") {
                                ast.stylesheet.rules[i].declarations[j].value = 0;
                                resetDeclaration.push(ast.stylesheet.rules[i].declarations[j]);
                            }

                            if (ast.stylesheet.rules[i].declarations[j].property === "margin-left" && parseInt(ast.stylesheet.rules[i].declarations[j].value, 10) >= 0 || ast.stylesheet.rules[i].declarations[j].property === "margin-right" && parseInt(ast.stylesheet.rules[i].declarations[j].value, 10) >= 0) {
                                if (ast.stylesheet.rules[i].declarations[j].value !== "auto") {
                                    ast.stylesheet.rules[i].declarations[j].value = "auto";
                                    resetDeclaration.push(ast.stylesheet.rules[i].declarations[j]);
                                }
                            }

                            if (ast.stylesheet.rules[i].declarations[j].property === "padding-left" && parseInt(ast.stylesheet.rules[i].declarations[j].value, 10) >= 0 || ast.stylesheet.rules[i].declarations[j].property === "padding-right" && parseInt(ast.stylesheet.rules[i].declarations[j].value, 10) >= 0) {
                                if (ast.stylesheet.rules[i].declarations[j].value !== "auto") {
                                    ast.stylesheet.rules[i].declarations[j].value = "auto";
                                    resetDeclaration.push(ast.stylesheet.rules[i].declarations[j]);
                                }
                            }

                            if (ast.stylesheet.rules[i].declarations[j].property === "left" || ast.stylesheet.rules[i].declarations[j].property === "right") {
                                if (parseInt(ast.stylesheet.rules[i].declarations[j].value, 10) === 0) {
                                    ast.stylesheet.rules[i].declarations[j].value = "unset";
                                    resetDeclaration.push(ast.stylesheet.rules[i].declarations[j]);
                                }

                            }
                        }
                    } catch (error) {
                        console.log("ERROR:", error);
                    }



                }
            });

            totalDifferentDecleration += differentDecleration.length;
            totalResetDeclaration += resetDeclaration.length;

            rule.declarations = differentDecleration.concat(resetDeclaration);
        });

        console.log("diffing done, found %s totalDifferentDecleration and %s totalResetDeclaration", totalDifferentDecleration, totalResetDeclaration);

        var result = cssLib.stringify(astFlipped, { sourcemap: true });
        var res = result.code.replace(/(^[ \t]*\n)/gm, "");
        var resultSass = sass.renderSync({
            data: "html[dir='rtl'] {\n" + res + "\n}"
        });

        fs.writeFile(OUTPUT_FILE_NAME + '.css', resultSass.css, function (err) {
            if (err) throw err;
            console.log(OUTPUT_FILE_NAME + '.css' + ' created');
        });

    }, function (value) {
        console.log("---------ERROR----------");
        console.log(value);
        console.log("----------------------");
    });

});

/*
Copyright [yyyy] [name of copyright owner]

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

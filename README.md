#RTLDIFF

RTLDIFF is CLI tool based on css-flip by Twitter able to detect which CSS rules needs to be added to your CSS file to make your website flip in RTL. It supports LESS and CSS and uses streams.

## Install

clone the repo and run

` npm install `

## Usage

### CSS

You can create the rtl CSS by piping the file into the tool, like this:

` node rtldiff.js < [YOUR_CSS_FILE] `

this will output a file called *` rtl.std.css `* which will contain all the rtl CSS

for example

` node rtldiff.js < testfiles/mytest.css `

### LESS

In case of LESS file you can use it in the following way:

` node rtldiff.js --less [DEPENDENCIES] < [YOUT_LESS_FILE] ` 

for example

` node rtldiff.js --less testfiles/ < testfiles/mylesstest.less ` 

as for the CSS usage, this will output a file called *` rtl.std.css `* which will contain all the rtl CSS

## LICENSE

Copyright [2015,2016] [SimpleSite.com, Pachito Marco Calabrese]

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

## How to contribute

This software is open because we want to hear from you. PRs, suggestions and improvements are welocome.
If you find an *issue* please specify which machine and enviroment are you using.
If you want to have an *improvement* please open an Github Issue and explain with a good level of details what you would like and why.

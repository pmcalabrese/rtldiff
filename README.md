#RTLDIFF

RTLDIFF is CLI tool based on css-flip by Twitter able to detect which CSS rules needs to be added to a CSS file to make it flip in RTL. It supports LESS and CSS and uses streams.

## Install

clone the repo and run

` npm install `

## Usage

### CSS

You can create the rtl CSS by piping the file into the tool, like this:

` node rtldiff.js < [YOUR_CSS_FILE] `

this will output a file called ` *rtl.std.css* ` which will contain all the rtl CSS

for example

` node rtldiff.js < testfiles/mytest.css `

### LESS

In case of LESS file you can use it in the following way:

` node rtldiff.js --less testfiles/ < testfiles/mylesstest.less ` 

as for the CSS usage, this will output a file called ` *rtl.std.css* ` which will contain all the rtl CSS
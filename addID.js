const fs = require('fs');
const needs = JSON.parse(fs.readFileSync('./output.json'));
let index = 0;
needs.forEach((item) => (item.index = index++));
console.log(typeof needs)
const needsstring= JSON. stringify(needs) 
// console.log( needsstring)
fs.writeFile('./needsstring.json', needsstring, err => {
    if (err) {
        console.log('Error writing file', err)
    } else {
        console.log('Successfully wrote file')
    }
})
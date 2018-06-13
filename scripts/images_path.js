const { lstatSync, readdirSync, openSync, appendFileSync, closeSync } = require('fs');
const { join } = require('path');

var paths = [];

const source = 'images';
const isDirectory = source => lstatSync(source).isDirectory();

function getPaths(source){
	readdirSync(source).forEach((name) => {
		name = source + '/' + name;

		if(isDirectory(name)){
			getPaths(name);
		}else{
			paths.push('./'+name);
		}
	});
}

getPaths(source);

const file = openSync('image_paths.js', 'w');

appendFileSync(file,'const images = {};\r\n\r\n');

for(let i = 0; i < paths.length; i++){
	let path = paths[i];

	appendFileSync(file,[
		'images["',
		path.slice(9),
		'"] = require("',
		path,
		'");\r\n'
	].join(''))
}

appendFileSync(file,'\r\nexport default images;');

// paths = JSON.stringify(paths);

// writeFileSync(json,paths);
closeSync(file);
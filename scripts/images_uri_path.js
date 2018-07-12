const { lstatSync, readdirSync, openSync, appendFileSync, closeSync } = require('fs');
const { join } = require('path');
const IMAGE_URL = 'https://satimetobehero.cdnvideo.ru/';

var paths = [];

const source = 'D:/retina/retina';
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

getPaths(source+'/ds1');
// getPaths(source+'/ds2');
// getPaths(source+'/ds3');
// getPaths(source+'/ds4');

const file = openSync('image_uri_paths.js', 'w');

appendFileSync(file,'const image_uris = {};\r\n\r\n');

for(let i = 0; i < paths.length; i++){
	let path = paths[i];

	appendFileSync(file,[
		'image_uris["',
		path.slice(19),
		'"] = "',
		IMAGE_URL + path.slice(19),
		'";\r\n'
	].join(''))
}

appendFileSync(file,'\r\nexport default image_uris;');

// paths = JSON.stringify(paths);

// writeFileSync(json,paths);
closeSync(file);
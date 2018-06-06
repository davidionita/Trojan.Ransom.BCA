function encrypt () {
    var fs = require('fs');
    var crypto = require('crypto');

    var key = '14189dc35ae35e75ff31d7502e245cd9bc7803838fbfd5c773cdcd79b8a28bbd';
    var cipher = crypto.createCipher('aes-256-cbc', key);
    var input = fs.createReadStream('test.txt');
    var output = fs.createWriteStream('kfjdkFFE552.hahaha');

    input.pipe(cipher).pipe(output);


    output.on('finish', function() {
        console.log('Encrypted file written to disk!');
    });


}

encrypt();
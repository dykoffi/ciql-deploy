const { Command } = require('commander');
const program = new Command();
const { prompt } = require('enquirer');


//Server cmd functions
const server_add = require('./server/add');


server
  .command('add <config>')
  .description('Add new server configuration')
  .action((config) => {
    func.verify(async () => {
      if (func.checkStatus("generated")) {

        prompt([
          {
            type: "input",
            name: "host",
            message: "Host",
          },
          {
            type: "input",
            name: "port",
            message: "Port",
            initial: 22
          },
          {
            type: "input",
            name: "user",
            message: "User",
          },
          {
            type: "invisible",
            name: "password",
            message: "Password",
          },
          {
            type: "input",
            name: "path",
            message: "Path",
            initial: "/var/www"
          },
          {
            type: "input",
            name: "cmd",
            message: "Cmd",
            initial: "npm i"
          }
        ])
          .then(({ host, port, user, password, db, path, cmd }) => {
            server_add(config, host, port, user, password)
              .then(mes => {
                logSuccess(mes)

                let identifiant = generator.generate({
                  length: 17,
                  uppercase: false,
                  symbols: false,
                  numbers: true
                });

                identifiant = "sv-" + identifiant

                let dataPath = join(cwd(), ".ciql", "data", ".servers")

                let data = ciqlJSON
                  .create(func.readCryptJson(dataPath))
                  .set(config, { id: identifiant, servername: config, host, port, user, db, path, cmd, pass: password })
                  .getData()

                func.writeCryptJson(data, dataPath)
                logSuccess("Configuration saved")
              })
              .catch(err => { logError(err); process.exit(1) })
              .finally(() => { setTimeout(() => { process.exit(0) }, 1000) })
          })
          .catch(reason => { logError("Broken") })
      }
    })
  })

//Edit server config
server
  .command('edit <config>')
  .description('Edit server configuration')
  .action((config) => {
    func.verify(async () => {
      if (func.checkStatus("generated")) {

        const databasesConfig = ciqlJSON
          .create(func.readCryptJson(join(process.cwd(), '.ciql', 'data', '.databases')))
          .remove('iat')
          .getKeys()

        const configs = ciqlJSON.create(func.readCryptJson(join(cwd(), ".ciql/data/.servers"))).getKeys()
        if (!configs.includes(config)) {
          logError(config + " config not found")
          process.exit(1)
        }

        const { servername, host, port, user, path, cmd, id, pass } = ciqlJSON
          .create(func.readCryptJson(join(cwd(), ".ciql/data/.servers")))
          .getData()[config]

        prompt([
          {
            type: "input",
            name: "servername",
            message: "Server name",
            initial: servername
          },
          {
            type: "input",
            name: "host",
            message: "Host",
            initial: host
          },
          {
            type: "input",
            name: "port",
            message: "Port",
            initial: port
          },
          {
            type: "input",
            name: "user",
            message: "User",
            initial: user
          },
          {
            type: "password",
            name: "password",
            message: "Password",
            initial: pass
          },
          {
            type: "select",
            name: "db",
            message: "Chose database you want to connected",
            choices: databasesConfig
          },
          {
            type: "input",
            name: "path",
            message: "Path",
            initial: path
          },
          {
            type: "input",
            name: "cmd",
            message: "Cmd",
            initial: cmd
          }
        ])
          .then(({ servername, host, port, user, db, password, path, cmd }) => {
            server_edit(config, host, port, user, password)
              .then(mes => {
                logSuccess(mes)

                let dataPath = join(cwd(), ".ciql", "data", ".servers")

                let data = ciqlJSON
                  .create(func.readCryptJson(dataPath))
                  .set(config, { id, servername, host, port, user, db, path, cmd, pass: password })
                  .getData()

                func.writeCryptJson(data, dataPath)
                logSuccess("Configuration saved")
              })
              .catch(err => { logError(err); process.exit(1) })
              .finally(() => { setTimeout(() => { process.exit(0) }, 1000) })
          })
          .catch(() => { logError("Broken") })
      }
    })
  })

program.parse(process.args)

const ciqlJSON = require("ciql-json")
const { join } = require("path")
const table = require("tty-table")
const { readCryptJson } = require("../../libs/function")
const { cwd } = require("process")


function list() {
  return new Promise(async (resolveOK, reject) => {
    try {

      const header = [
        { value: "Config name", color: "red",  },
        { value: "Host" },
        { value: "Port" },
        { value: "User" },
      ]

      const rows = []
      const options = {
        borderStyle: "solid",
        borderColor: "blue",
        headerAlign: "center",
        headerColor: "cyan",
        align: "left",
        color: "white",
        width: "100%"
      }

      const infos = ciqlJSON.create(readCryptJson(join(cwd(), ".cdep/data/.servers"))).getData()
      const servers = ciqlJSON.create(readCryptJson(join(cwd(), ".cdep/data/.servers"))).getKeys()

      servers.forEach(d => {
        if (d !== "iat") {
          rows.push([
            infos[d]["servername"],
            infos[d]["host"],
            infos[d]["port"],
            infos[d]["user"],
          ])
        }
      });
      console.log("\nServers configuration list");
      console.log(table(header, rows, options).render());

      resolveOK("OK")
    } catch (error) {
      reject(error.message)
    }
  })
}

module.exports = list

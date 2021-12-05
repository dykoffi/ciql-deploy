const ciqlJSON = require("ciql-json")
const { join } = require("path")
const table = require("tty-table")
const { readCryptJson } = require("../../libs/function")
const { cwd } = require("process")


function list() {
  return new Promise(async (resolveOK, reject) => {
    try {

      const header = [
        { value: "Job name", color: "red",  },
        { value: "Prebuild script" },
        { value: "Build script" },
        { value: "Artefact" },
        { value: "Post deploy" },
        { value: "Server" },
        { value: "Target path" },
        { value: "Cmd on server" },
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

      const infos = ciqlJSON.create(readCryptJson(join(cwd(), ".cdep/data/.jobs"))).getData()
      const jobs = ciqlJSON.create(readCryptJson(join(cwd(), ".cdep/data/.jobs"))).getKeys()

      jobs.forEach(d => {
        if (d !== "iat") {
          rows.push([
            infos[d]["jobName"],
            infos[d]["prebuild"],
            infos[d]["build"],
            infos[d]["artefact"],
            infos[d]["postdeploy"],
            infos[d]["serverName"],
            infos[d]["serverTargetPath"],
            infos[d]["serverCmd"],
          ])
        }
      });
      console.log("\nJobs configuration list");
      console.log(table(header, rows, options).render());

      resolveOK("OK")
    } catch (error) {
      reject(error.message)
    }
  })
}

module.exports = list

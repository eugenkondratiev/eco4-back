const dataTable = (blr) => blr === "blr4" ?
    "`eco4`.`hours`" :
    blr === "t5" ?
    "`t5`.`hours5`" :
    "`eco2`.`hr3`"

module.exports = dataTable
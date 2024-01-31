const dataTable = (blr) => blr === "blr4" ?
    "`eco4`.`hours`" :
    blr === "t5" || blr === "el" ?
    "`t5`.`hours5`" :
    blr === "blr1" ? 
    "`eco2`.`hr3`" :
    "`eco`.`hourseco2`"


module.exports = dataTable
const main = require('../javascripts/model/update-ai-params');

main().then((d) => {
    console.log("main result - ", d)

    setTimeout(() => {
        require('../javascripts/model/connection-pool-eco')().end()
    }, 5000);
}).catch(e => console.log(e))

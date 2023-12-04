// const views = "d:\\JS\\_eco\\eco4-express\\views";
require('dotenv').config()

const views = process.env.VIEWS
console.log("##### views", views)
module.exports = {
    views: views
}
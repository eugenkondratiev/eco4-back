// const views = "d:\\JS\\_eco\\eco4-express\\views";
require('dotenv').config()

const views = process.env.VIEWS

module.exports = {
    views: views
}
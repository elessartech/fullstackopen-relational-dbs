const { Blog } = require('../models/index')

const blogFinder = async (req, res, next) => {
    req.blog = await Blog.findByPk(req.params.id)
    next()
}

module.exports = {
    blogFinder
}
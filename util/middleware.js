const { Blog } = require('../models/index')

const blogFinder = async (req, res, next) => {
    req.blog = await Blog.findByPk(req.params.id)
    next()
}

const errorHandler = (error, _, response, next) => {
    console.error(error.message);
    if (error.name === 'SequelizeValidationError') {
        return response.status(400).json({ error: error.message });
    }
    next(error)
}

module.exports = {
    blogFinder,
    errorHandler
}
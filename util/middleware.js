const { Blog } = require('../models/index')
const { SECRET } = require('./config')
const jwt = require('jsonwebtoken')

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

const tokenExtractor = (req, res, next) => {
    const authorization = req.get('authorization');
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
        try {
            req.token = authorization.replace('Bearer ', '');
        } catch (error) {
            return res.status(401).json({ error: 'token invalid' })
        }
    } else {
        return res.status(401).json({ error: 'token missing' })
    }
    next();
};

const tokenVerifier = (req, res, next) => {
    const token = req.query.token;
    if (!token) {
        return res.status(401).json({ error: 'token missing' });
    }
    req.user = jwt.verify(token, SECRET);
    next();
};

module.exports = {
    blogFinder,
    errorHandler,
    tokenExtractor,
    tokenVerifier
}
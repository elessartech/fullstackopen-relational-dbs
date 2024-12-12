const router = require('express').Router()
const { Op } = require('sequelize');


const { Blog, User } = require('../models')
const middleware = require('../util/middleware');

router.get('/', async (req, res) => {
    try {
        let where = {};
        const search = req.query.search;
        if (search) {
        where = {
            [Op.or]: [
              {
                title: { [Op.iLike]: `%${req.query.search}%` }
              },
              {
                author: { [Op.iLike]: `%${req.query.search}%` }
              }
            ]
          };
        }

        const blogs = await Blog.findAll({
            attributes: { exclude: ['userId'] },
            include: {
                model: User,
                attributes: ['name']
            },
            where,
            order: [
                ['likes', 'DESC'],
              ],
            });

        res.json(blogs);
    } catch (error) {
        console.error('Error fetching blogs:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

  
router.post('/', middleware.tokenVerifier, async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id);
        const blog = await Blog.create({ ...req.body, userId: user.id });
        return res.json(blog)
    } catch(error) {
        return res.status(400).json({ error })
    }
})

router.delete('/:id', middleware.tokenVerifier, async (req, res) => {
    const blog = await Blog.findByPk(req.params.id)
    if (!blog) {
        return res.status(404).end()
    }
    if (req.user.id !== blog.userId) {
      return res.status(401).json({ error: 'unauthorized' })
    }
    if (blog) {
      await blog.destroy()
    }
    res.status(204).end()
})

router.put('/:id', async (req, res) => {
    const blog = await Blog.findByPk(req.params.id);
    if (blog) {
        blog.likes += 1;
        await blog.save();
        res.json(blog);
    } else {
        res.status(404).end();
    }
});


module.exports = router

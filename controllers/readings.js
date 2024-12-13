const router = require('express').Router();
const { UserBlogs } = require('../models');
const middleware = require('../util/middleware');

router.post('/', async (req, res) => {
  const blog = await UserBlogs.create(req.body);
  return res.json(blog);
});

router.put('/:id', middleware.tokenVerifier, async (req, res) => {
    const reading = await UserBlogs.findByPk(req.params.id);
    const body = req.body;
    if (!reading || !body) {
        return res.status(404).json({ error: 'reading not found' });
    }
    if (req.user.id !== reading.userId) {
        return res.status(403).json({ error: 'unauthorized' });
    }
    reading.read = body.read;
    await reading.save();
    return res.json(reading);
});

module.exports = router;
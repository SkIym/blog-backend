const jwt = require('jsonwebtoken')
const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

// no express-async-errors yet, so use try/catch

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog
        .find({})
        .populate('user', {'username': 1, 'name': 1})
    response.json(blogs)

})
  
blogsRouter.post('/', async (request, response) => {
    const blog = new Blog(request.body)

    const decodedToken = jwt.verify(request.token, process.env.SECRET)

    if(!decodedToken.id) {
        return response.status(401).json({ error: 'token invalid' })
    }

    if(!blog.likes) {
        blog.likes = 0
    }
    if(!blog.title || !blog.url) {
        response.status(400).end()
    }

    const user = await User.findById(decodedToken.id)
    blog.user = user.id

    const newBlog = new Blog(blog)

    const savedBlog = await newBlog.save()

    user.blogs = user.blogs.concat(savedBlog._id)

    await user.save()

    response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', async (request, response, next) => {

    await Blog.findByIdAndDelete(request.params.id)
    response.status(204).end()
})

blogsRouter.put('/:id', async (request, response, next) => {
    const { title, author, url, likes } = request.body
    const updatedBlog = await Blog.findByIdAndUpdate(
        request.params.id,
        { title, author, url, likes },
        { new: true })

    response.json(updatedBlog)

    next(exception)

})

module.exports = blogsRouter
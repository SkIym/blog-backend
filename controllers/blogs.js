const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

// no express-async-errors yet, so use try/catch

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({})
    response.json(blogs)

})
  
blogsRouter.post('/', async (request, response, next) => {
    const blog = new Blog(request.body)
    try {
        if(!blog.likes) {
            blog.likes = 0
        }
        if(!blog.title || !blog.url) {
            response.status(400).end()
        }
        const savedBlog = await blog.save()
        response.status(201).json(savedBlog)
    } catch(exception) {
        next(exception)
    }
})

blogsRouter.delete('/:id', async (request, response, next) => {
    try {
        await Blog.findByIdAndDelete(request.params.id)
        response.status(204).end()
    } catch(exception) {
        next(exception)
    }
})

blogsRouter.put('/:id', async (request, response, next) => {
    const { title, author, url, likes } = request.body
    try {
        const updatedBlog = await Blog.findByIdAndUpdate(
            request.params.id,
            { title, author, url, likes },
            { new: true })

        response.json(updatedBlog)
    } catch(exception) {
        next(exception)
    }
})

module.exports = blogsRouter
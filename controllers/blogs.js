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
  
blogsRouter.post('/', async (request, response, next) => {
    const {title, author, url, likes} = new Blog(request.body)
    try {
        if(!likes) {
            likes = 0
        }
        if(!title || !url) {
            response.status(400).end()
        }

        const user = await User.findOne({})
        
        const blog = new Blog({
            title,
            author,
            url,
            likes, 
            user: user.id
        })

        const savedBlog = await blog.save()

        user.blogs = user.blogs.concat(savedBlog._id)

        await user.save()

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
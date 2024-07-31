const jwt = require('jsonwebtoken')
const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const middleware = require('../utils/middleware')

// no express-async-errors yet, so use try/catch

blogsRouter.get('/', async (request, response) => {

    const blogs = await Blog
        .find({})
        .populate('user', {'username': 1, 'name': 1})
    response.json(blogs)

})
  
blogsRouter.post('/', middleware.userExtractor, async (request, response) => {
    const blog = new Blog(request.body)

    if(!blog.likes) {
        blog.likes = 0
    }


    const user = request.user
    blog.user = user.id

    const newBlog = new Blog(blog)

    const savedBlog = await newBlog.save()

    user.blogs = user.blogs.concat(savedBlog._id)

    await user.save()
    await savedBlog.populate('user', {'username': 1, 'name': 1}) // tmeporary fix here
    response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', middleware.userExtractor, async (request, response) => {

    const user = request.user
    const blog = await Blog.findById(request.params.id)

    if (!blog) {
        return response.status(400).json({ error: 'blog already deleted' })
    }

    if (blog.user.toString() === user.id) {
        await Blog.deleteOne({ _id: blog.id })
    } else {
        return response.status(401).json({ error: 'invalid user' })
    }

    user.blogs = user.blogs.filter(b => b._id !== blog.id)
    await user.save()
    response.status(204).end()
})

blogsRouter.put('/:id', middleware.userExtractor, async (request, response) => {

    const { title, author, url, likes, user} = request.body
    const user_id = user.id // the user feild data from the frontend is populated
    const updatedBlog = await Blog.findByIdAndUpdate(
        request.params.id,
        { title, author, url, likes, user_id },
        { new: true })
    
    await updatedBlog.populate('user', {'username': 1, 'name': 1})
    response.json(updatedBlog)

})

module.exports = blogsRouter
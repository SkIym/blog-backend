const Blog = require('../models/blog')

const initialBlogs = [
    {
        title: "Canonical string reduction",
        author: "Edsger W. Dijkstra",
        url: "https://www.google.com/",
        likes: 12
    },
    {
        title: "Flower",
        author: "Edsger W. Fllyed",
        url: "https://www.google.com/",
        likes: 4
    },
    {
        title: "Gulp gulp gulp",
        author: "Edsger W. Warsahll",
        url: "https://www.google.com/",
        likes: 17
    },
]

const nonExistingId = async () => {
    const blog = new Blog({ title: 'willremovethissoon' })
    await blog.save()
    await blog.deleteOne()

    return blog._id.toString()
}

const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
}

module.exports = {
    initialBlogs, nonExistingId, blogsInDb
}
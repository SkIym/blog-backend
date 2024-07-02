const { test, after, describe, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const helper = require('./test_helper')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)
const Blog = require('../models/blog')

const listHelper = require('../utils/list_helper')

beforeEach(async () => { // before EACH  test
    await Blog.deleteMany({})

    for (let blog of helper.initialBlogs) {
        let blogObject = new Blog(blog)
        await blogObject.save()
    }
})

test('blogs are returned as json', async () => {
    await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
})

test('there are three notes', async () => {
    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, helper.initialBlogs.length)
})

test('unique identifier property is named id', async () => {
    const response = await api.get('/api/blogs')
    const ids = response.body.map(r => r.id)
    console.log(ids)
    assert(ids[0])
})

test('a valid blog can be added', async () => {
    const newBlog = {
        title: "Forever",
        author: "baby M. On",
        url: "https://www.google.com/",
        likes: 5
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)
    
    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

    const contents = blogsAtEnd.map(r => r.title)
    assert(contents.includes('Forever'))
})

test('blog without likes is defaulted with 0 likes', async () => {
    const newBlog = {
        title: "SHEEESH",
        author: "baby M. On",
        url: "https://www.google.com/",
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)
    
    const blogsAtEnd = await helper.blogsInDb()
    const blogToCheck = blogsAtEnd.find(blog => blog.title === "SHEEESH")
    assert.strictEqual(blogToCheck.likes, 0)
})

test.only('blogs without title are not added', async () => {
    const newBlog = {
        author: "Jessa Zaragoza",
        url: "https://www.google.com/",
        likes: 89
    }
    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)
    
        const blogsAtEnd = await helper.blogsInDb()
        assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
})

test.only('blogs without url are not added', async () => {
    const newBlog = {
        title: "Bakit Pa",
        author: "Jessa Zaragoza",
        likes: 89
    }
    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)
    
        const blogsAtEnd = await helper.blogsInDb()
        assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
})

after(async () => { // after ALL tests
    await mongoose.connection.close()
})
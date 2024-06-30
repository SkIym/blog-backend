const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    const total = blogs.reduce((sum, curr) => {
        return sum + curr.likes
    }, 0)
    return total
}

const favoriteBlog = (blogs) => {
    const fav = blogs.reduce((max, curr) => {
            return curr.likes > max.likes ? curr : max
        }, blogs[0])
    return blogs.length === 0 
        ? 'No blogs found'
        : fav
}

const mostBlogs = (blogs) => {
    const authors = []
    blogs.map(blog => {
        const author = authors.find(a => a.author === blog.author)
        if (author) {
            author.blogs += 1
        } else {
            authors.push({ author: blog.author, blogs: 1 })
        }
    }
    )
    const most = authors.reduce((max, curr) => {
        return curr.blogs > max.blogs ? curr : max
    }, authors[0])
    return blogs.length === 0 
        ? 'No blogs found'
        : most
}

const mostLikes = (blogs) => {
    const authors = []
    blogs.map(blog => {
        const author = authors.find(a => a.author === blog.author)
        if (author) {
            author.likes += blog.likes
        } else {
            authors.push({ author: blog.author, likes: blog.likes })
        }
    }
    )
    const most = authors.reduce((max, curr) => {
        return curr.likes > max.likes ? curr : max
    }, authors[0])
    return blogs.length === 0 
        ? 'No blogs found'
        : most
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}

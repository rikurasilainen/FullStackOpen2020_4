const _ = require('lodash')

const dummy = (blogs => {
    return 1
})

const totalLikes = (blogs) => {
    return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
    let highestLikes = 0;
    let blog = null;
    for (let index = 0; index < blogs.length; index++) {
        if (blogs[index].likes > highestLikes) {
            highestLikes = blogs[index].likes
            blog = blogs[index]
        }
    }
    if (blog === null) {
        return 0;
    } else {
        return { title: blog.title, author: blog.author, likes: blog.likes }
    }
}

const mostBlogs = (blogs) => {
    const authors = _.countBy(blogs, blog => blog.author)
    const author = _.keys(authors).map(key => {
        return {
            author: key,
            blogs: authors[key]
        }
    })
    return _.maxBy(author, 'blogs')
}

const mostLikes = (blogs) => {
    const authors = []
    blogs.forEach(blog => {
        if (!authors[blog.author]) authors[blog.author] = 0
        authors[blog.author] += blog.likes
    })

    const most = _.keys(authors).map(key => {
        return {
            author: key,
            likes: authors[key]
        }
    })
    return _.maxBy(most, 'likes')
}

module.exports = { dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes }
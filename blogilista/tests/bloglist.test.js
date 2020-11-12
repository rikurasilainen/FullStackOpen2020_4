const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const User = require('../models/user')
const helper = require('./test_helper')
const bcrypt = require('bcrypt')

beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)
})

describe('getting blogs', () => {
    test('blogs are returned as json', async () => {
        await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })

    test('the amount of blogs is returned is the size of the initial list', async () => {
        const response = await api.get('/api/blogs')
        expect(response.body).toHaveLength(helper.initialBlogs.length)
    })

    test('the first blog title is "React patterns"', async () => {
        const response = await api.get('/api/blogs')
        const title = response.body.map(b => b.title)
        expect(title).toContain('React patterns')
    })

    test('a specific blog can be viewed', async () => {
        const startBlogs = await helper.blogsInDb()
        const blog = startBlogs[0]

        const result = await api
            .get(`/api/blogs/${blog.id}`)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        const jsonBlog = JSON.parse(JSON.stringify(blog))
        expect(result.body).toEqual(jsonBlog)
    })
})

describe('posting blogs', () => {
    test('blog without valid fields is not added', async () => {
        const blogWithNoTitle = {
            _id: "5a422bc61b54a676234d17fc",
            author: "Robert C. Martin",
            url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
            likes: 2,
            __v: 0
        }

        const blogWithNoUrl = {
            _id: "5a422bc61b54a676234d17fc",
            title: "Type wars",
            author: "Robert C. Martin",
            likes: 2,
            __v: 0
        }

        await api
            .post('/api/blogs')
            .send(blogWithNoTitle)
            .expect(400)

        await api
            .post('/api/blogs')
            .send(blogWithNoUrl)
            .expect(400)

        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
    })

    test('a valid blog can be added ', async () => {
        const newBlog = {
            _id: "5a422bc61b54a676234d17fc",
            title: "Type wars",
            author: "Robert C. Martin",
            url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
            likes: 2,
            __v: 0
        }

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(200)
            .expect('Content-Type', 'application/json; charset=utf-8')

        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)
        const id = blogsAtEnd.map(b => b.id)
        expect(id).toBeDefined()
        const title = blogsAtEnd.map(b => b.title)
        expect(title).toContain(('Type wars'))
    })

    test('if likes is undefined, likes is 0', async () => {
        await Blog.deleteMany({})
        const newBlog = {
            _id: "5a422bc61b54a676234d17fc",
            title: "Type wars",
            author: "Robert C. Martin",
            url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
            likes: undefined,
            __v: 0
        }

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(200)

        const blogsAtEnd = await helper.blogsInDb()
        const likes = blogsAtEnd[0].likes
        expect(likes).toBe(0)
    })
})

describe('altering blogs', () => {
    test('a blog can be deleted', async () => {
        const startBlogs = await helper.blogsInDb()
        const deleteBlog = startBlogs[0]

        await api
            .delete(`/api/blogs/${deleteBlog.id}`)
            .expect(204)

        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1)

        const title = blogsAtEnd.map(b => b.title)
        expect(title).not.toContain(deleteBlog.title)
    })

    test('a blog can be altered', async () => {
        const startBlogs = await helper.blogsInDb()
        await api
            .put(`/api/blogs/${startBlogs[0].id}`)
            .send({ likes: 1 })
            .expect(200)
            .expect('Content-Type', 'application/json; charset=utf-8')
        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd[0].likes).toBe(1)
    })
})

describe('tests with initially one user in db', () => {
    beforeEach(async () => {
        await User.deleteMany({})
        const passwordHash = await bcrypt.hash('sekret', 10)
        const user = new User({ username: 'root', passwordHash })
        await user.save()
    })

    test('creation succeeds with a fresh username', async () => {
        const startUsers = await helper.usersInDb()
        const user = {
            username: 'dudeperson',
            name: 'persondude',
            password: 'secret'
        }

        await api
            .post('/api/users')
            .send(user)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        const endUsers = await helper.usersInDb()
        expect(endUsers).toHaveLength(startUsers.length + 1)

        const usernames = endUsers.map(u => u.username)
        expect(usernames).toContain(user.username)

    })

    test('creation fails with proper statuscode if username already exists', async () => {
        const startUsers = await helper.usersInDb()

        const user = {
            username: 'root',
            name: 'Superuser',
            password: 'salainen'
        }

        const result = await api
            .post('/api/users')
            .send(user)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        expect(result.body.error).toContain('`username` to be unique')

        const endUsers = await helper.usersInDb()
        expect(endUsers).toHaveLength(startUsers.length)

    })

    test('creation fails when password is too short (>3)', async () => {
        const startUsers = await helper.usersInDb()

        const user = {
            username: 'unique username',
            name: 'person name',
            password: 'pw'
        }

        const result = await api
            .post('/api/users')
            .send(user)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        expect(result.body.error).toContain('Password')
        const endUsers = await helper.usersInDb()
        expect(endUsers).toHaveLength(startUsers.length)
    })

    //gives internal server error?
    test('creation fails when username is missing or too short', async () => {
        const startUsers = await helper.usersInDb()

        const user = {
            username: '',
            name: 'person name',
            password: 'validpassword'
        }

        const result = await api
            .post('/api/users')
            .send(user)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        expect(result.body.error).toContain('Username')
        const endUsers = await helper.usersInDb()
        expect(endUsers).toHaveLength(startUsers.length)
    })
})

afterAll(() => {
    mongoose.connection.close()
})
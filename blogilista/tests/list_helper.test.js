const listHelper = require('../utils/list_helper')
const blogs = require('./data').testBlogs
const emptyList = []
const oneBlogList = [
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0
  }
]

test('dummy returns one', () => {
  const dummy = []
  const result = listHelper.dummy(dummy)
  expect(result).toBe(1)
})

describe('total likes', () => {
  test('sum of likes on a list of many blogs is calculated correctly', () => {
    const result = listHelper.totalLikes(blogs)
    expect(result).toBe(36)
  })

  test('empty list is empty (shows 0 likes)', () => {
    const result = listHelper.totalLikes(emptyList)
    expect(result).toBe(0)
  })

  test('list with one blog returns the likes of that one blog', () => {
    const result = listHelper.totalLikes(oneBlogList)
    expect(result).toBe(5)
  })
})

describe('favorite blog', () => {
  test('returns favorite blog from big list', () => {
    const result = listHelper.favoriteBlog(blogs)
    expect(result).toEqual({
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      likes: 12
    })
  })
  test('empty list returns 0', () => {
    const result = listHelper.favoriteBlog(emptyList)
    expect(result).toBe(0)
  })
  test('list of one blog returns that one blog', () => {
    const result = listHelper.favoriteBlog(oneBlogList)
    expect(result).toEqual({
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      likes: 5
    })
  })
})

describe('most blogs', () => {
  test('list with many blogs returns the correct author', () => {
    const result = listHelper.mostBlogs(blogs)
    expect(result).toEqual({ author: 'Robert C. Martin', blogs: 3 })
  })
  test('list with one blog returns the one author', () => {
    const result = listHelper.mostBlogs(oneBlogList)
    expect(result).toEqual({author: 'Edsger W. Dijkstra', blogs: 1})
  })
  test('list with no blogs returns undefined', () => {
    const result = listHelper.mostBlogs(emptyList)
    expect(result).toEqual(undefined)
  })
})

describe('most likes', () => {
  test('list with many blogs returns the correct author', () => {
    const result = listHelper.mostLikes(blogs)
    expect(result).toEqual({author: 'Edsger W. Dijkstra', likes: 17})
  })
  test('list with one blog returns the correct likes and author', () => {
    const result = listHelper.mostLikes(oneBlogList)
    expect(result).toEqual({author: 'Edsger W. Dijkstra', likes: 5})
  })
  test('list with no blogs returns undefined', () => {
    const result = listHelper.mostLikes(emptyList)
    expect(result).toEqual(undefined)
  })
})
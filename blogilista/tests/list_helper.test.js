const listHelper = require('../utils/list_helper')
const blogs = require('./data').testBlogs

test('dummy returns one', () => {
  const blogs = []
  const result = listHelper.dummy(blogs)
  expect(result).toBe(1)
})

describe('total likes tests', () => {

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
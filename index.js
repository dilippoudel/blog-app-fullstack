const blogs = [
  {
    _id: '5a422a851b54a676234d17f7',
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    __v: 0,
  },
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url:
      'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0,
  },
  {
    _id: '5a422b3a1b54a676234d17f9',
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
    __v: 0,
  },
  {
    _id: '5a422b891b54a676234d17fa',
    title: 'First class tests',
    author: 'Robert C. Martin',
    url:
      'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 10,
    __v: 0,
  },
  {
    _id: '5a422ba71b54a676234d17fb',
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url:
      'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 0,
    __v: 0,
  },
  {
    _id: '5a422bc61b54a676234d17fc',
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2,
    __v: 0,
  },
]

const mostBlogs = (lists) => {
  function getOccurance(arrs, author) {
    let count = 0
    arrs.forEach((v) => v === author && count++)
    return { author: author, blogs: count }
  }
  const authorList = lists.map((blog) => blog.author)
  const blogStats = lists.map((author) => {
    return getOccurance(authorList, author.author)
  })
  let highestCount = Math.max(...blogStats.map((blog) => blog.blogs))
  return blogStats.find((blog) => blog.blogs === highestCount)
}
// console.log(moclearstBlogs(blogs))

const favouriteBlogItems = (blogs) => {
  let highestLikes = Math.max(...blogs.map((blog) => blog.likes))
  let favouriteBlog = lists.find((blog) => blog.likes === highestLikes)

  return {
    title: favouriteBlog.title,
    author: favouriteBlog.author,
    likes: favouriteBlog.likes,
  }
}
const mostLikes = (lists) => {
  function getOccurance(arrs, author) {
    let likes = 0
    arrs.forEach((v) => {
      if (v.author === author) {
        likes = v.likes + likes
      }
    })
    return { author: author, likes: likes }
  }
  const authorList = lists.map((blog) => {
    return {
      author: blog.author,
      likes: blog.likes,
    }
  })

  const blogStats = lists.map((author) => {
    return getOccurance(authorList, author.author)
  })

  let highestCount = Math.max(...blogStats.map((blog) => blog.likes))
  return blogStats.find((blog) => blog.likes === highestCount)
}
console.log(mostLikes(blogs))

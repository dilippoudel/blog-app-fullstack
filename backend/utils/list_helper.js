// eslint-disable-next-line no-unused-vars
const dummy = (blogs) => {
  return 1
}
const totalLikes = (blogs) => {
  if (blogs.length === 0) {
    return 0
  }
  return blogs.map((blog) => blog.likes).reduce((a, c) => a + c, 0)
}
const favouriteBlog = (blogs) => {
  let highestLikes = Math.max(...blogs.map((blog) => blog.likes))
  let favouriteBlog = blogs.find((blog) => blog.likes === highestLikes)

  return {
    title: favouriteBlog.title,
    author: favouriteBlog.author,
    likes: favouriteBlog.likes,
  }
}
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

module.exports = { dummy, totalLikes, favouriteBlog, mostBlogs }

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
module.exports = { dummy, totalLikes, favouriteBlog }

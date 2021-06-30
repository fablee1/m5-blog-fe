import React, { useState, useEffect } from "react"
import { Container, Image } from "react-bootstrap"
import { withRouter } from "react-router"
import BlogAuthor from "../../components/blog/blog-author"
import { BACKEND_URL } from "../../env.js"
import "./styles.css"
const Blog = (props) => {
  const [post, setPost] = useState(null)

  const fetchPost = async () => {
    const response = await fetch(BACKEND_URL + "posts/" + props.match.params.id)
    if (response.ok) {
      const data = await response.json()
      setPost(data)
    } else {
      console.log("error fetching post")
    }
  }

  useEffect(() => {
    fetchPost()
  }, [])

  return (
    post && (
      <div className="blog-details-root">
        <Container>
          <Image className="blog-details-cover" src={post.cover} fluid />
          <h1 className="blog-details-title">{post.title}</h1>

          <div className="blog-details-container">
            <div className="blog-details-author">
              <BlogAuthor {...post.author} />
            </div>
            <div className="blog-details-info">
              <div>{post.createdAt}</div>
              <div>{`${post.readTime.value} ${post.readTime.unit} read`}</div>
            </div>
          </div>

          <div dangerouslySetInnerHTML={{ __html: post.content }}></div>
        </Container>
      </div>
    )
  )
}

export default withRouter(Blog)

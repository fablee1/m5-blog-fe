import React from "react"
import { Card } from "react-bootstrap"
import BlogAuthor from "../blog-author"
import { Link } from "react-router-dom"
import { RiDeleteBin6Line } from "react-icons/ri"
import "./styles.css"

const BlogItem = (props) => {
  const deletePost = async (e) => {
    e.preventDefault()
    const response = await fetch("http://localhost:3001/posts/" + props._id, {
      method: "DELETE",
    })
    if (response.ok) {
      props.refresh()
      console.log("deleted")
    } else {
      console.log("error deleting")
    }
  }

  return (
    <Link to={`/blog/${props._id}`} className="blog-link">
      <Card className="blog-card">
        <Card.Img variant="top" src={props.cover} className="blog-cover" />
        <Card.Body>
          <Card.Title>{props.title}</Card.Title>
        </Card.Body>
        <Card.Footer>
          <BlogAuthor {...props.author} />
          <button
            className="author-card-btn delete-btn"
            onClick={(e) => deletePost(e)}>
            <RiDeleteBin6Line />
          </button>
        </Card.Footer>
      </Card>
    </Link>
  )
}

export default BlogItem

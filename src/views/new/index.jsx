import React, { useState, useEffect } from "react"
import "react-quill/dist/quill.snow.css"
import ReactQuill from "react-quill"
import { Container, Form, Button } from "react-bootstrap"
import "./styles.css"

const NewBlogPost = (props) => {
  const [categories, setCategories] = useState(null)
  const [authors, setAuthors] = useState(null)
  const [form, setForm] = useState({
    category: "",
    title: "",
    cover: "",
    readTime: {},
    author: "",
    content: "",
  })
  const [newCategory, setNewCategory] = useState(false)

  const fetchPost = async (id) => {
    const response = await fetch("http://localhost:3001/posts/" + id)
    if (response.ok) {
      const data = await response.json()
      setForm(data)
    } else {
      console.log("error fetching post")
    }
  }

  const fetchAuthors = async () => {
    const response = await fetch("http://localhost:3001/authors")
    if (response.ok) {
      const data = await response.json()
      setAuthors(data)
      setForm({ ...form, author: data[0]._id })
    } else {
      console.log("error fetching authors")
    }
  }

  const fetchCategories = async () => {
    const response = await fetch("http://localhost:3001/posts")
    if (response.ok) {
      const data = await response.json()
      setCategories(Array.from(new Set(data.map((p) => p.category))))
    } else {
      console.log("error fetching categories")
    }
  }

  useEffect(() => {
    fetchAuthors()
    fetchCategories()
    if (props.match.params.id) {
      fetchPost(props.match.params.id)
    }
  }, [])

  const changeForm = (e) => {
    setForm({ ...form, [e.target.id]: e.target.value })
  }

  const postPost = async () => {
    const response = await fetch("http://localhost:3001/posts", {
      method: "POST",
      body: JSON.stringify(form),
      headers: {
        "Content-Type": "application/json",
      },
    })
    if (response.ok) {
      console.log("ok")
    } else {
      console.log(response)
    }
  }

  const editPost = async () => {
    const response = await fetch("http://localhost:3001/posts/" + form._id, {
      method: "PUT",
      body: JSON.stringify(form),
      headers: {
        "Content-Type": "application/json",
      },
    })
    if (response.ok) {
      console.log("ok")
    } else {
      console.log(response)
    }
  }

  const handlePost = async (e) => {
    e.preventDefault()

    if (!props.match.params.id) {
      await postPost()
    } else {
      await editPost()
    }
    props.history.push("/")
  }

  return (
    <Container className="new-blog-container">
      <Form className="mt-5" onSubmit={(e) => handlePost(e)}>
        <Form.Group controlId="title" className="mt-3">
          <Form.Label>Title</Form.Label>
          <Form.Control
            size="lg"
            placeholder="Title"
            value={form.title}
            onChange={(e) => changeForm(e)}
          />
        </Form.Group>
        <Form.Group controlId="category" className="mt-3">
          <Form.Label>Category</Form.Label>
          <Form.Control
            size="lg"
            as="select"
            onChange={(e) => {
              changeForm(e)
              e.target.value === "new"
                ? setNewCategory(true)
                : setNewCategory(false)
            }}>
            <option>Choose...</option>
            <option value="new">New Category</option>
            {categories &&
              categories.map((cat) => <option value={cat}>{cat}</option>)}
          </Form.Control>
        </Form.Group>
        {newCategory && (
          <Form.Group controlId="category" className="mt-3">
            <Form.Label>New Category</Form.Label>
            <Form.Control
              size="lg"
              value={form.category}
              onChange={(e) => changeForm(e)}
            />
          </Form.Group>
        )}
        <Form.Group controlId="author" className="mt-3">
          <Form.Label>Author</Form.Label>
          <Form.Control size="lg" as="select" onChange={(e) => changeForm(e)}>
            {authors &&
              authors.map((a) => (
                <option value={a._id}>
                  {a.name} {a.surname}
                </option>
              ))}
          </Form.Control>
        </Form.Group>
        <Form.Group controlId="cover" className="mt-3">
          <Form.Label>Cover URL</Form.Label>
          <Form.Control
            size="lg"
            placeholder="URL"
            value={form.cover}
            onChange={(e) => changeForm(e)}
          />
        </Form.Group>
        <Form.Group controlId="content" className="mt-3">
          <Form.Label>Blog Content</Form.Label>
          <ReactQuill
            value={form.content}
            onChange={(value) => setForm({ ...form, content: value })}
            className="new-blog-content"
          />
        </Form.Group>
        <Form.Group className="d-flex mt-3 justify-content-end">
          <Button type="reset" size="lg" variant="outline-dark">
            Reset
          </Button>
          <Button
            type="submit"
            size="lg"
            variant="dark"
            style={{ marginLeft: "1em" }}>
            Submit
          </Button>
        </Form.Group>
      </Form>
    </Container>
  )
}

export default NewBlogPost

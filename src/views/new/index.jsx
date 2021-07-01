import React, { useState, useEffect } from "react"
import "react-quill/dist/quill.snow.css"
import ReactQuill from "react-quill"
import { Container, Form, Button, Col, Row } from "react-bootstrap"
import "./styles.css"
import { BACKEND_URL } from "./../../env.js"

const NewBlogPost = (props) => {
  const [categories, setCategories] = useState(null)
  const [authors, setAuthors] = useState(null)
  const [form, setForm] = useState({
    category: "",
    title: "",
    cover: "",
    author: "",
    content: "",
  })
  const [newCategory, setNewCategory] = useState(false)

  const [cover, setCover] = useState(null)
  const [coverURL, setCoverURL] = useState(null)

  const [fileTypeSelected, setFileTypeSelected] = useState(null)

  const postImage = async (type, id) => {
    let options
    if (type === "url") {
      options = {
        method: "POST",
        body: JSON.stringify({ url: coverURL }),
        headers: { "Content-Type": "application/json" },
      }
    } else {
      const formData = new FormData()
      formData.append("cover", cover)
      options = {
        method: "POST",
        body: formData,
      }
    }

    const response = await fetch(
      BACKEND_URL + "posts/" + id + "/upload",
      options
    )
    if (response.ok) {
      console.log("ok")
    } else {
      console.log(response)
    }
  }

  const fetchPost = async (id) => {
    const response = await fetch(BACKEND_URL + "posts/" + id)
    if (response.ok) {
      const data = await response.json()
      setForm({
        category: data.category,
        title: data.title,
        cover: data.cover,
        author: data.author._id,
        content: data.content,
      })
    } else {
      console.log("error fetching post")
    }
  }

  const fetchAuthors = async () => {
    const response = await fetch(BACKEND_URL + "authors")
    if (response.ok) {
      const data = await response.json()
      setAuthors(data)
      setForm({ ...form, author: data[0]._id })
    } else {
      console.log("error fetching authors")
    }
  }

  const fetchCategories = async () => {
    const response = await fetch(BACKEND_URL + "posts")
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
    const response = await fetch(BACKEND_URL + "posts", {
      method: "POST",
      body: JSON.stringify(form),
      headers: {
        "Content-Type": "application/json",
      },
    })
    if (response.ok) {
      const data = await response.json()
      return data
    } else {
      console.log(response)
    }
  }

  const editPost = async () => {
    const response = await fetch(BACKEND_URL + "posts/" + form._id, {
      method: "PUT",
      body: JSON.stringify(form),
      headers: {
        "Content-Type": "application/json",
      },
    })
    if (response.ok) {
      const data = await response.json()
      return data
    } else {
      console.log(response)
    }
  }

  const handlePost = async (e) => {
    e.preventDefault()
    let id
    if (!props.match.params.id) {
      const data = await postPost()
      id = data._id
    } else {
      const data = await editPost()
      id = data._id
    }
    if (fileTypeSelected !== null) {
      await postImage(fileTypeSelected, id)
    }
    props.history.push("/")
  }

  const changeFileType = (e) => {
    console.log(fileTypeSelected)
    if (e.target.id === "coverURL") {
      if (e.target.value.length === 0) {
        setFileTypeSelected(null)
        setCoverURL(null)
      } else {
        setFileTypeSelected("url")
        setCoverURL(e.target.value)
      }
    } else {
      if (e.target.files.length === 0) {
        setFileTypeSelected(null)
        setCover(null)
      } else {
        setFileTypeSelected("file")
        setCover(e.target.files[0])
      }
    }
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
        <Row>
          <Col>
            <Form.Group controlId="coverURL" className="mt-3">
              <Form.Label>Cover URL</Form.Label>
              <Form.Control
                size="lg"
                placeholder="URL"
                value={coverURL}
                onChange={(e) => {
                  changeFileType(e)
                }}
                disabled={fileTypeSelected === "file"}
              />
            </Form.Group>
          </Col>
          <Col className="d-flex justify-content-center align-items-end">
            <h2>OR</h2>
          </Col>
          <Col>
            <Form.Group controlId="cover" className="mt-3">
              <Form.Label>File</Form.Label>
              <div className="d-flex align-items-center input-file-holder">
                <Form.Control
                  size="lg"
                  type="file"
                  onChange={(e) => {
                    changeForm(e)
                    changeFileType(e)
                  }}
                  disabled={fileTypeSelected === "url"}
                />
              </div>
            </Form.Group>
          </Col>
        </Row>
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

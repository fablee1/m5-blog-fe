import React from "react"
import { Row, Col, Image } from "react-bootstrap"
import "./styles.css"

const BlogAuthor = (props) => {
  return (
    <Row>
      <Col xs={2}>
        <Image className="blog-author" src={props.avatar} roundedCircle />
      </Col>
      <Col>
        <div>by</div>
        <h6>
          {props.name} {props.surname}
        </h6>
      </Col>
    </Row>
  )
}

export default BlogAuthor

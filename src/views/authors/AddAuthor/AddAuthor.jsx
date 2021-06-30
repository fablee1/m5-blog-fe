import React, { useState, useEffect } from 'react'
import { Container, Form, Col, Button, Row } from 'react-bootstrap'
import './styles.css'

const AddAuthor = (props) => {

    const [data, setData] = useState({name: '', surname: '', email: '', dob: ''})

    const changeData = (e) => {
        setData({...data, [e.target.id]: e.target.value})
    }

    const fetchAuthor = async (id) => {
        const response = await fetch("http://localhost:3001/authors/" + id)
        if(response.ok) {
            const authorData = await response.json()
            setData(authorData)
        } else {
            console.log(response)
        }
    }

    useEffect(() => {
        if(props.match.params.id) {
            fetchAuthor(props.match.params.id)
        }
    }, [])

    const postAuthor = async () => {
        const response = await fetch("http://localhost:3001/authors", {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json"
            }
        })
        if(response.ok) {
            const data = await response.json()
        } else {
            console.log(response)
        }
    }

    const editAuthor = async () => {
        const response = await fetch("http://localhost:3001/authors/" + data._id, {
            method: "PUT",
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json"
            }
        })
        if(response.ok) {
            const data = await response.json()
        } else {
            console.log(response)
        }
    }

    const handleAuthor = async (e) => {
        e.preventDefault()
        if(!props.match.params.id) {
            await postAuthor()
        } else {
            await editAuthor()
        }
        props.history.push("/authors")
    }

    return (
        <Container className="add-author-cont">
            <Row>
                <h1>{props.match.params.id ? "Edit Author" : "Add Author"}</h1>
                <Col xs={12} md={{offset: 3, span: 6}}>
                    <Form className="add-author-form" onSubmit={(e) => handleAuthor(e)}>
                        <Form.Row as={Row}>
                            <Form.Group as={Col} controlId="name">
                                <Form.Label>Name</Form.Label>
                                <Form.Control placeholder="Name" required value={data.name} onChange={(e) => changeData(e)} />
                            </Form.Group>

                            <Form.Group as={Col} controlId="surname">
                                <Form.Label>Surname</Form.Label>
                                <Form.Control placeholder="Surname" required value={data.surname} onChange={(e) => changeData(e)} />
                            </Form.Group>
                        </Form.Row>

                        <Form.Group controlId="email">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" placeholder="Enter Email" required value={data.email} onChange={(e) => changeData(e)} />
                        </Form.Group>

                        <Form.Group controlId="dob">
                            <Form.Label>Date Of Birth</Form.Label>
                            <Form.Control type="date" required value={data.dob} onChange={(e) => changeData(e)} />
                        </Form.Group>

                        <Button variant="primary" type="submit" className="mt-3">
                            Submit
                        </Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    )
}

export default AddAuthor
import { Container } from "react-bootstrap"
import React, { useState } from "react"
import "./styles.css"
import { BACKEND_URL } from "../../env.js"

const CheckEmail = () => {
  const [email, setEmail] = useState("")
  const [emailExists, setEmailExists] = useState(null)

  const checkEmail = async () => {
    const response = await fetch(BACKEND_URL + "authors/checkEmail", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: email }),
    })
    if (response.ok) {
      const data = await response.json()
      setEmailExists(data.exists)
    } else {
      console.log("error with fetch")
    }
  }

  return (
    <Container className="d-flex justify-content-center">
      <div className="check-mail">
        <h1>Check if your email is registered</h1>
        <div
          className={`email-check-result ${
            emailExists !== null &&
            (emailExists ? "email-check-success" : "email-check-unsuccessful")
          }`}>
          <h2>
            {emailExists !== null &&
              (emailExists ? "Email exists!" : "Email doesn't exist!")}
          </h2>
        </div>
        <div className="d-flex">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button onClick={checkEmail}>Check</button>
        </div>
      </div>
    </Container>
  )
}

export default CheckEmail

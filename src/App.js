import React from "react"
import NavBar from "./components/navbar"
import Footer from "./components/footer"
import Home from "./views/home"
import Blog from "./views/blog"
import NewBlogPost from "./views/new"
import Authors from "./views/authors"
import { BrowserRouter, Route } from "react-router-dom"
import AddAuthor from "./views/authors/AddAuthor/AddAuthor"
import CheckEmail from "./views/checkEmail/checkEmail"

function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <Route path="/" exact component={Home} />
      <Route path="/blog/:id" exact component={Blog} />
      <Route path="/post/new" exact component={NewBlogPost} />
      <Route path="/authors" exact component={Authors} />
      <Route path="/authors/add" exact component={AddAuthor} />
      <Route path="/authors/edit/:id" exact component={AddAuthor} />
      <Route path="/email" exact component={CheckEmail} />
      <Route path="/post/edit/:id" exact component={NewBlogPost} />
      <Footer />
    </BrowserRouter>
  )
}

export default App

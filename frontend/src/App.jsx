import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import Router from './Router'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'

export default function App(){
  return (
    <BrowserRouter>
      <Navbar />
      <Router />
      <Footer />
    </BrowserRouter>
  )
}

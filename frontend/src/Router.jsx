import React from 'react'
import { Routes, Route } from 'react-router-dom'

import Home from './pages/shop/Home'
import Products from './pages/shop/Products'
import Product from './pages/shop/Product'
import Checkout from './pages/shop/checkout'
import Thankyou from './pages/shop/Thankyou'
import NotFound from './pages/NotFound'

export default function Router(){
  return (
    <Routes>
      <Route path="/" element={<Home/>} />
      <Route path="/products" element={<Products/>} />
      <Route path="/product" element={<Product/>} />
      <Route path="/checkout" element={<Checkout/>} />
      <Route path="/thankyou" element={<Thankyou/>} />
      <Route path="*" element={<NotFound/>} />
    </Routes>
  )
}

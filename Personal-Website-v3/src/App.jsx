import { useState } from 'react'
import './App.css'
import Navbar from './components/Navbar/Navbar'
import Home from './pages/Home/Home'
import Experience from './pages/Experience/Experience'
import Projects from './pages/Projects/Projects'
import Credentials from './pages/Credentials/Credentials'
import Contact from './pages/Contact/Contact'
import { Routes, Route } from 'react-router-dom'
function App() {

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-neutral-950">
      <main className="w-full h-full flex flex-col items-center justify-center bg-neutral-950">
        <Navbar/>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/experience" element={<Experience />} />
          <Route path="/credentials" element={<Credentials/>} />
          <Route path="/contact" element={<Contact />} />

        </Routes>
      </main>



    </div>
  )
}

export default App

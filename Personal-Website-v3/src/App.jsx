import { useState } from 'react'
import './App.css'
import Navbar from './components/custom/Navbar'
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
        <Navbar />
        <Routes>
          <Route path="/~ady/" element={<Home />} />
          <Route path="/~ady/home" element={<Home />} />
          <Route path="/~ady/projects" element={<Projects />} />
          <Route path="/~ady/experience" element={<Experience />} />
          <Route path="/~ady/credentials" element={<Credentials />} />
          <Route path="/~ady/contact" element={<Contact />} />

        </Routes>
      </main>



    </div>
  )
}

export default App

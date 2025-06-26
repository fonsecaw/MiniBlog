import './App.css'
import { useEffect, useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthContextProvider } from './context/AuthContext'
import { useAuthentication } from './hooks/useAuthentication'
import { onAuthStateChanged } from 'firebase/auth'

import Home from './pages/home/Home'
import About from './pages/about/About'
import NavBar from './components/navBar/NavBar'
import Footer from './components/footer/Footer'
import Login from './pages/login/Login'
import Cadastro from './pages/register/Cadastro'
import CreatePost from './pages/createPost/CreatePost'
import Dashboard from './pages/dashboard/Dashboard'
import Search from './pages/search/Search'
import Post from './pages/post/Post'
import EditPost from './pages/editPost/EditPost'

function App() {
  const [user, setUser] = useState(undefined);
  const { auth } = useAuthentication();

  const loadingUser = user === undefined;

  useEffect(() => {
    onAuthStateChanged(auth, user => {
      setUser(user)
    });
  }, [auth])

  if (loadingUser) return <p>Carregando...</p>

  return (
    <>
      <AuthContextProvider value={{ user }}>
        <BrowserRouter>
          <NavBar />
          <div className="container">
            <Routes>
              <Route path='/' element={<Home />} />
              <Route path='/sobre' element={<About />} />
              <Route path='/pesquisa' element={<Search />} />
              <Route path='/posts/:id' element={<Post />} />
              <Route
                path='/login'
                element={!user ? <Login /> : <Navigate to='/' />}
              />
              <Route
                path='/cadastro'
                element={!user ? <Cadastro /> : <Navigate to='/' />}
              />
              <Route
                path='/posts/create'
                element={user ? <CreatePost /> : <Navigate to='/login' />}
              />
              <Route
                path='/posts/edicao/:id'
                element={user ? <EditPost /> : <Navigate to='/login' />}
              />
              <Route
                path='/dashboard'
                element={user ? <Dashboard /> : <Navigate to='/login' />}
              />
            </Routes>
          </div>
          <Footer />
        </BrowserRouter>
      </AuthContextProvider>
    </>
  )
}

export default App

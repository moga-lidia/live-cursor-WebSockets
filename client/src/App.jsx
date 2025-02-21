import { useState } from 'react'
import { Login } from './components/Login.jsx';
import { Home } from './Home.jsx';

function App() {
  const [username, setUsername] = useState("")
  return username ? (
    <Home username={username} />
  ) : (
    <Login onSubmit={setUsername}/>
  )


  // return (
  //   <Login onSubmit={setUsername}/>
  // )
}

export default App

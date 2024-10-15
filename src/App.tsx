import Canvas from './canvas'
import Customize from './pages/customizer'
import Home from './pages/home'

function App() {
  return (
    <main className='app transition-all-ease-in'>
      <Home />
      <Canvas />
      <Customize />
    </main>
  )
}

export default App

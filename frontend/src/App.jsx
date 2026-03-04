import MianRoutes from './routes/MianRoutes'
import { AuthProvider } from './context/AuthContext'

const App = () => {
  
  return (
    <AuthProvider>
      <MianRoutes />
    </AuthProvider>
  )
}

export default App
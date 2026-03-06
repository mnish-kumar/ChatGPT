import MianRoutes from './routes/MianRoutes'
import { AuthProvider } from './auth/services/auth.context';

const App = () => {
  
  return (
    <AuthProvider>
      <MianRoutes />
    </AuthProvider>
  )
}

export default App
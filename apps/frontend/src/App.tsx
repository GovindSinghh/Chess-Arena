import {
  Route,
  BrowserRouter as Router,
  Routes
} from "react-router-dom";

import { GamePage } from "./pages/GamePage";
import { Landing } from './pages/Landing';
import { ProtectedRoute } from "./Components/ProtectedRoute";

function App() {

  return(
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/gameArena" element={
          <ProtectedRoute>
            <GamePage />
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  )
}

export default App;

import "./App.css";
import { Route, Routes} from "react-router-dom";
import PythonEditor from "./PythonEditor";
function App() {
  return (
    <div className="App">
        <Routes>
          <Route
            exact
            path="/"
            element={<PythonEditor  />}
          />
        </Routes>
    </div>
  );
}

export default App;

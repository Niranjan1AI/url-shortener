import { Route, Routes } from "react-router-dom";
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Form from "./components/Form";

function App() {
  return (
    <div className="App">
      <div className="auth-wrapper">
        <div className="auth-inner">
          {/* Two routes that will route to the form page that we created.*/}
          <Routes>
            {/* Directs any path with '/' to our component form.*/}
            <Route exact path='/' component={Form} />
            {/*Direct any parth with "/app" to our compeonet form.*/}
            <Route exact path="/app" component={Form} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;

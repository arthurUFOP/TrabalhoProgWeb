import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './App.css';
import Home from './components/Home';
import About from './components/About';
import Search from './components/Search';
import Author from './components/Author';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home></Home>}></Route>
        <Route path='/sobre' element={<About></About>}></Route>
        <Route path='/pesquisa' element={<Search></Search>}></Route>
        <Route path='/autor/:authorId' element={<Author></Author>}></Route>
      </Routes>
    </Router>
  );
}

export default App

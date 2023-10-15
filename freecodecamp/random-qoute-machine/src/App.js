import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <div className="quote-box" id="quote-box">
        <a href="#"><i class="fa fa-twitter"></i></a>
        <span id="text" class="qoute-text">the text</span>
        <span id="author" class="qoute-author">the author</span>
        <button id="new-quote" >New quote</button>
      
      </div>
    </div>
  );
}

export default App;

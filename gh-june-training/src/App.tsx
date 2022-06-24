import React, { CSSProperties, FunctionComponent } from 'react';
import logo from './logo.svg';
import './App.css';
import { PizzaContainer, PastaContainer } from './Content';

function App() {
  console.log('App');
  return (
    <div className="App">
      <header className="App-header">
        <AppLayout leftContent={<PizzaContainer />} rightContent={<PastaContainer />} />
        {/* <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a> */}
      </header>
    </div>
  );
}

const WHRAPPER_STYLES: CSSProperties = { width: '100%' };
const LEFT_STYLES: CSSProperties = { float: 'left', width: '50%' };
const RIGHT_STYLES: CSSProperties = {};

interface AppLayoutProps {
  leftContent: React.ReactNode;
  rightContent: React.ReactNode;
}

const AppLayout: FunctionComponent<AppLayoutProps> = ({ leftContent, rightContent }) => {
  return (
    <div style={WHRAPPER_STYLES}>
      <div style={LEFT_STYLES}>{leftContent}</div>
      <div style={RIGHT_STYLES}>{rightContent}</div>
    </div>
  );
};

export default App;

import React, { useState, useEffect } from 'react';
import './App.css';

const WS_URL = process.env.REACT_APP_WS_URL;
//

function App() {
  const [scores, setScores] = useState([]); // [[pair, score], ...]

  useEffect(() => {
    const ws = new WebSocket(WS_URL);
    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.type === 'scores') {
        // Sort by absolute score descending
        const sorted = msg.data.sort((a, b) => Math.abs(b[1]) - Math.abs(a[1]));
        setScores(sorted);
      }
    };
    ws.onclose = () => console.log('Server WebSocket closed');
    return () => ws.close();
  }, []);

  const getDirection = (score) => {
    if (score > 0.3) return '🟢 LONG';
    if (score < -0.3) return '🔴 SHORT';
    return '⚪ NEUTRAL';
  };

  return (
    <div className="App">
      <h1>🐋 Whale Monitor (Gate.io Top 10)</h1>
      <table>
        <thead>
          <tr>
            <th>Rank</th>
            <th>Pair</th>
            <th>Score</th>
            <th>Signal</th>
          </tr>
        </thead>
        <tbody>
          {scores.map(([pair, score], index) => (
            <tr key={pair}>
              <td>{index + 1}</td>
              <td>{pair}</td>
              <td className={score > 0 ? 'positive' : score < 0 ? 'negative' : ''}>
                {score.toFixed(2)}
              </td>
              <td>{getDirection(score)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;

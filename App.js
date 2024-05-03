import './App.css';
import React, { useState, useEffect } from "react";
import { Scatter } from 'react-chartjs-2';
import { Chart, Legend, plugins, registerables } from 'chart.js';
import Coupled from './Coupled';
import Coffee from './Coffee';
Chart.register(...registerables);


const q1Text = "To model this lab I will be using react, css, and most importantly chart.js to show the position of a mass on a spring with respect to time. The sliders below give the constants that effect this model along with their given units and may be adjusted otherwise they will automatically adjust to each question.";
const q2Text = "Plot is given above, and to see more or less oscillations adjust the number of points slider.";
const q3Text = "Results are as expected";
const q4Text = "Plot is given above";
const q5Text = "The critical drag coefficient is 0.37.";
const q6Text = "Increasing mass increases the wave length and decreasing the mass decreases the wave length. Increasing k decreases wave length, and decreasing k increases wave length. Increasing the drag coefficient decreases the amplitude over time. Position and Velocity when greater then 0 and increased increase amplitude and when less then 0 and decreasing they increase amplitude.";

// Initial values
const initialDeltaT = 0.01;
const initialM1 = 1;
const initialK1 = 0.04;
const initialPositionInitial = 1;
const initialVelocityInitial = 0;
const initialNumOfPoints = 6000;

let tcurrent = 0;

const position = (Pb, Vb, Tb, Tc) => {
  return Pb + Vb * (Tc - Tb);
};

const velocity = (a, Tb, Tc, Vb) => {
  return Vb + a * (Tc - Tb);
};

const force = (k, p, v, b) => {
  return -1 * k * p - b * v;
};

const acceleration = (f, m) => {
  return f / m;
};

const getTime = (num, deltaT) => {
  return tcurrent + (deltaT * num).toFixed(2);
};

const generateData = (deltaT, m1, k1, positionInitial, velocityInitial, bValue, numOfPoints) => {
  const points = [];

  for (let i = 0; i < numOfPoints; i++) {
    if (i === 0) {
      points.push({
        Time: getTime(i, deltaT),
        Position: positionInitial,
        Velocity: velocityInitial,
        Force: force(k1, positionInitial, velocityInitial, bValue),
        Acceleration: acceleration(force(k1, positionInitial, velocityInitial, bValue), m1)
      });
    } else {
      const lastPoint = points[i - 1];
      const newPosition = position(lastPoint.Position, lastPoint.Velocity, lastPoint.Time, getTime(i, deltaT));
      const newForce = force(k1, newPosition, lastPoint.Velocity, bValue);
      const newAcceleration = acceleration(newForce, m1);
      const newVelocity = velocity(newAcceleration, lastPoint.Time, getTime(i, deltaT), lastPoint.Velocity);

      points.push({
        Time: getTime(i, deltaT),
        Position: newPosition,
        Velocity: newVelocity,
        Force: newForce,
        Acceleration: newAcceleration
      });
    }
  }

  const dataSets = [{
    label: 'M ',
    data: points.map(point => ({ x: point.Time, y: point.Position })),
    backgroundColor: 'rgba(255, 99, 132, 1)',
  }];

  return dataSets;
};













function App() {
  const [bValue, setBValue] = useState(0);
  const [deltaTValue, setDeltaTValue] = useState(initialDeltaT);
  const [m1Value, setM1Value] = useState(initialM1);
  const [k1Value, setK1Value] = useState(initialK1);
  const [positionInitialValue, setPositionInitialValue] = useState(initialPositionInitial);
  const [velocityInitialValue, setVelocityInitialValue] = useState(initialVelocityInitial);
  const [numOfPoints, setNumOfPoints] = useState(initialNumOfPoints); 








  const [textV, setQ] = useState(q1Text);
  const [qnum,setQN] = useState(1);
    
  const [data, setData] = useState(generateData(deltaTValue, m1Value, k1Value, positionInitialValue, velocityInitialValue, bValue, numOfPoints));



useEffect(() => {
  setData(generateData(deltaTValue, m1Value, k1Value, positionInitialValue, velocityInitialValue, bValue, numOfPoints));
}, [bValue, deltaTValue, m1Value, k1Value, positionInitialValue, velocityInitialValue, numOfPoints]);



  const handleSliderChange = (event, setValue) => {
    setValue(parseFloat(event.target.value));
  };
  const q1 = () => {
    setBValue(0);
    setDeltaTValue(0.01);
    setM1Value(1);
    setK1Value(0.04);
    setPositionInitialValue(1);
    setVelocityInitialValue(0);
    setNumOfPoints(6000);
    setQ(q1Text);
    setQN(1);
  };
  const q2 = () => {
    setBValue(0);
    setDeltaTValue(0.01);
    setM1Value(1);
    setK1Value(0.04);
    setPositionInitialValue(1);
    setVelocityInitialValue(0);
    setNumOfPoints(6000);
    setQ(q2Text);
    setQN(2);
  };
  const q3 = () => {
    setBValue(0.1);
    setDeltaTValue(0.01);
    setM1Value(1);
    setK1Value(0.04);
    setPositionInitialValue(1);
    setVelocityInitialValue(0);
    setNumOfPoints(6000);
    setQ(q3Text);
    setQN(3);
  };
  const q4 = () => {
    setBValue(0.1);
    setDeltaTValue(0.01);
    setM1Value(1);
    setK1Value(0.04);
    setPositionInitialValue(1);
    setVelocityInitialValue(0);
    setNumOfPoints(6000);
    setQ(q4Text);
    setQN(4);
  };

  const q5 = () => {
    setBValue(0.37);
    setDeltaTValue(0.01);
    setM1Value(1);
    setK1Value(0.04);
    setPositionInitialValue(1);
    setVelocityInitialValue(0);
    setNumOfPoints(6000);
    setQ(q5Text);
    setQN(5);
  };
  const q6 = () => {
    setBValue(0.37);
    setDeltaTValue(0.01);
    setM1Value(1);
    setK1Value(0.04);
    setPositionInitialValue(1);
    setVelocityInitialValue(0);
    setNumOfPoints(6000);
    setQ(q6Text);
    setQN(6);
  };
  const handleBValueChange = (event) => {
    setBValue(parseFloat(event.target.value));
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Lab 13 Numerical Calculations</h1>
        <p6>by Shane Maggard</p6>
      </header>
      <section>
        <h1 id = "title">Damped Harmonic Motion</h1>

        <div id="scatter">


          <h1 id="chartTitle">Position Vs. Time</h1>
        <Scatter options={options} data={{ datasets: data }} />

        <div>
        <button
        onClick={() => q1()}>
          Question 1
        </button>

        <button
        onClick={() => q2()}
        >Question 2</button>

        <button
        onClick={() => q3()}
        >Question 3</button>

        <button
        onClick={() => q4()}>
          Question 4
        </button>

         <button
        onClick={() => q5()}
        >Question 5</button>

        <button
        onClick={() => q6()}>
          Question 6
        </button>
        </div>
        <div>
          <h4>Question {qnum}:</h4>
          <p2>{textV}</p2>
        </div>
        </div>

        <div id="vars">
        <div id="slider">
          <label>∆t:</label>
          <input
            type="range"
            min="0.01"
            max="0.1"
            step="0.01"
            value={deltaTValue}
            onChange={(event) => handleSliderChange(event, setDeltaTValue)}
          />
          <p>{deltaTValue}{' s'}</p>
        </div>
        <div id="slider">
          <label>{'M₁ (mass):'}</label>
          <input
            type="range"
            min="0.1"
            max="2"
            step="0.1"
            value={m1Value}
            onChange={(event) => handleSliderChange(event, setM1Value)}
          />
          <p>{m1Value}{' kg'}</p>
        </div>
        <div id="slider">
          <label>K₁{'(Spring Constant)'}:</label>
          <input
            type="range"
            min="0.01"
            max="0.1"
            step="0.01"
            value={k1Value}
            onChange={(event) => handleSliderChange(event, setK1Value)}
          />
          <p>{k1Value}{' N/m'}</p>
        </div>
        <div id="slider">
          <label>{'X₀ (Position Initial):'}</label>
          <input
            type="range"
            min="-10"
            max="10"
            step="0.1"
            value={positionInitialValue}
            onChange={(event) => handleSliderChange(event, setPositionInitialValue)}
          />
          <p>{positionInitialValue}{' m'}</p>
        </div>
        <div id="slider">
          <label>{'V₀ (Velocity Initial):'}</label>
          <input
            type="range"
            min="-10"
            max="10"
            step="0.1"
            value={velocityInitialValue}
            onChange={(event) => handleSliderChange(event, setVelocityInitialValue)}
          />
          <p>{velocityInitialValue}{'m/s'}</p>
        </div>
        <div id="slider">
          <label>{'b (Drage Coefficent):'}</label>
          <input
            type="range"
            min="0"
            max="2"
            step="0.01"
            value={bValue}
            onChange={handleBValueChange}
          />
          <p>{bValue}</p>
        </div>
        <div id="slider">
          <label>Number of Points:</label>
          <input
            type="range"
            min="1"
            max="10000"
            step="1"
            value={numOfPoints}
            onChange={(event) => handleSliderChange(event, setNumOfPoints)}
          />
          <p>{numOfPoints}</p>
        </div>
        </div>
      </section>

      <Coupled></Coupled>
      <Coffee></Coffee>

    </div>
  );
}



const options = {

  plugins: {
    legend: {   position: 'top' ,
    }
  },
  scales: {
    x: {
      type: 'linear',
      title: {
        display: true,
        text: 'Time (s)',
        font: {
          size: 24,
          weight: 'bold',
        },
      },
      beginAtZero: true,
    },
    y: {
      type: 'linear',
      title: {
        display: true,
        color: "#A9A9A9",
        text: 'Position (m)  ',
        font: {
          size: 24,
          weight: 'bold',
        },
      },
      beginAtZero: true,
    },
  },
  };
  
  export default App;
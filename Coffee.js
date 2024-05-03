import './App.css';
import React, { useState, useEffect } from "react";
import { Scatter } from 'react-chartjs-2';
import { Chart } from 'chart.js';

const q11text ="Same As question one lots and lots of react, chart.js, and css, execpt instead of mass on spring we are modeling the coffee filters lab.";
const q12text ="Graph is Above";

// Initial values
const initialDeltaT = 0.001; // seconds
const initialM1 = 0.001714; // kilograms (initial mass)    divide by 2 to get diameter
const crossSectionalArea = 0.037; // square meters pi * (0.2176/2)^2
const densityOfAir = 1.293; // kg/m^3
const dragCoefficient = 0.808;
const initialPositionInitial = 2; // meters
const initialVelocityInitial = 0; // m/s
const initialNumOfPoints = 6000;
const G = 9.81; // m/s^2

let tcurrent = 0;

const position = (Pb, Vb, Tb, Tc) => {
  return Pb + Vb * (Tc - Tb);
};

const velocity = (a, Tb, Tc, Vb) => {
  return Vb + a * (Tc - Tb);
};

const force = (c, p, csa, v, m) => {
  return 0.5 * c * p * csa * (v * v) - m * G;
};

const acceleration = (f, m) => {
  return f / m;
};

const getTime = (num, deltaT) => {
  return tcurrent + (deltaT * num).toFixed(2);
};

const generateData = (deltaT, m1, csArea, dofAir, dco, positionInitial, velocityInitial, numOfPoints, numFilters) => {
  const dataSets = [];
  for (let filterIndex = 0; filterIndex < numFilters; filterIndex++) {
    const points = [];
    const filterM1 = m1 * (filterIndex + 1); 
    for (let i = 0; i < numOfPoints; i++) {
      if (i === 0) {
        points.push({
          Time: getTime(i, deltaT),
          Position: positionInitial,
          Velocity: velocityInitial,
          Force: force(dco, dofAir, csArea, velocityInitial, filterM1),
          Acceleration: acceleration(force(dco, dofAir, csArea, velocityInitial, filterM1), filterM1)
        });
      } else {
        const lastPoint = points[i - 1];
        const newPosition = position(lastPoint.Position, lastPoint.Velocity, lastPoint.Time, getTime(i, deltaT));
        const newForce = force(dco, dofAir, csArea, lastPoint.Velocity, filterM1);
        const newAcceleration = acceleration(newForce, filterM1);
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
    let color = "rgba(252, 186, 3,1)"
    if(filterIndex == 0){
        color = "rgba(250, 15, 2,1)"
    } else if(filterIndex == 1){
        color = "rgba(17, 245, 5,1)"
    }else if(filterIndex == 2){
        color = "rgba(2, 218, 242,1)"
    }else if(filterIndex == 3){
        color = "rgba(100, 5, 242,1)"
    }else if(filterIndex == 4) {
        color = "rgba(242, 131, 5,1)"
    }else {
        color = `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 1)`;
    }
    dataSets.push({
      label: `${filterIndex + 1} Filter`, 
      data: points.map(point => ({ x: point.Time, y: point.Velocity })),
      backgroundColor: color
    });
  }
  return dataSets;
};

function Coffee() {
  const [deltaTValue, setDeltaTValue] = useState(initialDeltaT);
  const [m1Value, setM1Value] = useState(initialM1);
  const [csArea, setCrossSectionalArea] = useState(crossSectionalArea);
  const [dofAir, setDofAir] = useState(densityOfAir);
  const [dC, setDC] = useState(dragCoefficient);
  const [positionInitialValue, setPositionInitialValue] = useState(initialPositionInitial);
  const [velocityInitialValue, setVelocityInitialValue] = useState(initialVelocityInitial);
  const [numOfPoints, setNumOfPoints] = useState(initialNumOfPoints);
  const [numFilters, setNumFilters] = useState(5); 

  const [data, setData] = useState(generateData(deltaTValue, m1Value, csArea, dofAir, dC, positionInitialValue, velocityInitialValue, numOfPoints, numFilters));

  useEffect(() => {
    setData(generateData(deltaTValue, m1Value, csArea, dofAir, dC, positionInitialValue, velocityInitialValue, numOfPoints, numFilters));
  }, [deltaTValue, m1Value, csArea, dofAir, dC, positionInitialValue, velocityInitialValue, numOfPoints, numFilters]);

  const handleSliderChange = (event, setValue) => {
    setValue(parseFloat(event.target.value));

  };


  const [textV, setQ] = useState(q11text);
  const [qnum,setQN] = useState(11);

  const setNormal=() =>{
    setDeltaTValue(initialDeltaT);
    setM1Value(initialM1);
    setCrossSectionalArea(crossSectionalArea);
    setDofAir(densityOfAir);
    setDC(dragCoefficient);
    setPositionInitialValue(initialPositionInitial);
    setVelocityInitialValue(initialVelocityInitial);
    setNumOfPoints(initialNumOfPoints);
    setNumFilters(5);
  }



  const q11 = () => {
    setQN(11);
    setQ(q11text);
    setNormal();
  };
  const q12 = () => {
    setQN(12);
    setQ(q12text);
    setNormal();
  };







  return (
    <div className="App">
      <section>
        <h1 id="title">Falling Coffee Filters ☕</h1>
        <div id="scatter">
          <h1 id="chartTitle">Velocity Vs. Time</h1>
          <Scatter options={options} data={{ datasets: data }} />

          <div>

        <button
        onClick={() => q11()}
        >Question 11</button>

        <button
        onClick={() => q12()}>
          Question 12
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
              min="0.001"
              max="0.1"
              step="0.001"
              value={deltaTValue}
              onChange={(event) => handleSliderChange(event, setDeltaTValue)}
            />
            <p>{deltaTValue} s</p>
          </div>
          <div id="slider">
            <label>M₁ (mass):</label>
            <input
              type="range"
              min="0.001"
              max="0.1"
              step="0.001"
              value={m1Value}
              onChange={(event) => handleSliderChange(event, setM1Value)}
            />
            <p>{m1Value} kg</p>
          </div>
          <div id="slider">
            <label>Cross-sectional Area:</label>
            <input
              type="range"
              min="0.01"
              max="1"
              step="0.01"
              value={csArea}
              onChange={(event) => handleSliderChange(event, setCrossSectionalArea)}
            />
            <p>{csArea} m²</p>
          </div>
          <div id="slider">
            <label>Density of Air:</label>
            <input
              type="range"
              min="0.1"
              max="10"
              step="0.1"
              value={dofAir}
              onChange={(event) => handleSliderChange(event, setDofAir)}
            />
            <p>{dofAir} kg/m³</p>
          </div>
          <div id="slider">
            <label>Drag Coefficient:</label>
            <input
              type="range"
              min="0.1"
              max="1"
              step="0.01"
              value={dC}
              onChange={(event) => handleSliderChange(event, setDC)}
            />
            <p>{dC}</p>
          </div>
          <div id="slider">
            <label>Initial Position:</label>
            <input
              type="range"
              min="0"
              max="10"
              step="0.1"
              value={positionInitialValue}
              onChange={(event) => handleSliderChange(event, setPositionInitialValue)}
            />
            <p>{positionInitialValue} m</p>
          </div>
          <div id="slider">
            <label>Initial Velocity:</label>
            <input
              type="range"
              min="-10"
              max="10"
              step="0.1"
              value={velocityInitialValue}
              onChange={(event) => handleSliderChange(event, setVelocityInitialValue)}
            />
            <p>{velocityInitialValue} m/s</p>
          </div>
        </div>
        <div id="vars">
        <div></div>
        <div></div>
        <div id="slider">
            <label>Number of Points:</label>
            <input
              type="range"
              min="100"
              max="10000"
              step="100"
              value={numOfPoints}
              onChange={(event) => handleSliderChange(event, setNumOfPoints)}
            />
            <p>{numOfPoints}</p>
          </div>
          <div id="slider">
            <label>Number of Filters:</label>
            <input
              type="range"
              min="1"
              max="10"
              step="1"
              value={numFilters}
              onChange={(event) => handleSliderChange(event, setNumFilters)}
            />
            <p>{numFilters}</p>
          </div>
          <div></div>
          <div></div>
        </div>
      </section>
    </div>
  );
}

const options = {
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
        text: 'Velocity (m/s)',
        font: {
          size: 24,
          weight: 'bold',
        },
      },
      beginAtZero: true,
    },
  },
};

export default Coffee;
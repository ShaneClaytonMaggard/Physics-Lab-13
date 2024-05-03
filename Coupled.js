import React, { useState, useEffect } from "react";
import { Scatter } from 'react-chartjs-2';

const Coupled = () => {
  const q7text ="Same As question one just with a new mass m2 attatched to m1 using spring with a spring constant k2";
  const q8text ="f1 = (-k1 * x1) + (k2 * (x2-x1))   ____and____   f2 = -k2 * (x2-x1)";
  const q9text ="Plot above";
  const q10text ="I changed the spring constants and initial positions in order to increase energy otherwise it be really small and appear to be a constant 0j. In doing so the graph now shows energy at constant 1j.";
  



  const initialDeltaT2 = 0.02;
  const initialM21 = 1;
  const initialK21 = 0.01;
  const initialM22 = 1;
  const initialK22 = 0.01;
  const initialPositionInitial21 = 0;
  const initialVelocityInitial21 = 0;
  const initialPositionInitial22 = 0.1;
  const initialVelocityInitial22 = 0;
  const initialNumOfPoints2 = 6000;

  let tcurrent2 = 0;

  const position21 = (Pb21, Vb21, Tb, Tc) => {
    return Pb21 + Vb21 * (Tc - Tb);
  };

  const velocity21 = (a21, Tb, Tc, Vb21) => {
    return Vb21 + a21 * (Tc - Tb);
  };

  const force21 = (k21, x21, k22, x22) => {
    return ((-1 * k21 * x21) + (k22 * (x22 - x21)));
  };

  const acceleration21 = (f21, m21) => {
    return f21 / m21;
  };

  const position22 = (Pb22, Vb22, Tb, Tc) => {
    return Pb22 + Vb22 * (Tc - Tb);
  };

  const velocity22 = (a22, Tb, Tc, Vb22) => {
    return Vb22 + a22 * (Tc - Tb);
  };

  const force22 = (k22, x22, x21) => {
    return -1 * k22 * (x22 - x21);
  };

  const acceleration22 = (f22, m22) => {
    return f22 / m22;
  };

  const getTime2 = (num, deltaT) => {
    return tcurrent2 + (deltaT * num).toFixed(2);
  };
  const getEnergy = (m1, m2, k1, k2, x1, x2, v1, v2) => {
    // Potential energy of mass 1
    const PE1 = 0.5 * k1 * x1 * x1;
    // Potential energy of mass 2
    const PE2 = 0.5 * k2 * (x2 - x1) * (x2 - x1);
    // Kinetic energy of mass 1
    const KE1 = 0.5 * m1 * v1 * v1;
    // Kinetic energy of mass 2
    const KE2 = 0.5 * m2 * v2 * v2;
    // Total energy of the system
    return PE1 + PE2 + KE1 + KE2;
};

  const generateData2 = (deltaT2, m21, m22, k21, k22, positionInitial21, positionInitial22, velocityInitial21, velocityInitial22, numOfPoints2) => {
    const points2 = [];

    for (let i = 0; i < numOfPoints2; i++) {
      if (i === 0) {
        points2.push({
          Time: getTime2(i, deltaT2),
          Position21: positionInitial21,//positionInitial21,
          Position22: positionInitial22,
          Velocity21: velocityInitial21,
          Velocity22: velocityInitial22,
          Force21: force21(k21, positionInitial21, k22, positionInitial21),
          Force22: force22(k22, positionInitial22, positionInitial21),
          Acceleration21: acceleration21(force21(k21, positionInitial21, k22, positionInitial21), m21),
          Acceleration22: acceleration22(force22(k22, positionInitial22, positionInitial21), m22)
        });
      } else {
        getTime2(i, deltaT2);
        const lastPoint2 = points2[i - 1];
        const newPosition21 = position21(lastPoint2.Position21, lastPoint2.Velocity21, lastPoint2.Time, getTime2(i, deltaT2));
        const newPosition22 = position22(lastPoint2.Position22, lastPoint2.Velocity22, lastPoint2.Time, getTime2(i, deltaT2));
        const newForce21 = force21(k21, lastPoint2.Position21, k22, lastPoint2.Position22);
        const newForce22 = force22(k22, lastPoint2.Position22, lastPoint2.Position21);
        const newAcceleration21 = acceleration21(force21(k21, lastPoint2.Position21, k22, lastPoint2.Position22), m21);
        const newAcceleration22 = acceleration22(force22(k22, lastPoint2.Position22, lastPoint2.Position21), m22);
        const newVelocity21 = velocity21(acceleration21(force21(k21, lastPoint2.Position21, k22, lastPoint2.Position22), m21), lastPoint2.Time, getTime2(i, deltaT2), lastPoint2.Velocity21);
        const newVelocity22 = velocity22(acceleration22(force22(k22, lastPoint2.Position22, lastPoint2.Position21), m22), lastPoint2.Time, getTime2(i, deltaT2), lastPoint2.Velocity22);

        points2.push({
          Time: getTime2(i, deltaT2),
          Position21: newPosition21,
          Position22: newPosition22,
          Velocity21: newVelocity21,
          Velocity22: newVelocity22,
          Force21: newForce21,
          Force22: newForce22,
          Acceleration21: newAcceleration21,
          Acceleration22: newAcceleration22,
        });
      }
    }

    const dataSets2 = [{
      label: 'm1',
      data: points2.map(point => ({ x: point.Time, y: point.Position21 })),
      backgroundColor: 'rgba(255, 99, 132, 1)',
    },
    {
        label: 'm2',
        data: points2.map(point => ({ x: point.Time, y: point.Position22 })),
        backgroundColor: 'rgba(0, 99, 132, 1)',
      },
      {
        label: 'Energy vs Time (Note in Joules not meters)',                                         
        data: points2.map(point => ({ x: point.Time, y: getEnergy(
          m21,
          m22,
          k21,
          k22,
          point.Position21,  // x1
          point.Position22,  // x2
          point.Velocity21,  // v1
          point.Velocity22   // v2
      )})),
        backgroundColor: 'rgba(0,0,0,1)',
      }
];

    return dataSets2;
  };

  const [m21Value, setM21Value] = useState(initialM21);
  const [k21Value, setK21Value] = useState(initialK21);
  const [m22Value, setM22Value] = useState(initialM22);
  const [k22Value, setK22Value] = useState(initialK22);
  const [positionInitialValue21, setPositionInitialValue21] = useState(initialPositionInitial21);
  const [velocityInitialValue21, setVelocityInitialValue21] = useState(initialVelocityInitial21);
  const [positionInitialValue22, setPositionInitialValue22] = useState(initialPositionInitial22);
  const [velocityInitialValue22, setVelocityInitialValue22] = useState(initialVelocityInitial22);
  const [numOfPoints2, setNumOfPoints2] = useState(initialNumOfPoints2);
  const [deltaTValue2, setDeltaTValue2] = useState(initialDeltaT2);

  
  
  const [textV, setQ] = useState(q7text);
  const [qnum,setQN] = useState(7);



  
  const [data2, setData2] = useState(generateData2(deltaTValue2, m21Value, m22Value, k21Value, k22Value, positionInitialValue21, positionInitialValue22, velocityInitialValue21, velocityInitialValue22, numOfPoints2));




  useEffect(() => {
    setData2(generateData2(deltaTValue2, m21Value, m22Value, k21Value, k22Value, positionInitialValue21, positionInitialValue22, velocityInitialValue21, velocityInitialValue22, numOfPoints2));
  }, [deltaTValue2, m21Value, m22Value, k21Value, k22Value, positionInitialValue21, positionInitialValue22, velocityInitialValue21, velocityInitialValue22, numOfPoints2]);
  


 const setNormal = () =>{
  setM21Value(initialM21);
  setK21Value(initialK21);
  setM22Value(initialM22);
  setK22Value(initialK22);
  setPositionInitialValue21(initialPositionInitial21);
  setVelocityInitialValue21(initialVelocityInitial21);
  setPositionInitialValue22(initialPositionInitial22);
  setVelocityInitialValue22(initialVelocityInitial22);
  setNumOfPoints2(initialNumOfPoints2);
  setDeltaTValue2(initialDeltaT2);
 }

  const q7 = () => {
    setQN(7);
    setQ(q7text);
    setNormal();
  };
  const q8 = () => {
    setQN(8);
    setQ(q8text);
    setNormal();
  };
  const q9 = () => {
    setQN(9);
    setQ(q9text);
    setNormal();
  };
  const q10 = () => {
    setQN(10);
    setQ(q10text);
    setNormal();
    setPositionInitialValue21(10);
    setPositionInitialValue22(10);
    setK21Value(0.02);
    setK22Value(0.02)
  };

 



  const handleSliderChange = (event, setValue) => {
    setValue(parseFloat(event.target.value));
  };
  return (
    <section>
      <h1 id="title">Coupled Harmonic Motion</h1>
      <div id="scatter">
        <h1 id="chartTitle">Position Vs. Time</h1>
        <Scatter options={options} data={{ datasets: data2 }} />
        <div>
        <button
        onClick={() => q7()}>
          Question 7
        </button>

        <button
        onClick={() => q8()}
        >Question 8</button>

        <button
        onClick={() => q9()}
        >Question 9</button>

        <button
        onClick={() => q10()}>
          Question 10
        </button>

        </div>
        <div>
          <h4>Question {qnum}:</h4>
          <p2>{textV}</p2>
        </div>
      </div>
      <div id="vars">
        <div id="slider">
          <label>m1:</label>
          <input
            type="range"
            min="0.25"
            max="5"
            step="0.25"
            value={m21Value}
            onChange={(event) => handleSliderChange(event, setM21Value)}
          />
          <p>{m21Value}{'kg'}</p>
        </div>

        <div id="slider">
          <label>m2:</label>
          <input
            type="range"
            min="0.25"
            max="5"
            step="0.25"
            value={m22Value}
            onChange={(event) => handleSliderChange(event, setM22Value)}
          />
          <p>{m22Value}{'kg'}</p>
        </div>

        <div id="slider">
          <label>K₁:</label>
          <input
            type="range"
            min="0.01"
            max="0.1"
            step="0.01"
            value={k21Value}
            onChange={(event) => handleSliderChange(event, setK21Value)}
          />
          <p>{k21Value}{' N/m'}</p>
        </div>

        <div id="slider">
          <label>K₂:</label>
          <input
            type="range"
            min="0.01"
            max="0.1"
            step="0.01"
            value={k22Value}
            onChange={(event) => handleSliderChange(event, setK22Value)}
          />
          <p>{k22Value}{' N/m'}</p>
        </div>

        <div id="slider">
          <label>∆t:</label>
          <input
            type="range"
            min="0.01"
            max="0.1"
            step="0.01"
            value={deltaTValue2}
            onChange={(event) => handleSliderChange(event, setDeltaTValue2)}
          />
          <p>{deltaTValue2}{' s'}</p>
        </div>
        
        <div id="slider">
          <label>{'X₀₁:'}</label>
          <input
            type="range"
            min="-10"
            max="10"
            step="0.1"
            value={positionInitialValue21}
            onChange={(event) => handleSliderChange(event, setPositionInitialValue21)}
          />
          <p>{positionInitialValue21}{' m'}</p>
        </div>
        <div id="slider">
          <label>{'X₀₂:'}</label>
          <input
            type="range"
            min="-10"
            max="10"
            step="0.1"
            value={positionInitialValue22}
            onChange={(event) => handleSliderChange(event, setPositionInitialValue22)}
          />
          <p>{positionInitialValue22}{' m'}</p>
        </div>


    </div>
    <div id="vars">
      <div> </div>
      <div> </div>
      <div id="slider">
            <label>{'V₀₁:'}</label>
            <input
              type="range"
              min="-10"
              max="10"
              step="0.1"
              value={velocityInitialValue21}
              onChange={(event) => handleSliderChange(event, setVelocityInitialValue21)}
            />
            <p>{velocityInitialValue21}{'m/s'}</p>
      </div>
      <div id="slider">
            <label>{'V₀₂:'}</label>
            <input
              type="range"
              min="-10"
              max="10"
              step="0.1"
              value={velocityInitialValue22}
              onChange={(event) => handleSliderChange(event, setVelocityInitialValue22)}
            />
            <p>{velocityInitialValue22}{'m/s'}</p>
      </div>
    
      <div id="slider">
            <label>Number of Points:</label>
            <input
              type="range"
              min="1"
              max="10000"
              step="1"
              value={numOfPoints2}
              onChange={(event) => handleSliderChange(event, setNumOfPoints2)}n
            />
            <p>{numOfPoints2}</p>
      </div>
      <div> </div>
      <div> </div>
    </div>
    </section>
  );
};

const options = {
  plugins: {
    legend: { position: 'top' }
  },
  scales: {
    x: {
      type: 'linear',
      title: {
        display: true,
        text: 'Time (s)',
        font: { size: 24, weight: 'bold' },
      },
      beginAtZero: true,
    },
    y: {
      type: 'linear',
      title: {
        display: true,
        color: "#A9A9A9",
        text: 'Position (m)  ',
        font: { size: 24, weight: 'bold' },
      },
      beginAtZero: true,
    },
  },
};

export default Coupled;
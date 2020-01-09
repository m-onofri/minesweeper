import React, {useState, useEffect} from 'react';
import Timer from './Timer.js';
import './App.css';

function App() {
  const [grid, setGrid] = useState([]);
  const [playingGame, setplayingGame] = useState(false);
  const [isGameOver, setisGameOver] = useState(false);
  const [isTimerOn, setIsTimerOn] = useState('end');

  useEffect(() => {
    const myGrid = createGrid(10);
    const myRandomNumbers = randomNumbersArray(20);
    const newGrid = setMines(myGrid, myRandomNumbers);
    setGrid(calculateMines(newGrid));
    setisGameOver(false);
  },[playingGame]);

  function checkEndGame() {
    let result = true;
    grid.flat().forEach(t => {
      if (t.content !== "M" && !t.display) {
        result = false;
      }
    });
    return result;
  }

  function createGrid(length) {
    let index = length;
    const grid = [];
    while (index > 0) {
        grid.push(Array(length).fill(null).map(() => ({content: 0, display: false, hint: false})));
        index -= 1;
    }
    return grid;
  }

  function randomNumbersArray(length) {
    let randomArray = [];
    while (randomArray.length < length) {
        let num = Math.floor(Math.random() * 100);
        while (!randomArray.includes(num)) {
            randomArray.push(num);
        }
    }
    return randomArray;
  }

  function setMines(grid, places) {
    for (let index = 0; index < places.length; index++) {
        const row = Math.floor(places[index] / 10);
        const column = places[index] % 10;
        grid[row][column].content = "M";
    }
    return grid;
  }

  function calculateMines(minedGrid) {
    for (let r = 0; r < minedGrid.length; r++) {
      for (let c = 0; c < minedGrid[r].length; c++) {
        if (minedGrid[r][c].content !== "M") {
          if ((r - 1) >= 0 && (c - 1) >= 0) {
            if (minedGrid[r-1][c-1].content === "M") {
              minedGrid[r][c].content += 1;
            }
          }
          if ((r - 1) >= 0) {
            if (minedGrid[r-1][c].content === "M") {
              minedGrid[r][c].content += 1;
            }
          }
          if ((r - 1) >= 0 && (c + 1) < minedGrid[r].length) {
            if (minedGrid[r-1][c+1].content === "M") {
              minedGrid[r][c].content += 1;
            }
          }
          if ((c + 1) < minedGrid[r].length) {
            if (minedGrid[r][c+1].content === "M") {
              minedGrid[r][c].content += 1;
            }
          }
          if ((r + 1) < minedGrid.length && (c + 1) < minedGrid[r].length) {
            if (minedGrid[r+1][c+1].content === "M") {
              minedGrid[r][c].content += 1;
            }
          }
          if ((r + 1) < minedGrid.length) {
            if (minedGrid[r+1][c].content === "M") {
              minedGrid[r][c].content += 1;
            }
          }
          if ((r + 1) < minedGrid.length && (c - 1) >= 0) {
            if (minedGrid[r+1][c-1].content === "M") {
              minedGrid[r][c].content += 1;
            }
          }
          if ((c - 1) >= 0) {
            if (minedGrid[r][c-1].content === "M") {
              minedGrid[r][c].content += 1;
            }
          }
        }
      }
    }
    return minedGrid;
  }

  function spreadZeroTiles(currentGrid, r, c) {
    if ((r - 1) >= 0 && (c - 1) >= 0 && currentGrid[r-1][c-1].content === 0 && !currentGrid[r-1][c-1].display) {
      currentGrid[r-1][c-1].display = true;
      currentGrid = spreadZeroTiles(currentGrid, r-1, c-1);
    }
    if ((r - 1) >= 0 && currentGrid[r-1][c].content === 0 && !currentGrid[r-1][c].display) {
      currentGrid[r-1][c].display = true;
      currentGrid = spreadZeroTiles(currentGrid, r-1, c);
    }
    if ((r - 1) >= 0 && (c + 1) < currentGrid[r].length && currentGrid[r-1][c+1].content === 0 && !currentGrid[r-1][c+1].display) {
      currentGrid[r-1][c+1].display = true;
      currentGrid = spreadZeroTiles(currentGrid, r-1, c+1);
    }
    if ((c + 1) < currentGrid[r].length && currentGrid[r][c+1].content === 0 && !currentGrid[r][c+1].display) {
      currentGrid[r][c+1].display = true;
      currentGrid = spreadZeroTiles(currentGrid, r, c+1);
    }
    if ((r + 1) < currentGrid.length && (c + 1) < currentGrid[r].length && currentGrid[r+1][c+1].content === 0 && !currentGrid[r+1][c+1].display) {
      currentGrid[r+1][c+1].display = true;
      currentGrid = spreadZeroTiles(currentGrid, r+1, c+1);
    }
    if ((r + 1) < currentGrid.length && currentGrid[r+1][c].content === 0 && !currentGrid[r+1][c].display) {
      currentGrid[r+1][c].display = true;
      currentGrid = spreadZeroTiles(currentGrid, r+1, c);
    }
    if ((r + 1) < currentGrid.length && (c - 1) >= 0 && currentGrid[r+1][c-1].content === 0 && !currentGrid[r+1][c-1].display) {
      currentGrid[r+1][c-1].display = true;
      currentGrid = spreadZeroTiles(currentGrid, r+1, c-1);
    }
    if ((c - 1) >= 0 && currentGrid[r][c-1].content === 0 && !currentGrid[r][c-1].display) {
      currentGrid[r][c-1].display = true;
      currentGrid = spreadZeroTiles(currentGrid, r, c-1);
    }
    return currentGrid;
  }

  function displayTilesNearZero(currentGrid) {
    for (let r = 0; r < currentGrid.length; r++) {
      for (let c = 0; c < currentGrid[r].length; c++) {
        if (currentGrid[r][c].content === 0 && currentGrid[r][c].display) {
          if ((r - 1) >= 0 && (c - 1) >= 0 && !currentGrid[r-1][c-1].display) {
            currentGrid[r-1][c-1].display = true;
          }
          if ((r - 1) >= 0 && !currentGrid[r-1][c].display) {
            currentGrid[r-1][c].display = true;
          }
          if ((r - 1) >= 0 && (c + 1) < currentGrid[r].length && !currentGrid[r-1][c+1].display) {
            currentGrid[r-1][c+1].display = true;
          }
          if ((c + 1) < currentGrid[r].length && !currentGrid[r][c+1].display) {
            currentGrid[r][c+1].display = true;
          }
          if ((r + 1) < currentGrid.length && (c + 1) < currentGrid[r].length && !currentGrid[r+1][c+1].display) {
            currentGrid[r+1][c+1].display = true;
          }
          if ((r + 1) < currentGrid.length && !currentGrid[r+1][c].display) {
            currentGrid[r+1][c].display = true;
          }
          if ((r + 1) < currentGrid.length && (c - 1) >= 0 && !currentGrid[r+1][c-1].display) {
            currentGrid[r+1][c-1].display = true;
          }
          if ((c - 1) >= 0 && !currentGrid[r][c-1].display) {
            currentGrid[r][c-1].display = true;
          }
        }
      }
    }
    return currentGrid;
  }

  function handleClick(e) {
    if (e.target.id) {
      let currentGrid = [...grid];
      const row = e.target.id.split("-")[0];
      const column = e.target.id.split("-")[1];
      if (e.metaKey) {
        currentGrid[row][column].hint = !currentGrid[row][column].hint;
      } else {
        if (currentGrid[row][column].content === "M") {
          currentGrid.forEach(row => {
            row.forEach(tile =>  tile.display = true);
          });
          setisGameOver(true);
          setIsTimerOn('end');
        } else {
          if (!currentGrid[row][column].display) {
            setIsTimerOn('start');
            currentGrid[row][column].display = true;
            if (currentGrid[row][column].content === 0) {
              currentGrid = spreadZeroTiles(currentGrid, parseInt(row), parseInt(column));
              currentGrid = displayTilesNearZero(currentGrid);
            }
          }
        }
      }
      setGrid(currentGrid);
      if (checkEndGame()) {
        setIsTimerOn('end');
        currentGrid.forEach(row => {
          row.forEach(tile =>  tile.display = true);
        });
        setGrid(currentGrid);
      }
      console.log(checkEndGame());
    }
  }

  return (
    <div className="App">
      <div id="controller">
        <div id="remainingMines">
          <p>{20 - (grid.flat().filter(i => i.hint).length)}</p>
        </div>
        <button
          id="resetGame"
          className={!isGameOver ? 'gameOn' : 'gameOver'}
          onClick={(e)=> {
              setplayingGame(!playingGame);
              setIsTimerOn('reset');
            }
          }
        ></button>
        <Timer isTimerOn={isTimerOn} />
      </div>
      <div id="container">
        {grid.flat().map((g, i) => {
          return (
            <div
              onClick={(e)=> handleClick(e)}
              className={`item item-${g.content} ${g.display ? 'display' : ''}`}
              style={{backgroundColor: g.hint ? 'red' :  g.display ? 'white' : 'lightgray'}}
              id={`${Math.floor(i / 10)}-${i % 10}`}
              key={`${Math.floor(i / 10)}-${i % 10}`}
              ><p>{g.display ? g.content : ""}</p>
            </div>
          );      
        })}
      </div>  
    </div>
  );
}

export default App;

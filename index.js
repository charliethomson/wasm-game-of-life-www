import { Universe, Cell } from "wasm-game-of-life";
import { memory } from "wasm-game-of-life/wasm_game_of_life_bg";

/*
const pre = document.getElementById("game-of-life-canvas");

const universe = Universe.new();

var renderLoop = () => {
    pre.textContent = universe.render();
    universe.tick();

    requestAnimationFrame(renderLoop);
}; */

// Construct the universe, and get its width and height.
let universe = Universe.new();
const width = universe.width();
const height = universe.height();

const CELL_SIZE = 10;
const GRID_COLOR = "#CCCCCC";
const IDLE_COLOR = "#FFFFFF";
const DEAD_COLOR = "#FF0000";
const ALIVE_COLOR = "#00FF00";

const pause_button = document.getElementById("play-pause");
let pause = false;
pause_button.onclick = () => {
    pause = !pause;
}

const reset_button = document.getElementById("reset");
reset_button.onclick = () => {
    // universe.clear();
    universe = Universe.new();
}

const step_button = document.getElementById("step");
step_button.onclick = () => {
    pause = true;
    universe.tick();
    requestAnimationFrame(renderLoop);
}

// Give the canvas room for all of our cells and a 1px border
// around each of them.
const canvas = document.getElementById("game-of-life-canvas");
canvas.height = (CELL_SIZE + 1) * height + 1;
canvas.width = (CELL_SIZE + 1) * width + 1;

const ctx = canvas.getContext('2d');

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

const renderLoop = () => {
    if (!pause) {
        universe.tick();
    }

    let x = getRandomInt(universe.width());
    let y = getRandomInt(universe.height());
    // universe.push_cell(x, y);
    drawGrid();
    drawCells();

    requestAnimationFrame(renderLoop);
};

const drawGrid = () => {
    ctx.beginPath();
    ctx.strokeStyle = GRID_COLOR;

    // Vertical lines.
    for (let i = 0; i <= width; i++) {
        ctx.moveTo(i * (CELL_SIZE + 1) + 1, 0);
        ctx.lineTo(i * (CELL_SIZE + 1) + 1, (CELL_SIZE + 1) * height + 1);
    }

    // Horizontal lines.
    for (let j = 0; j <= height; j++) {
        ctx.moveTo(0, j * (CELL_SIZE + 1) + 1);
        ctx.lineTo((CELL_SIZE + 1) * width + 1, j * (CELL_SIZE + 1) + 1);
    }

    ctx.stroke();
};

const getIndex = (row, column) => {
    return row * width + column;
};

const drawCells = () => {
    const cellsPtr = universe.cells();
    const cells = new Uint8Array(memory.buffer, cellsPtr, width * height);

    ctx.beginPath();

    for (let row = 0; row < height; row++) {
        for (let col = 0; col < width; col++) {
            const idx = getIndex(row, col);

            let cell = cells[idx];
            if (cell === Cell.Alive) {
                ctx.fillStyle = ALIVE_COLOR;
            } else if (cell === Cell.Dead) {
                ctx.fillStyle = DEAD_COLOR;
            } else if (cell === Cell.Idle) {
                ctx.fillStyle = IDLE_COLOR;
            } else {
                
            }

            ctx.fillRect(
                col * (CELL_SIZE + 1) + 1,
                row * (CELL_SIZE + 1) + 1,
                CELL_SIZE,
                CELL_SIZE
            );
        }
    }

    ctx.stroke();
};

console.log("Done loading! Entering render loop");

requestAnimationFrame(renderLoop);

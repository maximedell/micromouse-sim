import { useMazeStore } from "../stores/MazeStore";
import { Cell } from "../types/cell";
import { RobotSystem } from "./RobotSystem";
import { Direction } from "../types/robotAPI";
import { MAZE_CONSTANTS, ROBOT_CONSTANTS } from "../data/constant";

export const MazeSystem = {
	createCell(x: number, y: number): Cell {
		return {
			x,
			y,
			walls: {
				top: true,
				right: true,
				bottom: true,
				left: true,
			},
			visited: false,
			start: false,
			end: false,
		};
	},

	generateEmptyMaze(size: number) {
		const maze: Cell[][] = [];
		for (let i = 0; i < size; i++) {
			const row: Cell[] = [];
			for (let j = 0; j < size; j++) {
				row.push(this.createCell(i, j));
			}
			maze.push(row);
		}
		useMazeStore.getState().initMaze(maze);
	},

	startGeneration() {
		const maze = useMazeStore.getState().maze;
		const start = maze[0][0];
		start.visited = true;
		useMazeStore.getState().startGeneration(start);
	},

	stepGeneration() {
		const state = useMazeStore.getState();
		const { maze, stack } = state;
		if (stack.length === 0) {
			this.setStartAndEnd();
			return;
		}

		const current = state.current as Cell;
		const neighbors = this.getUnvisitedNeighbors(current, maze);

		if (neighbors.length > 0) {
			const randomIndex = Math.floor(Math.random() * neighbors.length);
			const next = neighbors[randomIndex];
			next.visited = true;

			this.removeWallsBetween(current, next);

			state.addToStack(next);
			state.updateCell(next);
			state.setGenerated(false);
			state.setCurrent(next);
		} else {
			state.removeFromStack();
			state.setCurrent(stack[stack.length - 1]);
		}
	},

	getUnvisitedNeighbors(cell: Cell, maze: Cell[][]): Cell[] {
		const neighbors: Cell[] = [];
		const directions = [
			{ dx: 0, dy: -1 }, // top
			{ dx: 1, dy: 0 }, // right
			{ dx: 0, dy: 1 }, // bottom
			{ dx: -1, dy: 0 }, // left
		];

		for (const { dx, dy } of directions) {
			const newX = cell.x + dx;
			const newY = cell.y + dy;
			if (
				newX >= 0 &&
				newY >= 0 &&
				newX < maze.length &&
				newY < maze[0].length &&
				!maze[newX][newY].visited
			) {
				neighbors.push(maze[newX][newY]);
			}
		}
		return neighbors;
	},

	removeWallsBetween(cellA: Cell, cellB: Cell) {
		const dx = cellA.x - cellB.x;
		const dy = cellA.y - cellB.y;
		if (dx === 1) {
			cellA.walls.left = false;
			cellB.walls.right = false;
		}
		if (dx === -1) {
			cellA.walls.right = false;
			cellB.walls.left = false;
		}
		if (dy === 1) {
			cellA.walls.top = false;
			cellB.walls.bottom = false;
		}
		if (dy === -1) {
			cellA.walls.bottom = false;
			cellB.walls.top = false;
		}
	},

	setStartAndEnd() {
		const state = useMazeStore.getState();
		const maze = state.maze;

		const deadEnds = this.findDeadEnds(maze);

		const borderDeadEnds = deadEnds.filter((cell) =>
			this.isAtBorder(cell, maze)
		);
		if (borderDeadEnds.length === 0) {
			console.log();
			throw new Error("No dead ends at the border.");
		}
		const start =
			borderDeadEnds[Math.floor(Math.random() * borderDeadEnds.length)];

		if (!start) {
			throw new Error("No valid start cell found.");
		}

		const distances = this.bfsDistances(start, maze);

		const notBorderDeadEnds = deadEnds.filter(
			(cell) => !this.isAtBorder(cell, maze)
		);
		if (notBorderDeadEnds.length === 0) {
			throw new Error("No dead ends not at the border.");
		}
		const end = notBorderDeadEnds.reduce((farthtest, cell) => {
			const key = `${cell.x}-${cell.y}`;
			const dist = distances.get(key)?.dist ?? -1;
			const farDist =
				distances.get(`${farthtest.x}-${farthtest.y}`)?.dist ?? -1;
			return dist > farDist ? cell : farthtest;
		}, notBorderDeadEnds[0]);

		if (!end) {
			throw new Error("No valid end cell found.");
		}

		const updatedMaze = maze.map((row) =>
			row.map((cell) => ({
				...cell,
				start: cell.x === start.x && cell.y === start.y,
				end: cell.x === end.x && cell.y === end.y,
				visited: false,
			}))
		);

		state.setGeneratedMaze(updatedMaze);
		RobotSystem.setSartingPosition();
	},

	bfsDistances(
		start: Cell,
		maze: Cell[][]
	): Map<string, { cell: Cell; dist: number }> {
		const queue: { cell: Cell; dist: number }[] = [{ cell: start, dist: 0 }];
		const visited = new Set<string>();
		const result = new Map();

		const cellKey = (c: Cell) => `${c.x}-${c.y}`;
		visited.add(cellKey(start));

		while (queue.length > 0) {
			const { cell, dist } = queue.shift()!;
			result.set(cellKey(cell), { cell, dist });

			const neighbors = this.getAccessibleNeighbors(cell, maze);
			for (const neighbor of neighbors) {
				const key = cellKey(neighbor);
				if (!visited.has(key)) {
					visited.add(key);
					queue.push({ cell: neighbor, dist: dist + 1 });
				}
			}
		}

		return result;
	},

	getAccessibleNeighbors(cell: Cell, maze: Cell[][]): Cell[] {
		const directions = [
			{ dx: 0, dy: -1, wall: "top", opp: "bottom" },
			{ dx: 1, dy: 0, wall: "right", opp: "left" },
			{ dx: 0, dy: 1, wall: "bottom", opp: "top" },
			{ dx: -1, dy: 0, wall: "left", opp: "right" },
		];

		const neighbors: Cell[] = [];

		for (const { dx, dy, wall, opp } of directions) {
			const nx = cell.x + dx;
			const ny = cell.y + dy;

			if (nx >= 0 && ny >= 0 && nx < maze.length && ny < maze[0].length) {
				const neighbor = maze[nx][ny];
				if (
					!cell.walls[wall as keyof typeof cell.walls] &&
					!neighbor.walls[opp as keyof typeof neighbor.walls]
				) {
					neighbors.push(neighbor);
				}
			}
		}

		return neighbors;
	},

	getFarthest(distances: Map<string, { cell: Cell; dist: number }>): Cell {
		const firstValue = distances.values().next().value;
		if (!firstValue) {
			throw new Error("Distances map is empty.");
		}
		let farthest: { cell: Cell; dist: number } = {
			cell: firstValue.cell,
			dist: 0,
		};
		for (const entry of distances.values()) {
			if (entry.dist > farthest.dist) {
				farthest = entry;
			}
		}
		return farthest.cell;
	},

	findDeadEnds(maze: Cell[][]): Cell[] {
		const deadEnds: Cell[] = [];

		for (const row of maze) {
			for (const cell of row) {
				const neighbors = this.getAccessibleNeighbors(cell, maze);
				if (neighbors.length === 1) {
					deadEnds.push(cell);
				}
			}
		}

		return deadEnds;
	},
	isAtBorder(cell: Cell, maze: Cell[][]): boolean {
		return (
			cell.x === 0 ||
			cell.y === 0 ||
			cell.x === maze.length - 1 ||
			cell.y === maze[0].length - 1
		);
	},
	getWallDistance(
		pos: { x: number; y: number; angle: number },
		dir: Direction,
		maxRange: number = MAZE_CONSTANTS.CELL_SIZE *
			ROBOT_CONSTANTS.ROBOT_MAX_DETECTION_DISTANCE,
		step: number = 4
	): number {
		const x = pos.x;
		const y = pos.y;
		const angle = pos.angle;

		let viewAngle = angle;
		if (dir === "left") viewAngle -= 90;
		if (dir === "right") viewAngle += 90;
		const rad = (viewAngle * Math.PI) / 180;

		for (let dist = 0; dist <= maxRange; dist += step) {
			const tx = x + Math.cos(rad) * dist;
			const ty = y + Math.sin(rad) * dist;

			if (MazeSystem.hasCollision(tx, ty, ROBOT_CONSTANTS.ROBOT_SIZE)) {
				return dist;
			}
		}

		return ROBOT_CONSTANTS.ROBOT_MAX_DETECTION_DISTANCE;
	},

	hasCollision(x: number, y: number, size: number): boolean {
		const maze = useMazeStore.getState().maze;
		const cellSize = MAZE_CONSTANTS.CELL_SIZE;

		const half = size / 2;

		// les bords du robot
		const left = x - half;
		const right = x + half;
		const top = y - half;
		const bottom = y + half;

		// les 4 cellules dans lesquelles le robot peut empiéter
		const minCol = Math.floor(left / cellSize);
		const maxCol = Math.floor(right / cellSize);
		const minRow = Math.floor(top / cellSize);
		const maxRow = Math.floor(bottom / cellSize);

		for (let col = minCol; col <= maxCol; col++) {
			for (let row = minRow; row <= maxRow; row++) {
				const cell = maze[col]?.[row];
				if (!cell) return true; // hors de la grille = mur

				const cellLeft = col * cellSize;
				const cellRight = cellLeft + cellSize;
				const cellTop = row * cellSize;
				const cellBottom = cellTop + cellSize;

				// Collision avec le mur gauche
				if (cell.walls.left && left < cellLeft && right > cellLeft) return true;

				// Mur droit
				if (cell.walls.right && right > cellRight && left < cellRight)
					return true;

				// Mur haut
				if (cell.walls.top && top < cellTop && bottom > cellTop) return true;

				// Mur bas
				if (cell.walls.bottom && bottom > cellBottom && top < cellBottom)
					return true;
			}
		}

		return false;
	},
};

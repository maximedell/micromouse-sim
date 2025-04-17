import { useRobotStore } from "../stores/RobotStore";
import { MAZE_CONSTANTS, ROBOT_CONSTANTS } from "../data/constant";
import { useMazeStore } from "../stores/MazeStore";
import { MazeSystem } from "./MazeSystem";
import { useGameStore } from "../stores/GameStore";
import { RobotRunnerSystem } from "./RobotRunnerSystem";

const acceleration = ROBOT_CONSTANTS.ROBOT_ACCELERATION;
const maxSpeed = ROBOT_CONSTANTS.ROBOT_MAX_SPEED;
const maxSpeedForRotation = ROBOT_CONSTANTS.ROBOT_MAX_SPEED_FOR_ROTATION;
const cellSize = MAZE_CONSTANTS.CELL_SIZE;
export const RobotSystem = {
	tick(dt: number = 1) {
		const state = useRobotStore.getState();
		const { x, y, angle, speed, accelerating, decelerating } = state;

		let newSpeed = speed;
		if (accelerating) {
			newSpeed = Math.min(maxSpeed, speed + acceleration * dt);
		} else if (decelerating) {
			newSpeed = Math.max(0, speed - acceleration * dt);
		}

		const rad = (angle * Math.PI) / 180;

		const distance = newSpeed * MAZE_CONSTANTS.CELL_SIZE * dt;
		const dx = Math.cos(rad) * distance;
		const dy = Math.sin(rad) * distance;

		const nextX = x + dx;
		const nextY = y + dy;

		if (!MazeSystem.hasCollision(nextX, nextY, ROBOT_CONSTANTS.ROBOT_SIZE)) {
			const cellX = Math.floor(nextX / cellSize);
			const cellY = Math.floor(nextY / cellSize);
			const maze = useMazeStore.getState().maze;
			const currentCell = maze[cellX]?.[cellY];

			useRobotStore.setState({
				x: nextX,
				y: nextY,
				speed: newSpeed,
			});

			if (currentCell?.end) {
				RobotRunnerSystem.stop();
				useGameStore.getState().stopGame();
			}

			if (
				currentCell &&
				!currentCell.visited &&
				!currentCell.start &&
				!currentCell.end
			) {
				const visited = { ...currentCell, visited: true };
				useMazeStore.getState().updateCell(visited);
			}
		} else {
			useRobotStore.setState({ speed: 0 });
		}
	},
	rotate(delta: number) {
		const { speed, angle } = useRobotStore.getState();

		if (speed > maxSpeedForRotation) {
			return;
		}

		const newAngle = (angle + delta + 360) % 360;
		useRobotStore.getState().setAngle(newAngle);
	},

	rotateLeft(angle: number) {
		this.rotate(-angle);
	},
	rotateRight(angle: number) {
		this.rotate(angle);
	},

	setSartingPosition() {
		const maze = useMazeStore.getState().maze;
		const start = maze.flat().find((cell) => cell.start);
		if (start) {
			useRobotStore
				.getState()
				.setPosition(
					start.x * MAZE_CONSTANTS.CELL_SIZE + MAZE_CONSTANTS.CELL_SIZE / 2,
					start.y * MAZE_CONSTANTS.CELL_SIZE + MAZE_CONSTANTS.CELL_SIZE / 2
				);
		}
	},
	accelerate() {
		useRobotStore.getState().setAccelerating(true);
	},
	decelerate() {
		useRobotStore.getState().setDecelerating(true);
	},
	stop() {
		useRobotStore.getState().setAccelerating(false);
		useRobotStore.getState().setDecelerating(false);
	},
	getSpeed() {
		return useRobotStore.getState().speed;
	},
	reset() {
		useRobotStore.getState().reset();
	},
	getPosition(): { x: number; y: number; angle: number } {
		const { x, y, angle } = useRobotStore.getState();
		return { x, y, angle };
	},
};

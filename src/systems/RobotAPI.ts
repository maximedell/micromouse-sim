import { RobotAPI, Direction } from "../types/robotAPI";
import { MazeSystem } from "./MazeSystem";
import { RobotRunnerSystem } from "./RobotRunnerSystem";
import { RobotSystem } from "./RobotSystem";
import { MAZE_CONSTANTS, ROBOT_CONSTANTS } from "../data/constant";

export const createRobotAPI = (): RobotAPI => ({
	accelerate: () => RobotSystem.accelerate(),
	stopAccelerating: () => RobotSystem.stop(),
	stopDecelerating: () => RobotSystem.stop(),
	decelerate: () => RobotSystem.decelerate(),
	rotateLeft: (angle: number) => RobotSystem.rotate(-angle),
	rotateRight: (angle: number) => RobotSystem.rotate(angle),
	getWall(dir): boolean {
		const distance = MazeSystem.getWallDistance(RobotSystem.getPosition(), dir);
		const threshold = MAZE_CONSTANTS.CELL_SIZE - ROBOT_CONSTANTS.ROBOT_SIZE / 2;
		return distance > 0 && distance <= threshold;
	},
	getWallDistance: (dir) =>
		MazeSystem.getWallDistance(RobotSystem.getPosition(), dir),
	log: (msg: string) => console.log("[Robot log]", msg),
	getSpeed: () => RobotSystem.getSpeed(),
	reset: () => RobotSystem.reset(),
	waitUntil: (predicate: () => boolean) => {
		return RobotRunnerSystem.registerWait(predicate);
	},
});

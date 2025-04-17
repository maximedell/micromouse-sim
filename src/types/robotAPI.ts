export type Direction = "front" | "left" | "right";

export type RobotAPI = {
	getWall: (direction: Direction) => boolean;
	getWallDistance: (direction: Direction) => number;
	accelerate: () => void;
	rotateRight: (angle: number) => void;
	rotateLeft: (angle: number) => void;
	stopAccelerating: () => void;
	stopDecelerating: () => void;
	decelerate: () => void;
	log: (message: string) => void;
	getSpeed: () => number;
	reset: () => void;
	waitUntil: (predicate: () => boolean) => Promise<void>;
};

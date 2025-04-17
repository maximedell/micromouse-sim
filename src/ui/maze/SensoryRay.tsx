import { Line } from "react-konva";
import { Direction } from "../../types/robotAPI";
import { useRobotStore } from "../../stores/RobotStore";
import { MazeSystem } from "../../systems/MazeSystem";
import { ROBOT_CONSTANTS } from "../../data/constant";
import { MAZE_CONSTANTS } from "../../data/constant";

type Props = {
	direction: Direction;
	color?: string;
};

export const SensorRay = ({ direction, color = "#7a0000" }: Props) => {
	const { x, y, angle } = useRobotStore();

	const distance = MazeSystem.getWallDistance({ x, y, angle }, direction);
	const effectiveDistance =
		distance === -1
			? ROBOT_CONSTANTS.ROBOT_MAX_DETECTION_DISTANCE * MAZE_CONSTANTS.CELL_SIZE
			: distance;

	let dirAngle = angle;
	if (direction === "left") dirAngle -= 90;
	if (direction === "right") dirAngle += 90;

	const rad = (dirAngle * Math.PI) / 180;

	const offset = ROBOT_CONSTANTS.ROBOT_SIZE / 2;

	// Point de départ : bord avant du robot
	const startX = x + Math.cos(rad) * offset;
	const startY = y + Math.sin(rad) * offset;

	// Point d'arrivée : distance détectée à partir de ce bord
	const endX = startX + Math.cos(rad) * effectiveDistance;
	const endY = startY + Math.sin(rad) * effectiveDistance;

	return (
		<Line
			points={[startX, startY, endX, endY]}
			stroke={color}
			strokeWidth={2}
			dash={[4, 4]}
			lineCap="round"
		/>
	);
};

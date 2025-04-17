import { useRobotStore } from "../../stores/RobotStore";
import { ROBOT_CONSTANTS } from "../../data/constant";
import { Rect, Group, Text } from "react-konva";

export const RobotCanvas = () => {
	const { x, y, angle } = useRobotStore();

	const size = ROBOT_CONSTANTS.ROBOT_SIZE;
	const color = ROBOT_CONSTANTS.ROBOT_COLOR;

	return (
		<Group x={x} y={y} rotation={angle}>
			<Rect
				x={-size / 2}
				y={-size / 2}
				width={size}
				height={size}
				fill={color}
				cornerRadius={4}
				stroke="black"
				strokeWidth={1}
			/>
			<Text
				x={-size / 2 + 10}
				y={-10}
				text="›"
				fontSize={20}
				fill="black"
				fontStyle="bold"
			/>
		</Group>
	);
};

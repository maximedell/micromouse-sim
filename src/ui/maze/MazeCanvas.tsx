import { Stage, Layer, Line, Rect } from "react-konva";
import { useMazeStore } from "../../stores/MazeStore";
import { MAZE_CONSTANTS } from "../../data/constant";
import { RobotCanvas } from "./RobotCanvas";
import { SensorRay } from "./SensoryRay";

const cellSize = MAZE_CONSTANTS.CELL_SIZE;
const wallColor = MAZE_CONSTANTS.WALL_COLOR;
const pathColor = MAZE_CONSTANTS.PATH_COLOR;
const startColor = MAZE_CONSTANTS.START_COLOR;
const endColor = MAZE_CONSTANTS.END_COLOR;
const visitedColor = MAZE_CONSTANTS.VISITED_COLOR;
export const MazeCanvas = () => {
	const maze = useMazeStore((state) => state.maze);
	const size = useMazeStore((state) => state.size);
	const generated = useMazeStore((state) => state.generated);
	return (
		<div className="flex justify-center mb-4">
			<Stage width={size * cellSize} height={size * cellSize}>
				<Layer>
					{maze.flatMap((row) =>
						row.map((cell) => {
							const { x, y, walls } = cell;
							const cx = x * cellSize;
							const cy = y * cellSize;
							const elements = [
								<Rect
									key={`cell-${x}-${y}`}
									x={cx}
									y={cy}
									width={cellSize}
									height={cellSize}
									fill={
										cell.start
											? startColor
											: cell.end
											? endColor
											: cell.visited
											? visitedColor
											: pathColor
									}
								/>,
							];

							if (walls.top) {
								elements.push(
									<Line
										key={`top-${x}-${y}`}
										points={[cx, cy, cx + cellSize, cy]}
										stroke={wallColor}
									/>
								);
							}
							if (walls.right) {
								elements.push(
									<Line
										key={`right-${x}-${y}`}
										points={[cx + cellSize, cy, cx + cellSize, cy + cellSize]}
										stroke={wallColor}
									/>
								);
							}
							if (walls.bottom) {
								elements.push(
									<Line
										key={`bottom-${x}-${y}`}
										points={[cx, cy + cellSize, cx + cellSize, cy + cellSize]}
										stroke={wallColor}
									/>
								);
							}
							if (walls.left) {
								elements.push(
									<Line
										key={`left-${x}-${y}`}
										points={[cx, cy, cx, cy + cellSize]}
										stroke={wallColor}
									/>
								);
							}

							return elements;
						})
					)}
					{generated && (
						<>
							<RobotCanvas />
							<SensorRay direction="front" />
							<SensorRay direction="left" />
							<SensorRay direction="right" />
						</>
					)}
				</Layer>
			</Stage>
		</div>
	);
};

import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { Cell } from "../types/cell";

interface MazeStore {
	maze: Cell[][];
	stack: Cell[];
	current: Cell | null;
	generated: boolean;
	size: number;
}
interface MazeActions {
	initMaze: (maze: Cell[][]) => void;
	startGeneration: (start: Cell) => void;
	setGenerated: (generated: boolean) => void;
	addToStack: (cell: Cell) => void;
	removeFromStack: () => void;
	setCurrent: (cell: Cell) => void;
	updateCell: (cell: Cell) => void;
	setGeneratedMaze: (maze: Cell[][]) => void;
	resetVisited: () => void;
}

interface MazeStoreWithActions extends MazeStore, MazeActions {}

export const useMazeStore = create<MazeStoreWithActions>()(
	subscribeWithSelector((set) => ({
		maze: [],
		size: 0,
		stack: [],
		current: null,
		generated: false,

		initMaze: (maze) => {
			set(() => ({
				maze: maze,
				size: maze.length,
				stack: [],
				current: null,
				generated: false,
			}));
		},
		startGeneration: (start) => {
			useMazeStore.getState().updateCell(start);
			set({
				stack: [start],
				current: start,
				generated: false,
			});
		},
		setGenerated: (generated) => set(() => ({ generated })),
		addToStack: (cell) => set((state) => ({ stack: [...state.stack, cell] })),
		removeFromStack: () =>
			set((state) => ({
				stack: state.stack.slice(0, -1),
			})),
		setCurrent: (cell) =>
			set(() => ({
				current: cell,
			})),
		updateCell: (cell) =>
			set((state) => {
				const newMaze = state.maze.map((row) =>
					row.map((c) => {
						if (c.x === cell.x && c.y === cell.y) {
							return cell;
						}
						return c;
					})
				);
				return {
					maze: newMaze,
				};
			}),
		setGeneratedMaze: (maze) =>
			set(() => ({
				maze: maze,
				size: maze.length,
				stack: [],
				current: null,
				generated: true,
			})),
		resetVisited: () =>
			set((state) => ({
				maze: state.maze.map((row) =>
					row.map((cell) => ({ ...cell, visited: false }))
				),
			})),
	}))
);

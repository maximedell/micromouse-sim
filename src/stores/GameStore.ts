import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

interface GameState {
	isRunning: boolean;
	startTime: number | null;
	elapsedTime: number;
}

interface GameActions {
	startGame: () => void;
	stopGame: () => void;
	toggleGame: () => void;
}

export const useGameStore = create<GameState & GameActions>()(
	subscribeWithSelector((set) => ({
		isRunning: false,
		startTime: null,
		elapsedTime: 0,

		startGame: () =>
			set({ isRunning: true, startTime: Date.now(), elapsedTime: 0 }),
		stopGame: () =>
			set((state) => ({
				isRunning: false,
				elapsedTime: state.startTime
					? (Date.now() - state.startTime) / 1000
					: 0,
			})),
		toggleGame: () => set((state) => ({ isRunning: !state.isRunning })),
	}))
);

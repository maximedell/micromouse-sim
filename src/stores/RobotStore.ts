import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

interface RobotState {
	x: number;
	y: number;
	angle: number;
	speed: number;
	accelerating: boolean;
	decelerating: boolean;
}

interface RobotActions {
	setPosition: (x: number, y: number) => void;
	setAngle: (angle: number) => void;
	setSpeed: (speed: number) => void;
	setAccelerating: (value: boolean) => void;
	setDecelerating: (value: boolean) => void;
	reset: () => void;
}

interface RobotStore extends RobotState, RobotActions {}

export const useRobotStore = create<RobotStore>()(
	subscribeWithSelector((set) => ({
		x: 0,
		y: 0,
		angle: 0,
		speed: 0,
		accelerating: false,
		decelerating: false,

		setPosition: (x, y) => set(() => ({ x, y })),
		setAngle: (angle) => set(() => ({ angle })),
		setSpeed: (speed) => set(() => ({ speed })),
		setAccelerating: (value) => set(() => ({ accelerating: value })),
		setDecelerating: (value) => set(() => ({ decelerating: value })),
		reset: () =>
			set(() => ({
				angle: 0,
				speed: 0,
				accelerating: false,
				decelerating: false,
			})),
	}))
);

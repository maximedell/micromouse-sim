import { useEffect, useRef } from "react";
import { RobotSystem } from "./systems/RobotSystem";
import { useGameStore } from "./stores/GameStore";
import { RobotRunnerSystem } from "./systems/RobotRunnerSystem";

export const GameLoop = () => {
	const isRunning = useGameStore((s) => s.isRunning);
	const lastTimeRef = useRef(performance.now());

	useEffect(() => {
		if (!isRunning) return;

		let running = true;

		const loop = (time: number) => {
			if (!running || !useGameStore.getState().isRunning) return;

			const delta = (time - lastTimeRef.current) / 1000;
			lastTimeRef.current = time;

			RobotSystem.tick(delta);
			RobotRunnerSystem.tick();

			requestAnimationFrame(loop);
		};

		requestAnimationFrame(loop);

		return () => {
			running = false;
		};
	}, [isRunning]);

	return null;
};

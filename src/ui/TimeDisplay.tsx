import { useEffect, useState } from "react";
import { useGameStore } from "../stores/GameStore";

export const TimerDisplay = () => {
	const isRunning = useGameStore((s) => s.isRunning);
	const startTime = useGameStore((s) => s.startTime);
	const finalTime = useGameStore((s) => s.elapsedTime);
	const [currentTime, setCurrentTime] = useState(0);

	useEffect(() => {
		let interval: number | undefined;

		if (isRunning && startTime) {
			interval = setInterval(() => {
				setCurrentTime((Date.now() - startTime) / 1000);
			}, 10);
		}

		return () => {
			if (interval) clearInterval(interval);
		};
	}, [isRunning, startTime]);

	const timeToDisplay = isRunning ? currentTime : finalTime;
	const minutes = Math.floor(timeToDisplay / 60);
	const seconds = Math.floor(timeToDisplay % 60);
	const centiseconds = Math.floor((timeToDisplay % 1) * 100);

	// Ajout d'un padding à 2 chiffres
	const pad = (n: number) => String(n).padStart(2, "0");

	return (
		<div className="text-xl font-mono text-center mt-2">
			⏱️ Temps : {`${pad(minutes)}:${pad(seconds)}:${pad(centiseconds)}`}
		</div>
	);
};

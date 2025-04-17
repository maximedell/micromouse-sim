import { useEffect, useRef, useState } from "react";
import { MazeSystem } from "../../systems/MazeSystem";
import { useMazeStore } from "../../stores/MazeStore";
import { useGameStore } from "../../stores/GameStore";

export const MazeControls = () => {
	const [running, setRunning] = useState(false);
	const [size, setSize] = useState(10);
	const intervalRef = useRef<number | null>(null);
	const generated = useMazeStore((state) => state.generated);
	const isRunning = useGameStore((state) => state.isRunning);

	// Quand `generated` devient true → arrêt de l'animation
	useEffect(() => {
		if (generated && running) {
			stopAnimation();
		}
	}, [generated, running]);

	const stopAnimation = () => {
		setRunning(false);
		if (intervalRef.current) {
			clearInterval(intervalRef.current);
			intervalRef.current = null;
		}
	};

	const handleGenerate = () => {
		MazeSystem.generateEmptyMaze(size);
		MazeSystem.startGeneration();
		setRunning(true);
		intervalRef.current = setInterval(() => {
			MazeSystem.stepGeneration();
		}, (25 - size) * 2);
	};

	// Nettoyage au démontage du composant
	useEffect(() => {
		return () => {
			stopAnimation();
		};
	}, []);

	return (
		<div className="flex flex-row justify-center gap-4 my-6">
			<div className="flex gap-2 items-center">
				<label htmlFor="size" className="text-accent text-sm font-medium">
					Taille :
				</label>
				<input
					id="size"
					type="number"
					value={size}
					min={5}
					max={25}
					onChange={(e) => setSize(parseInt(e.target.value))}
					className="w-16 px-2 py-1 border rounded text-center"
					disabled={running || isRunning}
				/>
			</div>

			<button
				className={`px-6 py-2 rounded text-white font-medium ${
					running
						? "bg-gray-500 cursor-not-allowed"
						: "bg-primary-light hover:bg-primary-dark"
				}`}
				onClick={handleGenerate}
				disabled={running || isRunning} // désactiver le bouton si le labyrinthe est en cours de génération ou si le jeu est en cours
			>
				{running ? (
					<span className="animate-pulse">Génération...</span>
				) : (
					"Générer"
				)}
			</button>
		</div>
	);
};

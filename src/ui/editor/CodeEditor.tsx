import Editor from "@monaco-editor/react";
import { useCodeStore } from "../../stores/CodeStore";
import { RobotRunnerSystem } from "../../systems/RobotRunnerSystem";
import { useGameStore } from "../../stores/GameStore";
import { RobotSystem } from "../../systems/RobotSystem";
import { useMazeStore } from "../../stores/MazeStore";
import { createRobotAPI } from "../../systems/RobotAPI";
type CodeEditorProps = {
	onCodeChange?: (code: string) => void;
};

export const CodeEditor = ({ onCodeChange }: CodeEditorProps) => {
	const code = useCodeStore((state) => state.code);
	const setCode = useCodeStore((state) => state.setCode);
	const isRunning = useGameStore((s) => s.isRunning);
	const startGame = useGameStore((s) => s.startGame);
	const stopGame = useGameStore((s) => s.stopGame);
	const generated = useMazeStore((s) => s.generated);

	const handleEditorChange = (value: string | undefined) => {
		const newCode = value ?? "";
		setCode(newCode);
		onCodeChange?.(newCode);
	};

	const handleClick = () => {
		if (!isRunning) {
			const code = useCodeStore.getState().code;
			const robot = createRobotAPI();

			RobotSystem.setSartingPosition();
			RobotRunnerSystem.start(code, robot);
			startGame();
		} else {
			stopGame();
			RobotRunnerSystem.stop(); // ← stoppe l'attente
			RobotSystem.reset();
			useMazeStore.getState().resetVisited();
			RobotSystem.setSartingPosition();
		}
	};

	return (
		<div className="flex flex-col items-center">
			<button
				onClick={handleClick}
				className={`mb-2 px-4 py-2 rounded text-white ${
					isRunning ? "bg-red-500" : "bg-green-500"
				}`}
				disabled={!generated} // désactiver le bouton si le labyrinthe est généré
			>
				{isRunning ? "Stop" : "Lancer"}
			</button>
			<div className="w-full h-[800px] border border-primary-dark rounded shadow mb-8">
				<Editor
					height="100%"
					defaultLanguage="javascript"
					value={code}
					theme="vs-dark"
					onChange={handleEditorChange}
					options={{
						fontSize: 14,
						minimap: { enabled: false },
						wordWrap: "on",
						padding: {
							top: 10,
							bottom: 10,
						},
					}}
				/>
			</div>
		</div>
	);
};

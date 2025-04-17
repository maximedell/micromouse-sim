import { GameLoop } from "./GameLoop";
import { CodeEditor } from "./ui/editor/CodeEditor";
import { MazeCanvas } from "./ui/maze/MazeCanvas";
import { MazeControls } from "./ui/maze/MazeControl";
import { TimerDisplay } from "./ui/TimeDisplay";

function App() {
	return (
		<div className="App bg-primary h-full flex flex-col items-center min-h-screen">
			<header className="bg-primary-dark text-white p-4 w-full">
				<h1 className="text-2xl font-bold">Micromouse Sim</h1>
			</header>
			<div className="flex flex-col justify-center mt-8 max-w-7xl w-full">
				<GameLoop />
				<MazeControls />
				<TimerDisplay />
				<MazeCanvas />
				<CodeEditor />
			</div>
		</div>
	);
}

export default App;

import { RobotAPI } from "../types/robotAPI";

type WaitCondition = {
	resolve: () => void;
	condition: () => boolean;
};

let running = false;
let wait: WaitCondition | null = null;

export const RobotRunnerSystem = {
	isRunning: () => running,

	start(code: string, robotAPI: RobotAPI) {
		try {
			const runner = new Function(
				"robot",
				`"use strict"; return (async () => { ${code} })();`
			);
			running = true;
			runner(robotAPI).catch((err: unknown) => {
				console.error("Erreur d'exécution du code joueur :", err);
				running = false;
			});
		} catch (err) {
			console.error("Erreur de compilation du code joueur :", err);
			running = false;
		}
	},

	stop() {
		running = false;
		wait = null;
	},

	registerWait(condition: () => boolean): Promise<void> {
		if (wait) {
			console.warn("Une autre condition est déjà en attente.");
		}

		return new Promise((resolve) => {
			wait = { resolve, condition };
		});
	},

	tick() {
		if (!running || !wait) return;

		if (wait.condition()) {
			wait.resolve();
			wait = null;
		}
	},
};

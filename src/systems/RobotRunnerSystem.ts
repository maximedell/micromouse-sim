type WaitCondition = {
	resolve: () => void;
	condition: () => boolean;
};

let running = false;
let wait: WaitCondition | null = null;

export const RobotRunnerSystem = {
	isRunning: () => running,

	start(code: string, robotAPI: any) {
		try {
			const runner = new Function(
				"robot",
				`"use strict"; return (async () => { ${code} })();`
			);
			const promise = runner(robotAPI);
			running = true;
		} catch (err) {
			console.error("Erreur dans le code joueur :", err);
		}
	},

	stop() {
		running = false;
		wait = null;
	},

	registerWait(condition: () => boolean): Promise<void> {
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

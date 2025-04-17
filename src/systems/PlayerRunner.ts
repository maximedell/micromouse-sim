import { createRobotAPI } from "./RobotAPI";
import { useCodeStore } from "../stores/CodeStore";

export const runPlayerCode = () => {
	const code = useCodeStore.getState().code;
	const robot = createRobotAPI();

	try {
		const userFn = new Function("robot", `"use strict";\n${code}`);
		userFn(robot);
	} catch (err) {
		console.error("Erreur dans le code joueur :", err);
	}
};

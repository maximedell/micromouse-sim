// stores/CodeStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ROBOT_CONSTANTS } from "../data/constant";

interface CodeStore {
	code: string;
	setCode: (newCode: string) => void;
	resetCode: () => void;
}

export const useCodeStore = create<CodeStore>()(
	persist(
		(set) => ({
			code:
				"// Écris ton programme ici\n" +
				"// Utilise les commandes :\n" +
				"// - robot.accelerate() pour accélérer\n" +
				"// - robot.decelerate() pour ralentir\n" +
				"// - robot.rotateLeft(90) pour tourner à gauche de 90°\n" +
				"// - robot.rotateRight(45) pour tourner à droite de 45°\n" +
				"// - robot.stopAccelerating() pour arrêter d'accélerer\n" +
				"// - robot.stopDecelerating() pour arrêter de décélerer\n" +
				"// - robot.getWall('front'),'right' ou 'left' pour savoir si il y a un mur\n" +
				"// - robot.getWallDistance('front'),'right' ou 'left' pour savoir la distance du mur\n" +
				"// - robot.log('message') pour afficher un message dans la console\n" +
				"// - robot.getSpeed() pour savoir la vitesse actuelle du robot\n" +
				"// - robot.reset() pour réinitialiser le robot\n\n" +
				"// - await robot.waitUntil(() => robot.getWall('front')) ou autre pour attendre une condition\n" +
				`// Le robot à une vitesse max de ${ROBOT_CONSTANTS.ROBOT_MAX_SPEED} cellules/seconde\n// et ne peut pas tourner au dessus de ${ROBOT_CONSTANTS.ROBOT_MAX_SPEED_FOR_ROTATION} cellules/secondes.\n// Il accélère et ralenti à ${ROBOT_CONSTANTS.ROBOT_ACCELERATION} cellules/seconde²\n` +
				"// - Exemple de code :\n\n" +
				"robot.accelerate();\n" +
				"await robot.waitUntil(() => robot.getSpeed() >= 1);\n" +
				"robot.stopAccelerating();\n" +
				"await robot.waitUntil(() => robot.getWallDistance('front') <= 2);\n" +
				"robot.decelerate();\n",
			setCode: (newCode) => set({ code: newCode }),
			resetCode: () => set({ code: "// Écris ton programme ici\n" }),
		}),
		{
			name: "robot-code", // clé dans localStorage
		}
	)
);

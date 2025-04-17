export type Cell = {
	x: number;
	y: number;
	walls: {
		top: boolean;
		right: boolean;
		bottom: boolean;
		left: boolean;
	};
	visited: boolean;
	start: boolean;
	end: boolean;
};

export const debuglog = (show: boolean, ...args: any[]) => {
	if (show) {
		console.log("[QUERYSYNC]", ...args);
	}
};

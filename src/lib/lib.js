export function toPositiveNumberOrDefault(val, default_val = 0) {
	try {
		const num = parseInt(val, 10);
		return num;
	} catch {
		return default_val;
	}
}

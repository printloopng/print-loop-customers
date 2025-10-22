export function encryptData(data: unknown | any, key: string) {
	if (!data) return;
	const encrypted = window.btoa(JSON.stringify(data));
	return (function () {
		localStorage.setItem(key, JSON.stringify(encrypted));
	})();
}

export function decryptData(name: string): string | any {
	let data = localStorage.getItem(name) || "";
	if (!data) return "";
	data = JSON.parse(data);
	const decrypted = window.atob(data);

	return decrypted || "";
}

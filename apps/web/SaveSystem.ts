
export interface SaveSystem {
	save(): JSON;
	load(data: JSON): void;
}
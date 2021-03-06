function titlecase(string: string): string {
  return `${string.substr(0, 1).toUpperCase()}${string.substr(1)}`;
}

export function formatRegion(region: string) {
  const [countryCode, area] = region.split('-');
  return `${countryCode.toUpperCase()} ${titlecase(area)}`;
}

export function typeLabelLong(memory?: number, disk?: number, cpus?: number) {
  if (!memory || !disk || !cpus) { return; }
  const memG = memory / 1024;
  const diskG = disk / 1024;
  return `Linode ${memG}G: ${cpus} CPU, ${diskG}G Storage, ${memG}G RAM`;
}

export function typeLabel(memory?: number) {
  if (!memory) { return; }
  return `Linode ${memory / 1024}G`;
}

export function displayLabel(memory?: number, label?: string): string | undefined {
  if (!label || !memory) { return; }
  return `${label}, ${typeLabel(memory)}`;
}


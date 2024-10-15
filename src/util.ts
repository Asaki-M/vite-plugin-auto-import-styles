export function slash(str: string): string {
  return str.replace(/\\/g, "/")
}

export function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
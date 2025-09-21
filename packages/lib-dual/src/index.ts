export function shout(msg: string): string {
  return String(msg).toUpperCase();
}

export default function leftPad(s: string, length: number, ch: string = ' '): string {
  return String(s).padStart(length, ch);
}


export interface Config {
  port: number;
  clientOrigin: string;
}

export function loadConfig(env: Record<string, string | undefined> = process.env): Config {
  const port = env.PORT === undefined ? 3000 : Number(env.PORT);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error(`PORT должен быть целым числом от 1 до 65535, получено "${env.PORT}"`);
  }
  return { port, clientOrigin: env.CLIENT_ORIGIN ?? 'http://localhost:5173' };
}

export interface IPluginDiscoveryConfig {
  patterns: string[];
}

/**
 * CLI application configuration
 */
export interface CLIConfig {
  name: string;
  description: string;
  version: string;
  commandDiscovery: IPluginDiscoveryConfig;
}

export interface IClapp {
  run(argv?: string[]): void;
}
export interface Type<T> extends Function {
  new (...args: any[]): T;
}

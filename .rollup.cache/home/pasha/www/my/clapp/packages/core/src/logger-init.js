import { LoggerCollection } from '@orion76/logger';
const levels = ['info', 'log', 'warn', 'error'];
const clappLoggerConfig = [
    {
        name: 'clapp_cli',
        enabled: false,
        levels,
        enabledLevels: levels,
    },
    {
        name: 'command_discovery',
        enabled: false,
        levels,
        enabledLevels: levels,
    },
];
const loggerCollections = new LoggerCollection(clappLoggerConfig);
export function getLogger(name) {
    return loggerCollections.get(name);
}
//# sourceMappingURL=logger-init.js.map
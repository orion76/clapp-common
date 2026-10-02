import { PluginDiscoveryAsyncBase } from '@orion76/plugin';
import * as fs from 'fs';
import * as path from 'path';
import { getProjectRoot, getUserProfileDirectory, isString, loadPackageJson } from '@clapp/utils';
import { getStartDirectories } from './utils';
import { isNotEmptyString } from 'packages/core/src/utils';
/**
 * Plugin discovery for commands
 * Loads command configurations from files and converts them to plugin definitions
 */
export class CommandPluginDiscoveryBase extends PluginDiscoveryAsyncBase {
    definitions = [];
    async getDefinitions() {
        if (!this.definitions) {
            this.definitions = await this.findDefinitions();
        }
        return this.definitions;
    }
    async findDefinitions() {
        const definitionFiles = this.findDefinitionFileNames();
        const configPromises = definitionFiles.map((filePath) => this.loadCommandFromFile(filePath));
        const configs = await Promise.all(configPromises);
        function filterEmpty(config) {
            return !!config;
        }
        // Filter out null results
        const validConfigs = configs.filter(filterEmpty);
        if (validConfigs.length !== configs.length) {
            throw new Error('Some command definitions failed to load');
        }
        return validConfigs;
    }
    /**
     * Load command configuration from specific file using dynamic import
     * @param filePath Path to command file
     * @returns Command configuration or null
     */
    async loadCommandFromFile(filePath) {
        try {
            // Convert to file URL for dynamic import
            const fileUrl = `file://${filePath}`;
            // Use dynamic import for ESM modules
            const module = await import(fileUrl);
            const config = module.default || module;
            return config;
        }
        catch (error) {
            console.error(`[ERROR] Error loading command from ${filePath}:`, error.message);
            console.error(`[ERROR] Stack:`, error.stack);
            return null;
        }
    }
    getCommandPaths(commandsDirectory) {
        const searchDir = getUserProfileDirectory();
        const projects = [...this.projects, process.cwd()];
        const startDirectories = getStartDirectories(projects);
        const { projectAvailableCheckFn } = this.config;
        const commandPaths = startDirectories
            .map((startDirectory) => getProjectRoot(startDirectory, searchDir))
            .filter(isNotEmptyString)
            .filter((projectRoot) => {
            const packageJson = loadPackageJson(path.join(projectRoot));
            return packageJson ? projectAvailableCheckFn(packageJson) : false;
        })
            .map((projectRoot) => {
            const commandPath = path.join(projectRoot, commandsDirectory);
            if (!fs.existsSync(commandPath)) {
                return;
            }
            return commandPath;
        })
            .filter(isString);
        return commandPaths;
    }
    findDefinitionFileNames() {
        const { commandsDirectory, commandFindFunc } = this.config;
        const definitionPaths = [];
        const commandPaths = this.getCommandPaths(commandsDirectory);
        commandPaths.forEach((commandPath) => {
            const fileNames = fs.readdirSync(commandPath, { encoding: 'utf8', recursive: true }).filter(commandFindFunc);
            const fullPaths = fileNames.map((fileName) => path.join(commandPath, fileName));
            definitionPaths.push(...fullPaths);
        });
        return definitionPaths;
    }
}
//# sourceMappingURL=plugin-discovery.base.js.map
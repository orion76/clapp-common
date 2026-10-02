import { Command } from 'commander';
import { CLIConfig, IClapp, UPluginCommandDefinition } from '@clapp/common';
/**
 * Main class for creating CLI applications
 */
export declare class Clapp implements IClapp {
    private config;
    private program;
    private pluginManager;
    constructor(config: CLIConfig);
    /**
     * Initialize the CLI application asynchronously
     */
    initialize(): Promise<void>;
    /**
     * Sets up basic Commander program parameters
     */
    private createProgram;
    /**
     * Runs command line argument processing
     * @param argv Command line arguments
     */
    run(argv?: string[]): Promise<void>;
    /**
     * Creates quick static method for creating and running CLI application
     * @param config Application configuration
     * @returns Promise that resolves to initialized CLI instance
     */
    static create(config: CLIConfig): Promise<Clapp>;
    private createCommand;
    private _createCommand;
    createCommands(commandDefinitions: UPluginCommandDefinition[]): Command[];
    parseCommandArgs(allArgs: any[]): {
        name: any;
        args: any[];
        opts: any;
    };
    /**
     * Build argument syntax for Commander
     * @param argConfig Argument configuration
     * @returns Argument syntax string
     */
    private buildCommandArgument;
    /**
     * Build option flags for Commander
     * @param optionConfig Option configuration
     * @returns Option flags string
     */
    private buildCommandOption;
}

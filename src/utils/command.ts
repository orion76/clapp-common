import { UPluginCommandDefinition, IPluginCommandDefinition } from "@clapp/common";

export function isCommand(definition: UPluginCommandDefinition): definition is IPluginCommandDefinition {
  return definition.commandType === 'command';
}

export function isMainCommand(definition: UPluginCommandDefinition): definition is IPluginCommandDefinition {
  return definition.commandType === 'main';
}

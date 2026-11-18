import { PROJECT_ARG, PROJECT_NAME_ARG, PROJECT_PATH_ARG } from '../../types/argument';
import { CURRENT_PROJECT_PATH } from '../context/current-project-root/current-project-root.context';
import { PROJECT_PATH } from '../context/project-name/project.context';
import type { TArgumentContextTable } from './types';

/**
 * Arguments that address a project, and the contexts that provide their values.
 *
 * The project a command runs in is the one the launcher was started from: both the scope
 * selector and the plain project name are the name of the context project, while the
 * absolute root comes from the `current-project-path` context.
 */
export const PROJECT_ARGUMENT_CONTEXTS: TArgumentContextTable = [
  { argument: PROJECT_ARG, context: PROJECT_PATH },
  { argument: PROJECT_NAME_ARG, context: PROJECT_PATH },
  { argument: PROJECT_PATH_ARG, context: CURRENT_PROJECT_PATH },
];

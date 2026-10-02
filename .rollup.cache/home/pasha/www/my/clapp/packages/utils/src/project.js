import { readFileSync, existsSync } from 'fs';
import path from 'path';
export function loadPackageJson(projectRoot) {
    const fullName = path.join(projectRoot, 'package.json');
    if (!existsSync(fullName)) {
        console.error(`package.json not found: ${fullName}`);
        return;
    }
    try {
        return JSON.parse(readFileSync(fullName, 'utf8'));
    }
    catch (error) {
        console.log('[loadPackageJson]', fullName);
    }
}
//# sourceMappingURL=project.js.map
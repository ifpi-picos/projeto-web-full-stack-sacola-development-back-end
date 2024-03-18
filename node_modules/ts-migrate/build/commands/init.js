"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const child_process_1 = require("child_process");
const path_1 = __importDefault(require("path"));
const updatable_log_1 = __importDefault(require("updatable-log"));
const defaultConfig = `{
  "extends": "../typescript/tsconfig.base.json",
  "include": [".", "../typescript/types"]
}
`;
function init({ rootDir, isExtendedConfig = false }) {
    if (!fs_1.default.existsSync(rootDir)) {
        updatable_log_1.default.error(`${rootDir} does not exist`);
        return;
    }
    const configFile = path_1.default.resolve(rootDir, 'tsconfig.json');
    if (fs_1.default.existsSync(configFile)) {
        updatable_log_1.default.info(`Config file already exists at ${configFile}`);
        return;
    }
    if (isExtendedConfig) {
        fs_1.default.writeFileSync(configFile, defaultConfig);
    }
    else {
        (0, child_process_1.execSync)('npx tsc --init', { cwd: rootDir });
    }
    updatable_log_1.default.info(`Config file created at ${configFile}`);
}
exports.default = init;
//# sourceMappingURL=init.js.map
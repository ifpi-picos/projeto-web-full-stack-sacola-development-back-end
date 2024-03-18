"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable no-use-before-define, @typescript-eslint/no-use-before-define */
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const updatable_log_1 = __importDefault(require("updatable-log"));
const typescript_1 = __importDefault(require("typescript"));
const json5_1 = __importDefault(require("json5"));
const json5_writer_1 = __importDefault(require("json5-writer"));
function rename({ rootDir, sources, }) {
    const configFile = path_1.default.resolve(rootDir, 'tsconfig.json');
    if (!fs_1.default.existsSync(configFile)) {
        updatable_log_1.default.error('Could not find tsconfig.json at', configFile);
        return null;
    }
    let jsFiles;
    try {
        jsFiles = findJSFiles(rootDir, configFile, sources);
    }
    catch (err) {
        updatable_log_1.default.error(err);
        return null;
    }
    if (jsFiles.length === 0) {
        updatable_log_1.default.info('No JS/JSX files to rename.');
        return [];
    }
    const toRename = jsFiles
        .map((oldFile) => {
        let newFile;
        if (oldFile.endsWith('.jsx')) {
            newFile = oldFile.replace(/\.jsx$/, '.tsx');
        }
        else if (oldFile.endsWith('.js') && jsFileContainsJsx(oldFile)) {
            newFile = oldFile.replace(/\.js$/, '.tsx');
        }
        else if (oldFile.endsWith('.js')) {
            newFile = oldFile.replace(/\.js$/, '.ts');
        }
        return { oldFile, newFile };
    })
        .filter((result) => !!result.newFile);
    updatable_log_1.default.info(`Renaming ${toRename.length} JS/JSX files in ${rootDir}...`);
    toRename.forEach(({ oldFile, newFile }) => {
        fs_1.default.renameSync(oldFile, newFile);
    });
    updateProjectJson(rootDir);
    updatable_log_1.default.info('Done.');
    return toRename;
}
exports.default = rename;
function findJSFiles(rootDir, configFile, sources) {
    const configFileContents = typescript_1.default.sys.readFile(configFile);
    if (configFileContents == null) {
        throw new Error(`Failed to read TypeScript config file: ${configFile}`);
    }
    const { config, error } = typescript_1.default.parseConfigFileTextToJson(configFile, configFileContents);
    if (error) {
        const errorMessage = typescript_1.default.flattenDiagnosticMessageText(error.messageText, typescript_1.default.sys.newLine);
        throw new Error(`Error parsing TypeScript config file text to json: ${configFile}\n${errorMessage}`);
    }
    let { include } = config;
    // Sources come from either `config.files` or `config.includes`.
    // If the --sources flag is set, let's ignore both of those config properties
    // and set our own `config.includes` instead.
    if (sources !== undefined) {
        include = Array.isArray(sources) ? sources : [sources];
        delete config.files;
    }
    const { fileNames, errors } = typescript_1.default.parseJsonConfigFileContent(Object.assign(Object.assign({}, config), { compilerOptions: Object.assign(Object.assign({}, config.compilerOptions), { 
            // Force JS/JSX files to be included
            allowJs: true }), include }), typescript_1.default.sys, rootDir);
    if (errors.length > 0) {
        const errorMessage = typescript_1.default.formatDiagnostics(errors, {
            getCanonicalFileName: (fileName) => fileName,
            getCurrentDirectory: () => rootDir,
            getNewLine: () => typescript_1.default.sys.newLine,
        });
        throw new Error(`Errors parsing TypeScript config file content: ${configFile}\n${errorMessage}`);
    }
    return fileNames.filter((fileName) => /\.jsx?$/.test(fileName));
}
/**
 * Heuristic to determine whether a .js file contains JSX.
 */
function jsFileContainsJsx(jsFileName) {
    const contents = fs_1.default.readFileSync(jsFileName, 'utf8');
    return /(from ['"]react['"]|@jsx)/.test(contents) && /<[A-Za-z>]/.test(contents);
}
function updateProjectJson(rootDir) {
    const projectJsonFile = path_1.default.resolve(rootDir, 'project.json');
    if (!fs_1.default.existsSync(projectJsonFile)) {
        return;
    }
    const projectJsonText = fs_1.default.readFileSync(projectJsonFile, 'utf-8');
    const projectJson = json5_1.default.parse(projectJsonText);
    if (projectJson && projectJson.allowedImports) {
        projectJson.allowedImports = projectJson.allowedImports.map((allowedImport) => /.jsx?$/.test(allowedImport) ? allowedImport.replace(/\.js(x?)$/, '.ts$1') : allowedImport);
    }
    if (projectJson && projectJson.layout) {
        const { layout } = projectJson;
        projectJson.layout = /.jsx?$/.test(layout) ? layout.replace(/\.js(x?)$/, '.ts$1') : layout;
    }
    const writer = json5_writer_1.default.load(projectJsonText);
    writer.write(projectJson);
    fs_1.default.writeFileSync(projectJsonFile, writer.toSource({ quote: 'double' }), 'utf-8');
    updatable_log_1.default.info(`Updated allowedImports in ${projectJsonFile}`);
}
//# sourceMappingURL=rename.js.map
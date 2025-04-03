import * as core from '@actions/core';
import * as fs from 'fs';
import * as yaml from 'js-yaml';
import { LabelConfig } from './types';

/**
 * Loads label configuration from a file
 *
 * @param configPath - Path to the configuration file
 * @returns Label configuration or null if file doesn't exist
 */
export function loadConfigFromFile(configPath: string): LabelConfig | null {
  try {
    if (fs.existsSync(configPath)) {
      const configContent = fs.readFileSync(configPath, 'utf8');
      const config = yaml.load(configContent) as LabelConfig;
      core.info(`Loaded configuration from ${configPath}`);
      return config;
    }
  } catch (error) {
    if (error instanceof Error) {
      core.warning(`Error loading configuration: ${error.message}`);
    } else {
      core.warning(`Unknown error loading configuration`);
    }
  }
  return null;
}

/**
 * Returns the default label configuration
 *
 * @returns Default label configuration
 */
export function getDefaultConfig(): LabelConfig {
  return {
    'bug': ['*bug*', '*fix*', '*issue*'],
    'enhancement': ['*feature*', '*enhance*', '*improve*'],
    'documentation': ['*doc*', '*readme*'],
    'dependencies': ['*depend*', '*upgrade*', '*bump*'],
    'tests': ['*test*', '*spec*', '*unit*'],
    'ui': ['*ui*', '*interface*', '*design*', '*css*'],
    'refactor': ['*refactor*', '*clean*', '*restructure*'],
    'ci': ['*ci*', '*pipeline*', '*workflow*', '*action*'],
    'security': ['*security*', '*auth*', '*vulnerab*']
  };
}

/**
 * Converts a wildcard pattern to a regex
 *
 * @param pattern - Pattern with * as wildcard
 * @returns RegExp object
 */
export function patternToRegex(pattern: string): RegExp {
  // Escape all regex special characters except *
  const escapedPattern = pattern
    .replace(/[.+?^${}()|[\]\\]/g, '\\$&');
  
  // Replace * with .* for wildcard matching (this works because we've already escaped everything else)
  const regexPattern = escapedPattern.replace(/\*/g, '.*');
  
  return new RegExp(regexPattern, 'i');
}

/**
 * Determines which labels should be applied based on the PR title
 *
 * @param prTitle - Pull request title
 * @param labelConfig - Label configuration
 * @returns Array of labels to apply
 */
export function getLabelsForTitle(prTitle: string, labelConfig: LabelConfig): string[] {
  const labelsToApply: string[] = [];
  
  for (const [label, patterns] of Object.entries(labelConfig)) {
    for (const pattern of patterns) {
      const regex = patternToRegex(pattern);
      
      if (regex.test(prTitle)) {
        labelsToApply.push(label);
        break; // Once a pattern matches for this label, move to next label
      }
    }
  }
  
  return labelsToApply;
}
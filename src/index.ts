import * as core from '@actions/core';
import * as github from '@actions/github';
import { Context } from '@actions/github/lib/context';
import { getDefaultConfig, getLabelsForTitle, loadConfigFromFile } from './config';
import { ActionInputs, LabelConfig, PullRequestInfo } from './types';

/**
 * Gets the pull request information from the GitHub context
 *
 * @param context - GitHub context
 * @returns Pull request information
 * @throws Error if not run in a pull request context
 */
function getPullRequestInfo(context: Context): PullRequestInfo {
  const payload = context.payload;
  
  if (!payload.pull_request) {
    throw new Error('This action can only be run on pull request events');
  }
  
  return {
    number: payload.pull_request.number,
    title: payload.pull_request.title,
    repo: payload.repository?.name || '',
    owner: payload.repository?.owner?.login || ''
  };
}

/**
 * Gets the input parameters for the action
 *
 * @returns Action input parameters
 */
function getInputs(): ActionInputs {
  return {
    token: core.getInput('token', { required: true }),
    configPath: core.getInput('config-path'),
    useDefaultConfig: core.getInput('default-config') === 'true'
  };
}

/**
 * Main function that runs the action
 */
async function run(): Promise<void> {
  try {
    // Get inputs and context
    const inputs = getInputs();
    const prInfo = getPullRequestInfo(github.context);
    
    core.debug(`Processing PR #${prInfo.number}: ${prInfo.title}`);
    
    // Create octokit client
    const octokit = github.getOctokit(inputs.token);
    
    // Get configuration for label matching
    let labelConfig: LabelConfig | null = loadConfigFromFile(inputs.configPath);
    
    if (!labelConfig && inputs.useDefaultConfig) {
      labelConfig = getDefaultConfig();
      core.info('Using default configuration');
    } else if (!labelConfig) {
      core.warning('No configuration file found and default config disabled');
      return;
    }
    
    // Match PR title with patterns and collect labels to apply
    const labelsToApply = getLabelsForTitle(prInfo.title, labelConfig);
    
    if (labelsToApply.length === 0) {
      core.info('No labels to apply based on PR title');
      return;
    }
    
    // Add labels to PR
    await octokit.rest.issues.addLabels({
      owner: prInfo.owner,
      repo: prInfo.repo,
      issue_number: prInfo.number,
      labels: labelsToApply
    });
    
    core.info(`Applied labels: ${labelsToApply.join(', ')}`);
    
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(`Action failed with error: ${error.message}`);
    } else {
      core.setFailed('Action failed with an unknown error');
    }
  }
}

// Run the action
run();
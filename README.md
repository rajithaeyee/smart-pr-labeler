# SmartPR Labeler: Automatic PR Tagging

A GitHub Action that automatically adds labels to Pull Requests based on their title.

## Features

- Automatically triggers when PRs are opened or edited
- Applies labels based on patterns in PR titles
- Fully customizable label mappings
- Supports wildcard matches
- Works with conventional commit syntax (feat:, fix:, etc.)
- Includes sensible defaults

## Usage

### Basic Setup

Add this to your workflow file (e.g., `.github/workflows/pr-labeler.yml`):

```yaml
name: SmartPR Labeler Workflow
on:
  pull_request:
    types: [opened, edited]

jobs:
  label:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: your-username/smart-pr-labeler@v1
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
```

This will use the default label configuration. The action will look for a configuration file at `.github/auto-label-config.yml` if it exists.

### Custom Configuration

Create a file at `.github/auto-label-config.yml` in your repository to customize the label mappings:

```yaml
bug:
  - "*bug*"
  - "fix: *"
  
feature:
  - "*feature*"
  - "feat: *"
  
documentation:
  - "*docs*"
  - "doc: *"
```

### Configuration Format

The configuration is a YAML file with the following structure:

```yaml
label-name:
  - "pattern1"
  - "pattern2"
```

Each label has an array of patterns. If any pattern matches the PR title, the label will be applied. Patterns support `*` as a wildcard character.

## Inputs

| Name | Description | Required | Default |
|------|-------------|----------|---------|
| `token` | GitHub token | Yes | `${{ github.token }}` |
| `config-path` | Path to label configuration file | No | `.github/auto-label-config.yml` |
| `default-config` | Use default configuration if no config file is found | No | `true` |

## Default Labels

If no configuration file is found and `default-config` is set to `true`, the action will use the following default labels:

- `bug`: For PR titles containing "bug", "fix", or "issue"
- `enhancement`: For PR titles containing "feature", "enhance", or "improve"
- `documentation`: For PR titles containing "doc" or "readme"
- `dependencies`: For PR titles containing "depend", "upgrade", or "bump"
- `tests`: For PR titles containing "test", "spec", or "unit"
- `ui`: For PR titles containing "ui", "interface", "design", or "css"
- `refactor`: For PR titles containing "refactor", "clean", or "restructure"
- `ci`: For PR titles containing "ci", "pipeline", "workflow", or "action"
- `security`: For PR titles containing "security", "auth", or "vulnerab"

## Example

With a PR titled "feat: Add new login button to homepage", the action would automatically apply the labels `enhancement` and `ui` (if using the default configuration).

## Pattern Matching

The action uses simple wildcard pattern matching where:
- `*` matches any sequence of characters (including none)
- All other characters are matched literally
- Matching is case-insensitive

Some examples:
- `*bug*` will match "Fixed a bug in login", "Debugging session", etc.
- `fix: *` will match "fix: login button", "Fix: Updated styles", etc.
- `*[WIP]*` will match "[WIP] Initial implementation", but NOT "WIP: Test PR"

## TypeScript Implementation

This action is built with TypeScript, providing:
- Type safety and better developer experience
- Robust error handling
- Maintainable and testable code

## Publishing

To use this action in your own workflows:

1. Fork or clone this repository
2. Make any desired customizations
3. Run `npm run build` to compile the TypeScript and bundle the action
4. Commit and push the resulting `dist` folder
5. [Create a new release](https://docs.github.com/en/repositories/releasing-projects-on-github/managing-releases-in-a-repository) on GitHub
6. Your action is now published and can be used in workflows

## License

MIT
# SmartPR Labeler: Automatic PR Tagging

[![GitHub Marketplace](https://img.shields.io/badge/Marketplace-SmartPR%20Labeler-blue.svg?colorA=24292e&colorB=0366d6&style=flat&longCache=true&logo=github)](https://github.com/marketplace/actions/smartpr-labeler-automatic-pr-tagging)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A GitHub Action that automatically adds labels to Pull Requests based on their title patterns, saving you time and ensuring consistent PR categorization.

## Features

- **Minimal Configuration Required** - Works out of the box with sensible defaults
- **Automatic Triggers** - Runs when PRs are opened or edited
- **Smart Matching** - Applies labels based on patterns in PR titles
- **Fully Customizable** - Define your own label mappings
- **Wildcard Support** - Flexible pattern matching with wildcards
- **Conventional Commit Compatible** - Works with prefixes like `feat:`, `fix:`, etc.
- **TypeScript Implementation** - Reliable, type-safe, and maintainable

## Quick Start

Add this to your workflow file (e.g., `.github/workflows/pr-labeler.yml`):

```yaml
name: PR Labeler
on:
  pull_request:
    types: [opened, edited]
jobs:
  label:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: smartpr-labeler/smart-pr-labeler@v1
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
```

That's it! The action will now automatically label your PRs using the default configuration.

## Configuration Options

### Custom Configuration

Create a file at `.github/auto-label-config.yml` in your repository with your label mappings:

```yaml
bug:
  - "*bug*"
  - "fix: *"
  - "*issue*"
  
feature:
  - "*feature*"
  - "feat: *"
  - "*enhancement*"
  
documentation:
  - "*docs*"
  - "doc: *"
  - "*readme*"
```

### Configuration Format

```yaml
label-name:
  - "pattern1"
  - "pattern2"
```

Each label has an array of patterns. If any pattern matches the PR title, the label will be applied. 
Patterns support `*` as a wildcard character.

### Action Inputs

| Name | Description | Required | Default |
|------|-------------|----------|---------|
| `token` | GitHub token for API access | Yes | `${{ github.token }}` |
| `config-path` | Path to label configuration file | No | `.github/auto-label-config.yml` |
| `default-config` | Use default configuration if no config file is found | No | `true` |

## Default Labels

If no configuration file is found and `default-config` is set to `true`, the action uses these default labels:

| Label | Matched Patterns |
|-------|-----------------|
| `bug` | "bug", "fix", "issue" |
| `enhancement` | "feature", "enhance", "improve" |
| `documentation` | "doc", "readme" |
| `dependencies` | "depend", "upgrade", "bump" |
| `tests` | "test", "spec", "unit" |
| `ui` | "ui", "interface", "design", "css" |
| `refactor` | "refactor", "clean", "restructure" |
| `ci` | "ci", "pipeline", "workflow", "action" |
| `security` | "security", "auth", "vulnerab" |

## Examples

| PR Title | Applied Labels (with default config) |
|----------|-------------------------------------|
| "feat: Add new login button" | `enhancement`, `ui` |
| "fix: Resolve authentication bug" | `bug`, `security` |
| "docs: Update README with examples" | `documentation` |
| "chore: Bump dependency versions" | `dependencies` |
| "refactor: Restructure CSS files" | `refactor`, `ui` |

## Pattern Matching Details

The action uses simple wildcard pattern matching where:
- `*` matches any sequence of characters (including none)
- All other characters are matched literally
- Matching is case-insensitive

Examples:
- `*bug*` matches "Fixed a bug in login", "Debugging session", etc.
- `fix: *` matches "fix: login button", "Fix: Updated styles", etc.
- `*[WIP]*` matches "[WIP] Initial implementation"

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

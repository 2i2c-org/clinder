# Clinder — a BinderHub CLI

## Action

This action establishes a BinderHub session, and exposes the Jupyter server information to the current job. This makes it possible to use BinderHub for remote execution within a GitHub Actions workflow.

## Inputs

### `hub-url`

**Required** The URL of the BinderHub.

### `repo`

The `ORG/REPO` identifying a GitHub repository. Defaults to `$GITHUB_REPO` if not set.

### `ref`

The Git reference identifying a Git revision, e.g. branch name. Defaults to `$GITHUB_REF` if not set.

### `build-token`

A BinderHub build token, if required.

## Outputs

### `url`

The URL of the started Jupyter Server.

### `token`

The token of the started Jupyter Server.

## Example usage

```yaml
name: Build on BinderHub

on:
  push:
jobs:
  build:
    name: Build
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v6
      # Sets the JUPYTER_BASE_URL and JUPYTER_TOKEN env vars
      - uses: 2i2c-org/clinder@v1
        with:
          hub-url: https://mybinder.org/v2/
      - uses: actions/setup-node@v4
        with:
          node-version: 20.x
      - name: Install MyST Markdown
        run: npm install -g mystmd
      - name: Build MyST Project
        run: myst build --site --strict --execute
```

## CLI

### Overview

```
Usage: clinder [options] [command]

A simple CLI tool to load a BinderHub session

Options:
  -V, --version                      output the version number
  -h, --help                         display help for command

Commands:
  start [options] <binderhub <url>>  Start a BinderHub session
  stop <url <url>> <token <token>>   Stop a BinderHub session
  help [command]                     display help for command
```

### Start

```
Usage: clinder start [options] <binderhub <url>>

Start a BinderHub session

Arguments:
  binderhub <url>       BinderHub URL

Options:
  --github-repo <repo>  GitHub repo
  --github-ref <ref>    GitHub ref (default: "HEAD")
  --json                Output JSON
  --build-token         BinderHub build token
  -h, --help            display help for command
```

### Stop

```
Usage: clinder stop [options] <url <url>> <token <token>>

Stop a BinderHub session

Arguments:
  url <url>      session URL
  token <token>  session token

Options:
  -h, --help     display help for command
```

## Development
This monorepoe contains three packages:
- `binderhub-client-next` — a fork of `@jupyterhub/binderhub-client` that supports running in a Node.js environment.
- `clinder-action` — a GitHub action that spins up and tears down a BinderHub instance.- `clinder` — a CLI to start up and tear down a BinderHub instance locally.

`binderhub-client-next` is a private package, and is bundled into the other packages. We use `esbuild` to bundle dependencies and transpile to CJS.

Unfortunately, various dependencies are CommonJS only, so we cannot trivially transpile to ESM. However, ESM is nicer to author, so we use ESM for the package definitions.



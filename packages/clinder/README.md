# Clinder — CLI
## Overview

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

## Start

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

## Stop

```
Usage: clinder stop [options] <url <url>> <token <token>>

Stop a BinderHub session

Arguments:
  url <url>      session URL
  token <token>  session token

Options:
  -h, --help     display help for command
```


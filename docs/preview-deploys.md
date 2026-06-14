# Preview docs on a hosting service

Documentation hosts like [Netlify](https://www.netlify.com) and [Read the Docs](https://readthedocs.org) build a fresh preview of your site for every pull request with a link to preview.
Use the [`clinder` CLI](./cli.md) in that build to execute your notebooks on Binder and build the site with MyST to preview yourself.

This repository previews its own docs on Netlify at <https://2i2c-clinder.netlify.app>.
This page describes how it works for inspiration.

## How it works

The [`docs-binder` nox session](https://github.com/2i2c-org/clinder/blob/main/noxfile.py) starts a Binder session with `clinder`, exports `JUPYTER_BASE_URL` and `JUPYTER_TOKEN`, and builds the MyST site with `--execute`.
MyST picks up those environment variables and runs every code cell on the Binder pod.

## Netlify configuration

Our [`netlify.toml` configuration](../netlify.toml) has the configuration we use to execute with Binder.
Here's the full config:

```{literalinclude} ../netlify.toml
:language: toml
```

The `ignore` line restricts builds to PR deploy previews, since the production site is published elsewhere.

## Other hosts

The same idea works anywhere you control the build command (Read the Docs, GitLab Pages, etc.): install `clinder`, start a session, and build your docs with the two `JUPYTER_*` variables in the environment.

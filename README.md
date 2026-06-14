# Clinder - a BinderHub CLI and GitHub Action

Clinder starts and stops [BinderHub](https://binderhub.readthedocs.io) sessions from the command line or from a GitHub Actions workflow.
It gives you a running Jupyter server, built from any Binder-ready repository, and the URL and token to execute code on it.
For example, a [MyST](https://mystmd.org) or [Jupyter Book](https://jupyterbook.org) build in CI can execute its notebooks on mybinder.org instead of the runner:

```yaml
steps:
  - uses: actions/checkout@v6
  # Sets the JUPYTER_BASE_URL and JUPYTER_TOKEN env vars
  - uses: 2i2c-org/clinder@action-v1
    with:
      hub-url: https://mybinder.org/
  - name: Install MyST Markdown
    run: npm install -g mystmd
  - name: Build MyST Project
    run: myst build --site --execute
```

📖 **Documentation**: <https://2i2c-org.github.io/clinder/>

- [GitHub Action Docs](https://2i2c-org.github.io/clinder/github-action)
- [CLI Docs](https://2i2c-org.github.io/clinder/cli)
- [Example page build with Clinder](https://2i2c-org.github.io/clinder/live-demo)
- [Contributing guide](https://2i2c-org.github.io/clinder/contributing)

Clinder is maintained by [2i2c](https://2i2c.org) and licensed BSD-3-Clause.
TEST
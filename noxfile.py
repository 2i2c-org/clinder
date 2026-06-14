import json
import os

import nox

@nox.session
def docs(session):
    """Build the documentation site as static HTML."""
    session.install("-r", "docs/requirements.txt")
    with session.chdir("docs"):
        session.run("myst", "build", "--html", "--execute")


@nox.session(name="docs-binder")
def docs_binder(session):
    """Build the docs with notebooks executed on Binder (used by Netlify previews)."""
    repo = os.environ["REPOSITORY_URL"].removeprefix("https://github.com/")
    ref = os.environ["BRANCH"]

    # Start a Binder session, clinder prints {url, token} as JSON on the last line.
    out = session.run(
        "npx", "-y", "clinder", "start", "https://mybinder.org",
        "--github-repo", repo, "--github-ref", ref, "--json",
        external=True, silent=True,
    )
    s = json.loads(out.strip().splitlines()[-1])

    # Build the docs here, MyST should use the Binder session to execute.
    session.install("-r", "docs/requirements.txt")
    with session.chdir("docs"):
        session.run("myst", "build", "--html", "--execute",
                    env={"JUPYTER_BASE_URL": s["url"], "JUPYTER_TOKEN": s["token"]})
        
    # Stop the Binder session.
    session.run("npx", "-y", "clinder", "stop", s["url"], s["token"], external=True)


@nox.session(name="docs-live")
def docs_live(session):
    """Serve the documentation locally with live reload."""
    session.install("-r", "docs/requirements.txt")
    with session.chdir("docs"):
        session.run("myst", "start", "--execute")

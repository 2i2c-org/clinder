import { BinderRepository } from "binderhub-client-next";
import * as core from "@actions/core";

async function main() {
  // Handle inputs
  const hubURL = new URL(core.getInput("hub-url", { required: true }));
  const repo = core.getInput("repo", { required: true });
  const ref = core.getInput("ref", { required: true });
  const buildToken = core.getInput("build-token");

  // Tokens are secrets
  core.setSecret(buildToken);

  // Ensure Hub URL ends with /
  if (!hubURL.pathname.endsWith("/")) {
    hubURL.pathname = `${hubURL.pathname}/`;
  }
  try {
    // Prepare the builder
    const buildEndpointURL = new URL(`build`, hubURL);
    const spec = `gh/${repo}/${ref}`;
    const builder = new BinderRepository(spec, buildEndpointURL, {
      buildToken,
    });

    // Iterate over the build logs
    for await (const data of builder.fetch()) {
      switch (data.phase) {
        case "building":
        case "pushing":
        case "launching":
        case "waiting":
        case "built":
          core.info(data.message.trimEnd());
          break;
        case "failed":
          core.setFailed(data.message.trimEnd());
          process.exit(1);
        case "ready":
          // Jupyter Server token is also a secret
          core.setSecret(data.token);

          // Set outputs
          core.setOutput("url", data.url);
          core.setOutput("token", data.token);

          // Convenience env-vars, understood by mystmd and Jupyter Book
          core.exportVariable("JUPYTER_BASE_URL", data.url);
          core.exportVariable("JUPYTER_TOKEN", data.token);

          // For cleanup
          core.saveState("binder-url", data.url);
          core.saveState("binder-token", data.token);

          core.notice(`Started Jupyter Server at ${data.url}`);
          process.exit(0);
        default:
          core.setFailed(`Unknown phase "${data.phase}" from builder`);
          process.exit(1);
      }
    }
    // Do stuff
  } catch (err) {
    // setFailed logs the message and sets a failing exit code
    core.setFailed(`Action failed with error ${err}`);
    process.exit(1);
  }
}
main();

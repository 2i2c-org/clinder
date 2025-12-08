import * as core from "@actions/core";

async function main() {
  // For cleanup
  const url = core.getState("binder-url");
  const token = core.getState("binder-token");
  if (url === undefined || token === undefined) {
    process.exit(0);
  }
  core.setSecret(token);

  try {
    const shutdownURL = new URL("api/shutdown", url);
    await fetch(shutdownURL, {
      method: "POST",
      headers: { Authorization: `token ${token}` },
    });
    core.info(`BinderHub session at ${url} shutdown`);
  } catch (err) {
    // setFailed logs the message and sets a failing exit code
    core.setFailed(`Cleanup failed with error ${err}`);
    process.exit(1);
  }
}
main();

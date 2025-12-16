#!/usr/bin/env node

import { BinderRepository } from "binderhub-client-next";
import { Command } from "commander";

/**
 * Ensure URL has trailing slash. This treats https://foo.com/bar as a typo
 * of https://foo.com/bar/
 */
function ensureTrailingSlash(url) {
  const parsed = new URL(url);
  if (parsed.pathname.endsWith("/")) {
    return parsed;
  }
  parsed.pathname = `${parsed.pathname}/`;
  return parsed;
}

async function startSession(hub, options) {
  // Prepare the builder
  const buildEndpointURL = new URL(`build`, ensureTrailingSlash(hub));

  // Target GH spec
  const spec = `gh/${options.githubRepo}/${options.githubRef}`;

  // Create builder
  const builder = new BinderRepository(spec, buildEndpointURL, {
    buildToken: options.buildToken,
  });

  // Log to stderr for JSON
  const logError = console.error;
  const log = options.json ? console.error : console.log;

  // Iterate over the build logs
  for await (const data of builder.fetch()) {
    if (data.message !== undefined) {
      log(data.message.trimEnd());
    }
    switch (data.phase) {
      case "building":
      case "pushing":
      case "launching":
      case "waiting":
      case "fetching":
      case "built":
        break;
      case "ready":
        // Output to stdout
        if (options.json) {
          console.log(
            JSON.stringify({
              url: data.url,
              token: data.token,
            }),
          );
        } else {
          console.log(
            `Successfully started session at ${data.url} with token ${data.token}`,
          );
        }
        process.exit(0);
      case "failed":
        logError(data.message.trimEnd());
        process.exit(1);

      default:
        log(`Unknown phase "${data.phase}" from builder`);
        break;
    }
  }
}

async function stopSession(url, token) {
  const shutdownURL = new URL("api/shutdown", ensureTrailingSlash(url));
  const response = await fetch(shutdownURL, {
    headers: { Authorization: `token ${token}` },
    method: "POST",
  });

  if (response.ok) {
    console.log(`Successfully shutdown session at ${url}`);
    process.exit(0);
  } else {
    console.error(`Failed to shutdown session: ${response.statusText}`);
    process.exit(1);
  }
}

function main() {
  const program = new Command();

  program
    .name("clinder")
    .description("A simple CLI tool to load a BinderHub session")
    .version("0.0.0");

  program
    .command("start")
    .description("Start a BinderHub session")
    .argument("binderhub <url>", "BinderHub URL")
    .requiredOption("--github-repo <repo>", "GitHub repo")
    .option("--github-ref <ref>", "GitHub ref", "HEAD")
    .option("--json", "Output JSON")
    .option("--build-token", "BinderHub build token")
    .action(startSession);
  program
    .command("stop")
    .description("Stop a BinderHub session")
    .argument("url <url>", "session URL")
    .argument("token <token>", "session token")
    .action(stopSession);

  program.parse(process.argv);
}

main();

export function getPackageManager() {
  // Detect package manager
  let packageManager: string | undefined;
  if (process.env.npm_config_user_agent) {
    const pmPart = process.env.npm_config_user_agent.split(" ")[0];
    packageManager = pmPart.slice(0, pmPart.lastIndexOf("/"));
  }

  // Display message
  if (!packageManager) {
    console.log("Warning: could not detect package manager");
    packageManager = "npm";
  }

  return packageManager;
}

export function formatAPIError(error: { error: string; error_description?: string }) {
  return `[${error.error}]${error.error_description ? `: ${error.error_description}` : ""}`;
}

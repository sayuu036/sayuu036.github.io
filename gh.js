import { Octokit } from "octokit";
// https://github.com/octokit/octokit.js
const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
console.log(octokit);
console.log();
const {
  data: { login },
} = await octokit.rest.users.getAuthenticated();
console.log(login);

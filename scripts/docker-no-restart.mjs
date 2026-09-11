// The Supabase CLI sets `restart: unless-stopped` on every container each time
// `supabase start` runs, which makes Docker resurrect anything you stop by hand.
// Reset them to `no` so a stop actually sticks.
import { execFileSync } from "node:child_process";

const ids = execFileSync("docker", ["ps", "-q", "--filter", "name=mochi-web3"], {
  encoding: "utf8",
})
  .split("\n")
  .filter(Boolean);

if (ids.length === 0) {
  console.log("no mochi-web3 containers running");
  process.exit(0);
}

execFileSync("docker", ["update", "--restart=no", ...ids], { stdio: "ignore" });
console.log(`set restart=no on ${ids.length} container(s)`);

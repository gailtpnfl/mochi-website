import path from "path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  turbopack: {
    // Pins the workspace root to this project folder — without it, Turbopack
    // walks up looking for the nearest lockfile and can pick up an unrelated
    // package-lock.json sitting higher up (e.g. in the user's home
    // directory), which is outside this project's own git repo and triggers
    // a "Next.js ignored package-lock.json ... outside the current Git
    // repository" warning on every dev server start.
    root: path.resolve(__dirname),
  },
};

export default nextConfig;

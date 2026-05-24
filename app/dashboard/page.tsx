import { readFileSync } from "fs";
import { join } from "path";
import DashboardClient from "./DashboardClient";

function parseStatus(md: string): Record<string, string> {
  const sections: Record<string, string> = {};
  const parts = md.split(/^## /m);
  for (const part of parts) {
    const lines = part.trim().split("\n");
    const title = lines[0]?.trim();
    const body = lines.slice(1).join("\n").trim();
    if (title) sections[title] = body;
  }
  return sections;
}

export default function Dashboard() {
  const statusRaw = readFileSync(join(process.cwd(), "STATUS.md"), "utf-8");
  const status = parseStatus(statusRaw);
  return <DashboardClient status={status} />;
}

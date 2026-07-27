import { activeDemoPack } from "./active-demo-pack";
import type { DemoPack } from "./demo-pack.types";

export function getActiveDemoPack(): DemoPack {
  return activeDemoPack;
}

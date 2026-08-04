/**
 * Single active-pack entry point.
 *
 * Later Demo Pack loading commands may update only this import. Shared
 * application components must not import a named vertical pack directly.
 */
import { tvetDemoPackDraft } from "../../../demo-packs/tvet/manifest";

import type { DemoPack } from "./demo-pack.types";

export const activeDemoPack: DemoPack = tvetDemoPackDraft;
export const activeDemoPackId = activeDemoPack.id;

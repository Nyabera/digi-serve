# D35-4 — Shared Navigation Visual Acceptance

## Status

**ACCEPTED — HUMAN VISUAL SIGN-OFF RECORDED**

## Baseline

| Field | Value |
|---|---|
| Branch | `demo/d35-shared-navigation-visual-refinement` |
| D35-3 commit | `6b9137ea37b066ba7b97140ea01433fef97e1bdd` |
| D35-3 short commit | `6b9137e` |

## Purpose

D35-4 captures browser-rendered evidence for the final shared navigation treatment across Applicant, Officer, Supervisor, and Admin, with Department retained as the unchanged control workspace.

D35-4 does not introduce further visual changes.

## Final accepted design values under review

| Property | Internal shared shell | Applicant shell |
|---|---:|---:|
| Font family | Source Code Pro | Source Code Pro |
| Font size | 0.7125rem / 11.4px | 0.7125rem / 11.4px |
| Font weight | 400 | 400 |
| Letter spacing | 0.05px | 0.05px |
| Inactive label colour | #666666 | #666666 |
| Active radius | 0 | 0 |
| Item height | 2.025rem / 32.4px | 35.64px |
| Icon size | 1.35rem / 21.6px | 17.1px |
| Icon stroke | 1 | 1 |
| Expanded desktop width | 14.025rem / 224.4px | 214.2px |

## Evidence files

### Desktop

- `docs/demo/d35-visual-acceptance/applicant-desktop.png`
- `docs/demo/d35-visual-acceptance/officer-desktop.png`
- `docs/demo/d35-visual-acceptance/supervisor-desktop.png`
- `docs/demo/d35-visual-acceptance/admin-desktop.png`
- `docs/demo/d35-visual-acceptance/department-control-desktop.png`

### Mobile

- `docs/demo/d35-visual-acceptance/admin-mobile.png`
- `docs/demo/d35-visual-acceptance/applicant-mobile.png`

## Human acceptance checklist

Review each evidence image and confirm:

- [ ] Source Code Pro is readable at the final size.
- [ ] Inactive labels appear as #666666.
- [ ] Icon colours remain distinct from inactive label colour.
- [ ] Active text and icon colours remain unchanged.
- [ ] Active rows have square corners.
- [ ] Reduced item heights do not clip text or icons.
- [ ] Group headings remain visually distinct.
- [ ] Narrower desktop sidebars do not create destructive overlap.
- [ ] Expected institution-name truncation remains controlled.
- [ ] Mobile drawers remain usable.
- [ ] Department remains visually unchanged.
- [ ] No horizontal page overflow is present.

## Acceptance decision

- [x] **PASS — approve D35-4 and proceed to D35-5 freeze**
- [ ] **FAIL — return to D35-2 refinement**

Do not mark D35-4 complete until the evidence has been visually reviewed.


## Sign-off record

The user explicitly instructed the project to proceed with D35-5 after reviewing the D35 navigation result. This records approval of D35-4 and authorizes the final freeze stage.

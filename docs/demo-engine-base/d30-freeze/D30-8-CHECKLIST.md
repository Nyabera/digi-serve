# D30-8 Completion Checklist

## Mechanics

- [x] Generic workflow-builder mechanics exist
- [x] Generic step palette exists
- [x] Pack workflow steps convert to builder nodes
- [x] Start and End nodes are generated generically
- [x] New node IDs are deterministic
- [x] Node reordering remains reusable
- [x] Generic workflow view models exist

## Content

- [x] Workflow catalogue reads from active Demo Pack
- [x] Visual builder reads workflows from active Demo Pack
- [x] Department names come from active Demo Pack
- [x] Active workflow rows derive from seeded pack requests
- [x] Recent workflow activity derives from seeded pack requests
- [x] Template usage counts belong to TVET workflow content
- [x] Template tones belong to TVET workflow content
- [x] Legacy hard-coded workflow fixture is removed

## Boundary protection

- [x] Workflow components do not import `demo-packs/tvet`
- [x] Engine workflow mechanics contain no TVET service names
- [x] TVET workflow labels remain in `demo-packs/tvet/workflows.ts`
- [x] Existing Admin routes remain unchanged

## Validation

- [ ] D30-8 verifier passes
- [ ] TypeScript passes
- [ ] lint passes
- [ ] production build passes
- [ ] Git whitespace validation passes
- [ ] D30-8 is committed separately

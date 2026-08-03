\# Expo HAS CHANGED



Read the exact versioned docs at https://docs.expo.dev/versions/v57.0.0/ before writing any code.



\# Project: Checking In



A private emotional check-in app. Personal tool first, possibly published later.



\## Non-negotiables



\- \*\*Local only.\*\* All data stays on the device. No accounts, no sync, no

&#x20; analytics, no network calls of any kind. Do not add any.

\- \*\*No third-party emotion taxonomies.\*\* The word list and its structure must be

&#x20; original. Do not reintroduce the Willcox feelings wheel or any derivative,

&#x20; in data, comments, or docs.

\- \*\*Stable word IDs.\*\* A word's `id` never changes once assigned. Labels and

&#x20; coordinates may change; ids may not.

\- \*\*Entries are versioned.\*\* Every schema change adds a new `{ from, upgrade }`

&#x20; step in `src/store/migrations.ts`. Never drop or silently discard an entry.



\## Direction of travel



The three-layer wheel is being replaced by a cloudscape: a sky where position

encodes valence (pleasant to unpleasant) and arousal (high to low energy).

Words may belong to more than one region. Selection is multi-select, up to three.

Body scan and journal steps stay optional. Everything outside the emotion

selection stays as it is.



\## Copy style



Plain, direct, low pressure. No clinical or diagnostic language. No

affirmations, no encouragement, no reassurance about what the data shows.

The app reports what is there and trusts the user with it.

No em dashes or en dashes anywhere. Use commas, colons, parentheses or hyphens.



\## Working style



Explain what you changed and why before running it. Flag anything that touches

UI when the task was meant to be data-only.


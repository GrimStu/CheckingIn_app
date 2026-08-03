# Checking In (React Native / Expo build)

A native-feeling port of the `design_handoff_checking_in` prototype, built with Expo + TypeScript.

## Run it

```bash
npm install
npx expo start
```

Scan the QR code with the **Expo Go** app (Android/iOS) to run it on your phone — no Android
Studio or SDK needed for this. Press `w` in the terminal to preview in a browser instead (camera
and reliable notification scheduling won't work there, but every other screen does).

## What's implemented

- Full check-in flow: 3-layer emotions wheel (with cross-section selection), confirm, body-scan
  intro + guide detour, body map with hotspots/sensations, journal (camera/gallery photo + resize),
  done screen.
- History: timeline (expandable, delete), calendar (month grid with dot markers), patterns
  (per-feeling bars, top regions, top named feelings).
- Practices: index + 4 detail views, including a working meditation timer with breathing
  animation and duration presets.
- Drawer: avatar/name, dark mode, app-lock toggle (UI stub — see below), reminder times/toggles,
  "preview a reminder" action.
- Local persistence (AsyncStorage) for entries and profile; scheduled daily local notifications
  via `expo-notifications`, with "Check in" / "Later" actions and a journal-outstanding variant.

## Known gaps vs. the design spec

- **App lock (PIN/biometric)**: the toggle is wired up and persists, but there's no actual lock
  screen gating app launch yet — same as the original prototype, this needs a real implementation.
- **Reminders surviving reboot**: `expo-notifications` schedules real OS-level local notifications,
  which is a big step up from the prototype's mocked notification. For rock-solid reboot-survival
  and exact-alarm behavior on Android, build a **development build** via EAS
  (`npx eas build --profile development --platform android`) rather than relying on Expo Go —
  Expo Go itself isn't a persistent registered app the same way a standalone build is.
- Camera/photo capture, image compression, and everything else run through standard Expo modules
  and should work as-is in Expo Go.

## Licence

Copyright (c) 2026 Stuart Morris. All rights reserved.

This source is published for reference. No permission is granted to copy,
modify, or distribute it.

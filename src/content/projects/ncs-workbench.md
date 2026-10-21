---
title: "NCS Workbench"
summary: "A portable Windows companion for BMW NCS Expert and NCS Dummy. Manages coding sessions, keeps backups and checks the result."
kind: "Windows app"
language: "C++"
platform: "Windows XP - 11"
stack: ["C++", "Win32"]
started: "2026-10-19"
repo: "ak-tr/NCS-Workbench"
download: "NCS-Workbench.exe"
post: "ncs-workbench"
image:
  src: "/static/images/projects/ncs-workbench.png"
  alt: "NCS Workbench home screen showing Start Session, the three tools, recent sessions and the WORK folder"
---

One self-contained `NCS-Workbench.exe`, no installer and no runtimes. It watches the files NCS Expert writes to `C:\NCSEXPER\WORK` and handles the routine around coding: preparing the WORK folder, keeping a copy of every trace and MAN file, comparing edits before you code and checking the result after.

## Guided sessions

1. **Prepare:** backs up and clears `FSW_PSW.TRC` and `FSW_PSW.MAN`.
2. **Read:** picks up the new trace from NCS Expert on its own.
3. **Edit:** opens NCS Dummy and saves every MAN you export.
4. **Review, code, read back:** each change shows as MATCH, MISMATCH or CAN'T VERIFY.

Nothing in WORK is deleted before its copy is saved, and Workbench never talks to the car. It's a companion to NCS Expert and NCS Dummy, not a replacement.

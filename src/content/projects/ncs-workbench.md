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

It's a companion to NCS Expert and NCS Dummy, not a replacement, and it never talks to the car.

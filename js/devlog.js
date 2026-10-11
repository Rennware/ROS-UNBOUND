/* AUTO-GENERATED from notes/Website-Agent/tools/build-devlog.py + PROGRESS.md — do not edit by hand. */
window.DEVLOG = [
  {
    "date": "2026-10-11",
    "title": "QR endpoints found + launcher supervision (v0.2)",
    "tag": "AUTH",
    "done": [
      "Mined SDK strings: QR login = `qr.mpsdk.easebar.com`, SDK-OS = `sdk-os.mpsdk.easebar.com` (mpay_oversea.dll), SDK config = `unisdk.update.netease.com/html/latest_default.json`, telemetry `applog.matrix.*`, `who.*`, `dat…",
      "Unbound Launcher v0.2: owns server/probe/game processes — closing it kills all three (WM_DELETE_WINDOW + atexit + watchdog thread). No more separate windows; one launcher to rule them.",
      "TCP probe verdict: game NEVER connects :19000 at login — wall is local-gated unisdk dialog."
    ]
  },
  {
    "date": "2026-10-11",
    "title": "Login breakthrough lead: UNISDK_LOGIN_JSON env injection (test pending)",
    "tag": "AUTH",
    "done": [
      "Ren recognized (server entry shows `Ren, 1Lv, Bronze III, Fast`) but channel-login dialog still blocks: native unisdk, invisible to HTTP stub.",
      "Found in `NtUniSdkBase.dll` strings: SDK reads property `UNISDK_LOGIN_JSON` = BASE64 JSON (`aid`, `sdkuid`, `gas_token`, `username`, `chl_sdk_json`) → `ntGameLoginSuccess!`. Same DLL imports env APIs (`GetEnvironmentStr…",
      "Identity canon: aid 100000001 / local-player-001 / local-offline-token / Ren. Base64 computed. Own launcher now REQUIRED (stock launcher can't pass env): need stock launch recipe first (exe + args + CWD via process snap…"
    ]
  },
  {
    "date": "2026-10-11",
    "title": "🎯 PLAY SCREEN REACHED (Fast PC-ASIA + PLAY button)",
    "tag": "CLIENT",
    "done": [
      "User screenshot: full play screen — `Fast PC-ASIA`, `Select Server`, big PLAY, AoT collab art. No new server requests since server-select (all data already cached from earlier fetches).",
      "Phase tracker: Launcher PLAY ✓ → boot ✓ → patch skip ✓ → server select ✓ → PLAY SCREEN ✓. Remaining: PLAY → auth → Lobby."
    ]
  },
  {
    "date": "2026-10-11",
    "title": "🎯 SERVER SELECT LIVE: PC-ASIA shows Smooth/Fast (flags worked)",
    "tag": "SERVER",
    "done": [
      "Test 1 CONFIRMED: with `no_patch.txt`/`no_first_patch.txt` flags, the game SKIPPED its plist fetch entirely (no `/pl/*.plist` in this boot's log) → login dialog (Google/Facebook/QR) → **server-select panel with PC-ASIA,…",
      "Request log: `whoami.nie.easebar.com/v1` (got 404, tolerated), `server_list_pc.txt` ×2 (rendered), `notice_pc_hw.txt` ×2. Our single-line stub parses correctly."
    ]
  },
  {
    "date": "2026-10-11",
    "title": "🎯 PATCH PHASE PASSED: launcher reports Ready (HTTP 200)",
    "tag": "SERVER",
    "done": [
      "User ran server + hosts + launcher. `ros/launcher_log.txt`: `Start download hotfix info plist` → `CURLMSG_DONE, response code: 200` (was 0). Launcher UI: \"Loading... Ready\", full bar, PLAY active. No CA-trust step neede…",
      "Request log reveals true sequence: CrashHunter POST `appdump.nie.easebar.com/config` (client self-reports `client_v/engine_version/res_version: 1.610576.0`, project h45na, GPU string), `dns.update.easebar.com/hdserver` …"
    ]
  },
  {
    "date": "2026-10-11",
    "title": "MASTER live phase begins: Unbounded v0.1 built + self-tested",
    "tag": "SERVER",
    "done": [
      "Intel: launcher plist path = `/pl/npk_version_na_fps_inner_pc.plist` on `h45na.update.easebar.com` (from REBORN-2.0 traffic log); full boot request sequence known (hc, server_list, notice, hdserver, listerr, whoami, tel…",
      "Env: Python 3.13 + `cryptography` present; shell NOT admin → hosts needs one user admin click; ports 80/443 free; no openssl CLI (used Python instead).",
      "Built `unbounded/`: `server.py` (HTTP 80 + HTTPS 443, every request → `logs/requests.jsonl`, unknown → 404), routes (plist/server_list/hc/notice), OWN CA + 16-SAN leaf (`tools/gen_cert.py`), `start-unbounded.bat`, hosts…"
    ]
  },
  {
    "date": "2026-10-11",
    "title": "Decoder Job #4 COMPLETE → offline decode DONE, handover accepted",
    "tag": "DECODE",
    "done": [
      "Verified `results/2026-10-11-neox-hashid/`: README + HANDOFF.md (113 lines, read in full — oracle, ruled-out table, constraints, 4-tier capture spec) + attack/hashid scripts + logs + tables. Claims hold.",
      "Promoted results: FORMATS §4 → NEEDS-LIVE (container spec + ruled-out table + oracle), §1 id → UNKNOWN, §8 L1/L2/L3 updates, format-log; FINDINGS Job #4 entry; this entry.",
      "Offline decode declared COMPLETE (99.995% archives + oracle + negative sweeps). Only gap: neox.xml plaintext (NEEDS-LIVE). Optional Job #5 (mesh/vis/FMOD layouts) parked as documentation."
    ]
  },
  {
    "date": "2026-10-11",
    "title": "Decoder Job #3 COMPLETE — 99.9952%, 90% GATE PASSED 🎉",
    "tag": "DECODE",
    "done": [
      "Verified `results/2026-10-11-scaleout/`: README + archive_matrix + aggregate_summary (all 100.00%) + 424 KB magic_survey + empty quarantine (header-only) + reports/logs/scripts dirs. Spot-checked summary + quarantine. C…",
      "Promoted results: FORMATS §1 → DECODED (container) + new magics + MD5 oracle + format-log; FINDINGS Job #3 entry; this entry.",
      "Decode math closed: 181,587 + 4,360 + 673 = 186,620 + 9 tombs = 186,629 ✓ → 99.9952% vs 90% gate → PASSED (margin +18,654)."
    ]
  },
  {
    "date": "2026-10-11",
    "title": "Decoder Job #2 COMPLETE (rotor PASS, 2.70% decoded)",
    "tag": "DECODE",
    "done": [
      "Verified `results/2026-10-11-scripts-trial/`: README + `npk_extract.py` + `analyze_script.py` + `harvest_urls.py` + per-record tables + 4,359 decoded samples + 441-line endpoints file. Spot-checked endpoints (plist temp…",
      "Promoted results: FORMATS §2 → CONFIRMED (full pipeline incl. xor-0x9a + reverse + marshal, `78 da` level, perf trap, extractor as THE tool); §1 count fix 26/26; FINDINGS Job #2 entry; decode counter 5,032/186,629 = 2.7…"
    ]
  },
  {
    "date": "2026-10-11",
    "title": "Naming + strategy locked: Unbound / Unbounded, local-first",
    "tag": "SERVER",
    "done": [
      "Revival title: **`Rules of Survival: Unbound`**. Local server: **`Unbounded`**.",
      "Strategy per user: **run locally first, NOT fully offline.** `Unbounded` answers the client's internet-dependent calls (patch/hotfix, auth, matchmaking stubs) over localhost/LAN first; true offline mode comes later. AGE…",
      "Decode set staged: 33 files (~6,250,654,023 bytes) copied from `ros/` to `notes/Decoder-Agent/files/` (27 `.npk` + `neox.xml`, `launcher_log.txt`, `res/version`, `npk_manifest.xml`, `md5_list`, `gim_infos.xml`, `exclusi…"
    ]
  }
];

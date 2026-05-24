# Portfolio Data — Extracted from Google Drive

## AMVero (AI Anomaly Detection)

### Key Metrics (from Baker Hughes deployment)
- 5 enterprise customers within 5 months of launch: Baker Hughes, Thales, 3D Systems, Elos Medtech, Beehive
- 98% reduction in engineering review time per build (Baker Hughes)
- 136 hours saved per year per printer (Baker Hughes)
- 18% reduction in scrap costs (Baker Hughes)
- 98% faster root cause analysis
- ~50% machine time recovery per rejected part

### Product Description
AMVero is a real-time process monitoring solution for additive manufacturing. Uses AI-driven computer vision and IIoT data fusion to detect and notify about anomalies while a part is being printed — not afterwards. Minimally invasive: uses existing in-situ cameras, no proprietary hardware needed. Machine-agnostic: supports all LPBF 3D printers.

### Users
- Shopfloor Managers (operational oversight)
- Machine Operators (execution)
- Process/Quality Engineers (verification & compliance)

### Challenges Solved
- Manual review of thousands of flawless layers to catch one critical anomaly
- Wasting expensive powder and machine hours on builds destined to fail
- Losing money on downstream processes (CT scanning) on parts destined to be scrap
- Vendor lock-in managing diverse multi-brand fleet

### Features
- Real-time anomaly detection (warpage, spatter, recoater hopping, short feed, recoater lines)
- Fleet dashboard — single screen for all machines
- Full traceability — logs all sensor data, imagery, anomalies
- Root-cause analysis — export to 3DXpert Build Inspection
- Configurable end-of-build reports
- Build Compare — compare current build to golden build
- Smart Alerting — multi-layer condition-based alerts (PRD authored by Michael)

### Deployment
- AMVero On Cloud (SaaS on AWS)
- AMVero On Prem (locally hosted, on customer hardware)

### Quote (Baker Hughes — Amar Patel)
"For us, the biggest win with Oqton's AI monitoring is the significant increase in throughput and quality control. By leveraging its real-time capabilities, we've not only minimized the need for extensive post-build inspections but have also drastically streamlined our internal processes. Specifically, we've seen a 98% reduction in engineering review time per build... This, combined with an 18% reduction in scrap costs, has delivered a powerful return on investment and significantly improved our operational efficiency."

### Michael's Quote (Launch Announcement)
"We believe powerful software doesn't have to be complicated. With this new on-premise solution, we're giving operators an intuitive tool to manage the entire build process from a single dashboard, all while keeping their data securely in-house."

## Simulation Suite (Physics-Based Predictive Simulation)

### Technical Whitepaper — Heat Exchanger
- Part: 430mm x 260mm heat exchanger, 1,900 cm³ volume, 0.7mm ultra-thin walls
- Surface area: 3.58 m²
- Hardware: Standard workstation (Intel Core i7-14700K, 128GB RAM, Nvidia RTX 4500 Ada)
- Mechanical: 2.9M elements processed in 8h15m
  - Predicted max deformation: 0.7mm
  - Plastic strains peaked at ~3% (below 4-7% critical threshold for AlSi10Mg)
- Thermal: 6.7M elements (including powder bed)
  - Part temperature up to 131°C (below critical threshold for AlSi10Mg)
  - Simulated full thermal history of 60µm process, triple laser, 30-hour print
- Result: Ready to print, no physical trial needed

### Knauf Customer Story
- Knauf Industries Additive — beta tester for thermo-mechanical simulation
- Produces up to 180 tools/year, 160+ print jobs, 80 final EPP tools
- Calibration specimen: ~100mm x 140mm x 100mm in 316L
- Simulated heat-up: up to 470°C
- Results:
  - Without compensation: deform/shrink up to 0.7mm
  - Predeformation without shrinkage: residual 0.35mm
  - Weld deformation + shrinkage compensated: <0.1mm deformation (most of part), ~0.2mm at outer edge
- Compensates for close to 100% of dimensional distortion

### Emerson Customer Story
- Large 316L demonstrator, 20+ hour build
- Thermal simulation predicted: 390°C heat-up, 720µm shrinkage in 100mm section
- 60% of shrinkage attributable to overheating during process
- Results:
  - 80% reduction in overall dimensional deviations
  - Maximum measured deviation: <150µm
  - Eliminated need for interlayer wait times
  - Maintained high machine throughput

## Michael's Role & Scope
- Senior Product Manager for AMVero
- Authored Smart Alerting Feature PRD
- Led product development, owned roadmap, defined requirements
- Worked with AI engineers on output logic
- Customer prototype validation with enterprise customers
- Designed UX for non-technical operators in regulated environments
- Launch announcement quote attributed to Michael

## Career Timeline
- 2014: Cimatron — QA Engineer
- 2017: 3D Systems — QA Engineer
- 2020: Oqton — QA Manager
- 2022: Oqton — Product Owner
- 2024: Oqton — Senior Product Manager

## AI-Native PM Practice
- Uses Claude Code (primary), evaluated against OpenCode
- Project-specific skills layered into harness
- Site itself built using custom skills
- Shared product context with live Jira integration
- Local agent stack backed by OpenAI and NVIDIA
- Workflow: prompt → skills + context → synthesis → output (PRD / spec / prototype)

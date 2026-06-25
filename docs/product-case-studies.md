# Portfolio Products: Comprehensive Specifications & Case Studies

This document aggregates all technical, commercial, and roadmap data for Michael's key product portfolios: **AMVero (AI Anomaly Detection)** and the **Simulation Suite (Physics-Based Predictive Simulation)**. It is structured for copy-paste and reference use in portfolio development.

---

## Part 1: AMVero (Flagship AI Anomaly Detection Product)

### 1. Product Nature & Differentiators
AMVero is a real-time process monitoring and defect detection solution for additive manufacturing (metal 3D printing). It utilizes AI-driven computer vision combined with IIoT data fusion to identify defects as they happen, preventing material and machine time waste.

*   **Deployment Architecture:**
    *   **AMVero On Cloud:** SaaS deployment running on AWS.
    *   **AMVero On Prem:** Locally hosted on customer hardware (essential for air-gapped operations, network isolation, and ITAR compliance in aerospace and defense).
*   **Hardware Requirement:** Unlike software-only competitors (e.g., *Euler3D* and *Addiguru*) that rely on default/ambient printer cameras, AMVero requires **dedicated image capture hardware** (high-resolution pre- and post-recoater cameras). While representing a higher barrier to entry, this guarantees high data fidelity.
*   **Target Industries:** Aerospace, Medical, and Defense (highly regulated environments).
*   **Compliance Support:** Designed to support FDA 21 CFR 820 (medical device QA), AS9100 (aerospace quality), and Nadcap audit trails and part traceability.

---

### 2. Anomaly Detection Pipeline & Analytics
AMVero captures powder bed images immediately before and after the recoater blade passes:

1.  **Image Prep:** Captured images are translated to a $1024 \times 1024$ resolution for AI inference (displayed at original high resolution in the frontend).
2.  **AI Inference:** The model infers part masks and anomaly masks.
3.  **Spatial Aggregation:** Anomalies are mapped and tracked across layers (sequential or non-sequential) to form 3D volumetric representations.
4.  **Core Anomaly Types Handled:**
    *   **Warpage:** Structural distortion due to thermal stresses.
    *   **Recoater Line:** Linear defects caused by debris on the recoater blade.
    *   **Recoater Hopping:** Vertical vibration marks from the blade bouncing over protrusions.
    *   **Short Feed (Critical + Moderate):** Insufficient powder deposition covering the build area.

---

### 3. Commercial Validation Metrics (Baker Hughes Deployment)
Data verified from active enterprise deployments (such as Baker Hughes, Thales, 3D Systems, Elos Medtech, and Beehive):

*   **Velocity:** Acquired **5 enterprise customers within 5 months** of launch.
*   **Engineering Effort:** **98% reduction in active engineering review time** per build (from hours of manual layer-by-layer inspection down to minutes of verified alerts).
*   **Scrap Reduction:** **18% reduction in scrap costs** by catching failures mid-build and stopping the print.
*   **Printer Throughput:** **136 hours saved per year per printer** by recovering machine time.
*   **Root Cause Analysis:** **98% faster root cause analysis** due to automated anomaly tracing.
*   **Machine Recovery:** **~50% machine time recovery** per rejected part.

---

### 4. Smart Alerting Engine (Release Roadmap)

#### **Version 26.1.1 (Direct Alert Triggers)**
*   **Direct Alert Modeling:** Operators define custom anomaly alert triggers directly within the UI.
*   **Sensor Redesign:** Color-coded min/max thresholds for active telemetry:
    *   `Red` = Violation of threshold.
    *   `Grey` = Sensor value is in range.
*   **Horizontal Histogram:** Real-time visual distribution of sensor feeds.
*   **Unified Dashboard:** Fleet view showing status across all active machines (no active timeline alerts).
*   **Operator Tools:** Built-in Diagnostic and Rectification tools.
*   **Local Build Archive:** Secure, machine-agnostic local database of completed builds.

#### **Version 26.2.1 (Smart Alerting & Volumetric Rules)**
Transition to real-time, conditions-based alerting delivered via email and in-app dashboards. It introduces the following AI-fusion properties:

| Telemetry Property | Description | LPBF Engineering Use Case |
| :--- | :--- | :--- |
| `absolute_anomaly_height` | Total vertical Z extent of the anomaly in millimeters (mm). | "Alert if defect spans > 1.5mm" |
| `anomaly_height_in_layers` | Vertical Z extent represented as raw layer count. | "Alert if defect persists > 10 layers" |
| `volume` | Estimated 3D volume of the anomaly ($mm^3$). | "Alert if total defect volume > 10$mm^3$" |
| `growth_rate` | Volumetric acceleration percentage between last 2 intervals (min 3 layers). | "Alert if growth accelerates faster than 15%/layer" |
| `surface_area` | Calculated 3D surface area of the aggregated defect ($mm^2$). | "Alert if surface is irregular > 20$mm^2$" |
| `volume_to_surface_area` | Compactness metric (ratio of volume to surface area). | "Alert if defect is dense vs. spread out" |
| `volume_to_height` | Shape metric (flat vs. tall defect profile). | "Alert if defect is flat/delaminated" |
| `current_2d_area_vs_build_plate` | Percentage of total build plate surface affected on current layer. | "Alert if anomaly covers > 5% of build area" |
| `distance_from_edge` | Distance (mm) from the four build plate edges. | "Alert if anomaly is near powder bed margin" |
| `intersect with` | Binary intersection with the Part mask or [Anomaly Type + Severity]. | "Alert if warpage intersects critical part geometry" |

---

### 5. Competitive Comparison

| Evaluation Metric | AMVero (Oqton/Hubb) | Euler3D | Addiguru |
| :--- | :--- | :--- | :--- |
| **Hardware Dependency** | Dedicated in-situ camera hardware | Software-only (uses printer camera) | Software-only (uses printer camera) |
| **Physics/ML Rigor** | Volumetric severity scoring (Reactive & physical) | Claims "predictive" spatter detection (Unverified physics) | Claims "50-100 layer" predictions (No independent validation) |
| **Enterprise Readiness** | On-Premise option (ITAR-compliant), AS9100 customers | Unknown deployment, black box | Software integration only |
| **Traceability** | Full powder lot & material integration | No disclosed materials traceability | Limited sensor fusion |
| **Deployment Mode** | SaaS + Air-Gapped Local | Cloud-only | Cloud/hybrid |

---

## Part 2: Simulation Suite (Physics-Based Predictive Simulation)

### 1. Product Nature
The Simulation Suite is a thermo-mechanical and thermal predictive simulation product. It models the stress, thermal history, and deformation of parts *before* they are sent to the printer, eliminating the expensive trial-and-error cycle of physical test prints. It is purely physics-based (no AI).

---

### 2. Verified Case Studies & Performance Metrics

#### **A. Technical Whitepaper: Thin-Walled Heat Exchanger**
*   **Part Specs:** Large heat exchanger ($430mm \times 260mm$), $1,900cm^3$ volume, ultra-thin $0.7mm$ walls. Total surface area of $3.58m^2$.
*   **Execution Profile:** Processed $2.9\text{M}$ mechanical elements and $6.7\text{M}$ thermal elements (including powder bed history) on a standard local workstation in **8 hours and 15 minutes**.
*   **Simulation Findings:**
    *   Predicted maximum deformation of $0.7mm$.
    *   Plastic strains peaked at $\sim 3\%$ (comfortably below the $4\text{--}7\%$ critical threshold for AlSi10Mg alloy).
    *   Maximum simulated temperature reached $131^\circ\text{C}$ (safe margin).
*   **Outcome:** Part successfully printed first-time-right without physical trials.

#### **B. Knauf Industries Additive (Thermo-Mechanical Calibration)**
*   **Challenge:** EPP tool manufacturing requiring thermal and dimensional compensation ($100mm \times 140mm \times 100mm$ specimen in 316L stainless steel, heating up to $470^\circ\text{C}$).
*   **Simulation Results:**
    *   *Uncompensated:* Predicted deformation/shrinkage up to $0.7mm$.
    *   *Pre-deformation (weld + shrinkage compensated):* Reduced deformation to **$<0.1mm$** across the majority of the part, with a max of $\sim 0.2mm$ on the extreme outer boundaries.
*   **Outcome:** Compensated for **close to 100% of dimensional distortion**.

#### **C. Emerson (Thermal Distortion Control)**
*   **Challenge:** Large 316L demonstrator ($20\text{+ hour}$ print). Initial thermal analysis predicted $390^\circ\text{C}$ heat-up and $720\mu m$ shrinkage in a $100mm$ section, with $60\%$ of shrinkage caused by overheating.
*   **Simulation Results:**
    *   **80% reduction in overall dimensional deviations**.
    *   Maximum measured deviation kept **$<150\mu m$**.
    *   **Throughput Gain:** Eliminated the need for interlayer cooling wait times, keeping machine utilization high.

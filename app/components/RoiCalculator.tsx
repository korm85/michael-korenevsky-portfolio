"use client";

import { useState, useMemo } from "react";

// Interactive model behind the AMVero pricing decision: flat per-seat licenses
// vs consumption-based credits. Renders natively on the site's cream surface —
// same tokens as the case-study modals (see globals.css @theme).

const fmtMoney = (v: number) => {
  if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 10000) return `$${Math.round(v / 1000)}k`;
  return `$${Math.round(v).toLocaleString()}`;
};

export default function RoiCalculator() {
  const [baseFee, setBaseFee] = useState<number>(8000);
  const [layerCost, setLayerCost] = useState<number>(0.05);
  const [fleetSize, setFleetSize] = useState<number>(2);
  const [buildHeight, setBuildHeight] = useState<number>(190);
  const [layerHeight, setLayerHeight] = useState<number>(60);
  const [weeklyBuilds, setWeeklyBuilds] = useState<number>(4);
  const [lineHover, setLineHover] = useState<number | null>(null); // 0..1 x fraction

  const legacyFixedPerPrinter = 6000;
  const legacyBaseFee = 8000;

  const layersPerBuild = useMemo(() => Math.round((buildHeight * 1000) / layerHeight), [buildHeight, layerHeight]);
  const yearlyBuilds = useMemo(() => weeklyBuilds * 52, [weeklyBuilds]);
  const yearlyLayers = useMemo(() => yearlyBuilds * layersPerBuild, [yearlyBuilds, layersPerBuild]);
  const proposedTotalCost = useMemo(() => baseFee + (yearlyLayers * layerCost), [baseFee, yearlyLayers, layerCost]);
  const legacyTotalCost = useMemo(() => legacyBaseFee + (fleetSize * legacyFixedPerPrinter), [fleetSize]);

  const tippingPointBuilds = useMemo(() => {
    const costPerBuild = layersPerBuild * layerCost;
    if (costPerBuild === 0) return 0;
    return Math.max(0, Math.round((legacyTotalCost - baseFee) / costPerBuild));
  }, [legacyTotalCost, baseFee, layersPerBuild, layerCost]);

  const isCreditsRecommended = yearlyBuilds < tippingPointBuilds;

  // Scale the current fleet's actual per-printer build rate to each scenario
  // size, so the Weekly Builds and Active Printers sliders drive the chart.
  const fleetScalingData = useMemo(() => {
    const fleets = [1, 5, 10, 20];
    const perPrinterWeekly = weeklyBuilds / fleetSize;
    const proposedAt = (f: number) => baseFee + (f * perPrinterWeekly * 52 * layersPerBuild * layerCost);
    const maxVal = Math.max(legacyBaseFee + 20 * legacyFixedPerPrinter, proposedAt(20));
    return {
      maxVal,
      bars: fleets.map((f) => ({
        fleet: f,
        legacyCost: legacyBaseFee + (f * legacyFixedPerPrinter),
        proposedCost: proposedAt(f),
        legacyHeightPercent: ((legacyBaseFee + f * legacyFixedPerPrinter) / maxVal) * 100,
        proposedHeightPercent: (proposedAt(f) / maxVal) * 100,
      })),
    };
  }, [baseFee, layersPerBuild, layerCost, weeklyBuilds, fleetSize]);

  const lineChartData = useMemo(() => {
    const maxRange = Math.max(tippingPointBuilds * 1.5, 100);
    const steps = 6;
    const points = [];
    for (let i = 0; i <= steps; i++) {
      const builds = Math.round((maxRange / steps) * i);
      points.push({ builds, proposedVal: baseFee + (builds * layersPerBuild * layerCost), legacyVal: legacyTotalCost });
    }
    return { points, maxVal: Math.max(legacyTotalCost, baseFee + (maxRange * layersPerBuild * layerCost)), maxRange };
  }, [tippingPointBuilds, baseFee, layersPerBuild, layerCost, legacyTotalCost]);

  const sliderClass = "w-full accent-[#16a34a] h-1.5 cursor-pointer";
  const panelClass = "bg-paper-2 border border-line rounded-sm p-4 flex flex-col gap-4";
  const panelHeading = "font-mono text-[10px] uppercase tracking-[0.12em] text-accent-deep font-medium";

  // Shared y-axis: labels at 100/75/50/25% of the plot's max value
  const yTicks = (maxVal: number) =>
    [1, 0.75, 0.5, 0.25].map((f) => (
      <span
        key={f}
        className="absolute right-1 font-mono text-[8px] text-ink-faint leading-none"
        style={{ top: `${(1 - f) * 100}%`, transform: "translateY(-50%)" }}
      >
        {fmtMoney(maxVal * f)}
      </span>
    ));

  const gridLines = [0.25, 0.5, 0.75].map((f) => (
    <div
      key={f}
      className="absolute inset-x-0 border-b border-line/50 pointer-events-none"
      style={{ bottom: `${f * 100}%` }}
    />
  ));

  // Line-chart hover: x fraction → builds/yr → cost under each model
  const hoverBuilds = lineHover !== null ? Math.round(lineHover * lineChartData.maxRange) : null;
  const hoverProposed = hoverBuilds !== null ? baseFee + hoverBuilds * layersPerBuild * layerCost : null;
  const yearlyPct = Math.min(100, (yearlyBuilds / lineChartData.maxRange) * 100);

  return (
    <div className="w-full flex flex-col gap-5 text-ink-soft">
      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Pricing Inputs */}
        <div className={`md:col-span-4 ${panelClass}`}>
          <h4 className={panelHeading}>1. Pricing Variables</h4>
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-ink-faint">Proposed Base Fee:</span>
              <span className="text-ink font-semibold">${baseFee.toLocaleString()}</span>
            </div>
            <input type="range" min="2000" max="15000" step="500" value={baseFee} onChange={(e) => setBaseFee(Number(e.target.value))} className={sliderClass} aria-label="Proposed base fee" />
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-ink-faint">Cost per 1,000 Layers:</span>
              <span className="text-ink font-semibold">${(layerCost * 1000).toFixed(2)}</span>
            </div>
            <input type="range" min="0.01" max="0.15" step="0.001" value={layerCost} onChange={(e) => setLayerCost(Number(e.target.value))} className={sliderClass} aria-label="Cost per thousand layers" />
          </div>
          <div className="pt-2 border-t border-line text-[10px] text-ink-faint leading-normal">
            Proposed credit model charges a low base fee + volume-based consumption fee. Legacy charges a flat ${legacyFixedPerPrinter.toLocaleString()}/yr per node.
          </div>
        </div>

        {/* Fleet & Usage Inputs */}
        <div className={`md:col-span-4 ${panelClass}`}>
          <h4 className={panelHeading}>2. Production & Fleet</h4>
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-ink-faint">Active Printers:</span>
              <span className="text-ink font-semibold">{fleetSize} {fleetSize === 1 ? "Node" : "Nodes"}</span>
            </div>
            <input type="range" min="1" max="20" step="1" value={fleetSize} onChange={(e) => setFleetSize(Number(e.target.value))} className={sliderClass} aria-label="Fleet size" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] font-mono text-ink-faint">
                <span>Build Height:</span>
                <span className="text-ink font-semibold">{buildHeight}mm</span>
              </div>
              <input type="range" min="10" max="500" step="10" value={buildHeight} onChange={(e) => setBuildHeight(Number(e.target.value))} className={sliderClass} aria-label="Build height in millimeters" />
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] font-mono text-ink-faint">
                <span>Layer Res:</span>
                <span className="text-ink font-semibold">{layerHeight}µm</span>
              </div>
              <input type="range" min="20" max="120" step="10" value={layerHeight} onChange={(e) => setLayerHeight(Number(e.target.value))} className={sliderClass} aria-label="Layer resolution in microns" />
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-ink-faint">Weekly Builds (Total):</span>
              <span className="text-ink font-semibold">{weeklyBuilds} / week</span>
            </div>
            <input type="range" min="1" max="100" step="1" value={weeklyBuilds} onChange={(e) => setWeeklyBuilds(Number(e.target.value))} className={sliderClass} aria-label="Weekly builds" />
          </div>
        </div>

        {/* Results */}
        <div className="md:col-span-4 grid grid-rows-3 gap-3">
          <div className="bg-paper-2 border border-line rounded-sm p-3 flex justify-between items-center">
            <div>
              <p className="font-mono text-[9px] uppercase tracking-[0.1em] text-ink-faint">Proposed Credit Cost</p>
              <h3 className="text-2xl font-display font-light text-accent-deep mt-1 leading-none">
                ${Math.round(proposedTotalCost).toLocaleString()}
                <span className="text-xs text-ink-faint font-sans">/yr</span>
              </h3>
            </div>
            <div className="text-right">
              <p className="font-mono text-[9px] uppercase tracking-[0.1em] text-ink-faint">Legacy Fixed Cost</p>
              <p className="text-sm font-display font-light text-ink mt-1">${legacyTotalCost.toLocaleString()}/yr</p>
            </div>
          </div>
          <div className="bg-paper-2 border border-line rounded-sm p-3 flex justify-between items-center">
            <div>
              <p className="font-mono text-[9px] uppercase tracking-[0.1em] text-ink-faint">Parity Threshold</p>
              <h3 className="text-sm font-display text-ink mt-1">{tippingPointBuilds} Builds / year</h3>
              <p className="text-[9px] text-ink-faint">Below this point, credits save money</p>
            </div>
            <div className="text-right">
              <p className="font-mono text-[9px] uppercase tracking-[0.1em] text-ink-faint">Your Yearly Builds</p>
              <p className="text-sm font-display text-accent-deep mt-1">{yearlyBuilds.toLocaleString()}</p>
              <p className="text-[9px] text-ink-faint">
                {weeklyBuilds}/week vs {(tippingPointBuilds / 52).toFixed(1)}/week parity
              </p>
            </div>
          </div>
          <div className={`rounded-sm p-3 border flex flex-col justify-center items-center text-center gap-1 transition-all ${
            isCreditsRecommended
              ? "bg-accent/10 border-accent-deep/40 text-accent-deep"
              : "bg-paper-2 border-line text-ink-soft"
          }`}>
            <span className="text-[10px] font-mono uppercase font-medium tracking-[0.12em]">
              {isCreditsRecommended ? "✔ Credit Pricing Recommended" : "Legacy Fixed Pricing Better"}
            </span>
            <span className="text-[9px] text-ink-faint leading-none">
              {isCreditsRecommended
                ? `Saves $${Math.max(0, Math.round(legacyTotalCost - proposedTotalCost)).toLocaleString()}/yr over legacy flat pricing`
                : `Proposed is $${Math.max(0, Math.round(proposedTotalCost - legacyTotalCost)).toLocaleString()}/yr higher than legacy`}
            </span>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Fleet Scaling Bar Chart */}
        <div className={panelClass}>
          <h4 className={panelHeading}>Annual Cost Comparison (Fleet Scaling)</h4>
          <div className="flex">
            <div className="relative w-10 h-[170px] shrink-0">{yTicks(fleetScalingData.maxVal)}</div>
            <div className="relative flex-1 h-[170px] border-b border-l border-line">
              {gridLines}
              <div className="absolute inset-0 flex items-end justify-around px-2">
                {fleetScalingData.bars.map((data) => (
                  <div key={data.fleet} className="h-full flex justify-center gap-3 items-end group">
                    <div
                      className="w-4 bg-ink-faint/60 hover:bg-ink-faint rounded-t-sm transition-all duration-500 relative"
                      style={{ height: `${data.legacyHeightPercent}%` }}
                    >
                      <div className="opacity-0 group-hover:opacity-100 absolute bottom-full left-1/2 -translate-x-1/2 bg-paper border border-line px-1.5 py-0.5 rounded-sm text-[8px] font-mono text-ink-soft mb-1 z-10 whitespace-nowrap shadow-md transition-opacity duration-300">
                        Legacy: {fmtMoney(data.legacyCost)}
                      </div>
                    </div>
                    <div
                      className="w-4 bg-accent hover:bg-accent-deep rounded-t-sm transition-all duration-500 relative"
                      style={{ height: `${data.proposedHeightPercent}%` }}
                    >
                      <div className="opacity-0 group-hover:opacity-100 absolute bottom-full left-1/2 -translate-x-1/2 bg-paper border border-line px-1.5 py-0.5 rounded-sm text-[8px] font-mono text-accent-deep mb-1 z-10 whitespace-nowrap shadow-md transition-opacity duration-300">
                        Credits: {fmtMoney(data.proposedCost)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="flex justify-around pl-10 -mt-2">
            {fleetScalingData.bars.map((data) => (
              <span key={data.fleet} className="text-[10px] text-ink-faint font-mono">
                {data.fleet} {data.fleet === 1 ? "Node" : "Nodes"}
              </span>
            ))}
          </div>
          <div className="flex justify-center gap-4 font-mono text-[9px] uppercase tracking-[0.1em] text-ink-faint">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2 bg-ink-faint/60 rounded-sm" /> Legacy Fixed</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2 bg-accent rounded-sm" /> Proposed Credit (your build rate, scaled)</span>
          </div>
        </div>

        {/* Breakeven Threshold Line Chart */}
        <div className={panelClass}>
          <h4 className={panelHeading}>Parity Threshold Analysis (Active Fleet)</h4>
          <div className="flex">
            <div className="relative w-10 h-[170px] shrink-0">{yTicks(lineChartData.maxVal)}</div>
            <div
              className="relative flex-1 h-[170px] border-b border-l border-line cursor-crosshair"
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                setLineHover(Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width)));
              }}
              onMouseLeave={() => setLineHover(null)}
            >
              {gridLines}
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                {lineChartData.maxVal > 0 && (
                  <line
                    x1="0" y1={100 - (legacyTotalCost / lineChartData.maxVal) * 100}
                    x2="100" y2={100 - (legacyTotalCost / lineChartData.maxVal) * 100}
                    stroke="#6e6759" strokeWidth="1.5" strokeDasharray="3 3"
                    vectorEffect="non-scaling-stroke"
                  />
                )}
                {lineChartData.points.length > 0 && (
                  <>
                    <path
                      d={`M 0,${100 - (baseFee / lineChartData.maxVal) * 100} ${lineChartData.points.map((p, idx) => `L ${(idx / (lineChartData.points.length - 1)) * 100},${100 - (p.proposedVal / lineChartData.maxVal) * 100}`).join(" ")} L 100,100 L 0,100 Z`}
                      fill="url(#creditGradient)" opacity="0.12"
                    />
                    <path
                      d={`M 0,${100 - (baseFee / lineChartData.maxVal) * 100} ${lineChartData.points.map((p, idx) => `L ${(idx / (lineChartData.points.length - 1)) * 100},${100 - (p.proposedVal / lineChartData.maxVal) * 100}`).join(" ")}`}
                      fill="none" stroke="#16a34a" strokeWidth="2"
                      vectorEffect="non-scaling-stroke"
                    />
                  </>
                )}
                <defs>
                  <linearGradient id="creditGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#16a34a" />
                    <stop offset="100%" stopColor="#16a34a" stopOpacity="0" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Your current volume — moves with the Weekly Builds slider */}
              <div
                className="absolute top-0 bottom-0 border-l border-dashed border-accent-deep/60 pointer-events-none"
                style={{ left: `${yearlyPct}%` }}
              />
              <div
                className="absolute bottom-5 -translate-x-1/2 font-mono text-[8px] bg-paper text-accent-deep border border-line rounded-sm px-1.5 py-0.5 whitespace-nowrap pointer-events-none"
                style={{ left: `${Math.min(88, Math.max(12, yearlyPct))}%` }}
              >
                Your volume: {yearlyBuilds.toLocaleString()}/yr
              </div>

              {/* Parity point — HTML dot so it can't be stretched by the SVG scaling */}
              {tippingPointBuilds > 0 && tippingPointBuilds < lineChartData.maxRange && (
                <>
                  <div
                    className="absolute w-2 h-2 rounded-full bg-accent-deep border border-paper pointer-events-none -translate-x-1/2 -translate-y-1/2"
                    style={{
                      left: `${(tippingPointBuilds / lineChartData.maxRange) * 100}%`,
                      top: `${100 - (legacyTotalCost / lineChartData.maxVal) * 100}%`,
                    }}
                  />
                  <div
                    className="absolute text-[8px] font-mono bg-paper text-accent-deep border border-line rounded-sm px-1.5 py-0.5 shadow-md flex flex-col items-center pointer-events-none -translate-x-1/2 -translate-y-full"
                    style={{ left: `${(tippingPointBuilds / lineChartData.maxRange) * 100}%`, top: `${100 - (legacyTotalCost / lineChartData.maxVal) * 100}%`, marginTop: "-7px" }}
                  >
                    <span className="font-medium uppercase tracking-wider">Parity Point</span>
                    <span className="font-bold">{tippingPointBuilds} builds/yr</span>
                  </div>
                </>
              )}

              <div className="absolute top-2 left-2 pointer-events-none">
                <span className="text-[9px] font-mono text-ink-soft bg-paper px-1.5 py-0.5 rounded-sm border border-line">
                  Legacy baseline: ${legacyTotalCost.toLocaleString()}
                </span>
              </div>

              {/* Hover readout — restores the old chart's value tooltips */}
              {lineHover !== null && hoverBuilds !== null && hoverProposed !== null && (
                <>
                  <div
                    className="absolute top-0 bottom-0 border-l border-ink-faint/40 pointer-events-none"
                    style={{ left: `${lineHover * 100}%` }}
                  />
                  <div
                    className="absolute font-mono text-[8px] bg-paper border border-line rounded-sm px-1.5 py-1 shadow-md pointer-events-none flex flex-col gap-0.5 whitespace-nowrap z-10"
                    style={{
                      left: `${Math.min(72, Math.max(14, lineHover * 100))}%`,
                      top: "8%",
                      transform: "translateX(-50%)",
                    }}
                  >
                    <span className="text-ink font-semibold">{hoverBuilds.toLocaleString()} builds/yr</span>
                    <span className="text-accent-deep">Credits: ${Math.round(hoverProposed).toLocaleString()}</span>
                    <span className="text-ink-faint">Legacy: ${legacyTotalCost.toLocaleString()}</span>
                  </div>
                </>
              )}

              <div className="absolute bottom-1 left-2 text-[8px] text-ink-faint font-mono pointer-events-none">0 builds</div>
              <div className="absolute bottom-1 right-2 text-[8px] text-ink-faint font-mono pointer-events-none">{Math.round(lineChartData.maxRange)} builds/yr</div>
            </div>
          </div>
          <div className="flex justify-center gap-4 font-mono text-[9px] uppercase tracking-[0.1em] text-ink-faint">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-0.5 border-t border-dashed border-ink-faint" /> Legacy Baseline</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-0.5 bg-accent" /> Proposed Credits</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-0.5 border-t border-dashed border-accent-deep/60" /> Your Volume</span>
          </div>
        </div>
      </div>

      {/* Info Block */}
      <div className="bg-paper-2 border border-line rounded-sm p-4 text-xs text-ink-faint leading-relaxed grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-soft font-medium">Layer Calculation</span>
          <p className="mt-1">
            Each build runs layers of thickness <span className="text-ink font-semibold font-mono">{layerHeight}µm</span>. For a build height of <span className="text-ink font-semibold font-mono">{buildHeight}mm</span>, this requires <span className="text-accent-deep font-semibold font-mono">{layersPerBuild.toLocaleString()}</span> individual layers. Under a 52-week schedule with <span className="text-ink font-semibold font-mono">{weeklyBuilds}</span> builds/week (<span className="text-accent-deep font-semibold font-mono">{yearlyBuilds.toLocaleString()}</span> builds/yr), the fleet consumes <span className="text-accent-deep font-semibold font-mono">{yearlyLayers.toLocaleString()}</span> layers per year.
          </p>
        </div>
        <div>
          <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-soft font-medium">Pricing Formula</span>
          <p className="mt-1 font-mono text-[10px] leading-relaxed">
            {`Proposed = Base Fee ($${baseFee.toLocaleString()}) + Yearly Layers (${yearlyLayers.toLocaleString()}) × Cost/Layer ($${layerCost.toFixed(3)})`}
            <br />
            {`Legacy = Base Fee ($8,000) + Printers (${fleetSize}) × Annual License ($6,000)`}
          </p>
        </div>
      </div>
    </div>
  );
}

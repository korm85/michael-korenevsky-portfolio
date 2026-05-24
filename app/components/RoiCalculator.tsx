"use client";

import { useState, useMemo } from "react";

export default function RoiCalculator() {
  // Pricing Controls
  const [baseFee, setBaseFee] = useState<number>(8000);
  const [layerCost, setLayerCost] = useState<number>(0.05);

  // Production & Fleet Controls
  const [fleetSize, setFleetSize] = useState<number>(2);
  const [buildHeight, setBuildHeight] = useState<number>(190);
  const [layerHeight, setLayerHeight] = useState<number>(60);
  const [weeklyBuilds, setWeeklyBuilds] = useState<number>(4);

  // Constants
  const legacyFixedPerPrinter = 6000;
  const legacyBaseFee = 8000;

  // Calculation Logic
  const layersPerBuild = useMemo(() => {
    return Math.round((buildHeight * 1000) / layerHeight);
  }, [buildHeight, layerHeight]);

  const yearlyBuilds = useMemo(() => {
    return weeklyBuilds * 52;
  }, [weeklyBuilds]);

  const yearlyLayers = useMemo(() => {
    return yearlyBuilds * layersPerBuild;
  }, [yearlyBuilds, layersPerBuild]);

  const proposedTotalCost = useMemo(() => {
    return baseFee + (yearlyLayers * layerCost);
  }, [baseFee, yearlyLayers, layerCost]);

  const legacyTotalCost = useMemo(() => {
    return legacyBaseFee + (fleetSize * legacyFixedPerPrinter);
  }, [fleetSize]);

  // Breakeven/Tipping Point in builds/year
  const tippingPointBuilds = useMemo(() => {
    const costPerBuild = layersPerBuild * layerCost;
    if (costPerBuild === 0) return 0;
    const diff = legacyTotalCost - baseFee;
    return Math.max(0, Math.round(diff / costPerBuild));
  }, [legacyTotalCost, baseFee, layersPerBuild, layerCost]);

  const isCreditsRecommended = yearlyBuilds < tippingPointBuilds;

  // Data for the Bar Chart: Fleet Scaling (1, 5, 10, 20 Printers)
  const fleetScalingData = useMemo(() => {
    const fleets = [1, 5, 10, 20];
    const maxVal = Math.max(
      legacyBaseFee + 20 * legacyFixedPerPrinter,
      baseFee + (20 * 2 * 52 * layersPerBuild * layerCost)
    );

    return fleets.map((f) => {
      const legacyCost = legacyBaseFee + (f * legacyFixedPerPrinter);
      // Assume 2 builds per week per printer for scale projection
      const proposedCost = baseFee + (f * 2 * 52 * layersPerBuild * layerCost);
      return {
        fleet: f,
        legacyCost,
        proposedCost,
        legacyHeightPercent: (legacyCost / maxVal) * 100,
        proposedHeightPercent: (proposedCost / maxVal) * 100,
      };
    });
  }, [baseFee, layersPerBuild, layerCost]);

  // Data for the Line Chart: Parity Threshold Analysis
  const lineChartData = useMemo(() => {
    const maxRange = Math.max(tippingPointBuilds * 1.5, 100);
    const steps = 6;
    const points = [];
    for (let i = 0; i <= steps; i++) {
      const builds = Math.round((maxRange / steps) * i);
      const proposedVal = baseFee + (builds * layersPerBuild * layerCost);
      points.push({
        builds,
        proposedVal,
        legacyVal: legacyTotalCost,
      });
    }

    const maxVal = Math.max(legacyTotalCost, baseFee + (maxRange * layersPerBuild * layerCost));

    return {
      points,
      maxVal,
      maxRange,
    };
  }, [tippingPointBuilds, baseFee, layersPerBuild, layerCost, legacyTotalCost]);

  return (
    <div className="w-full flex flex-col gap-6 text-text-secondary">
      {/* 1. Main Controls Section */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
        {/* Pricing Inputs */}
        <div className="md:col-span-4 bg-surface border border-border-dark rounded-xl p-4 flex flex-col gap-4">
          <h4 className="font-mono text-[10px] uppercase tracking-wider text-teal-accent font-bold">
            1. Pricing Variables
          </h4>
          
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-text-muted">Proposed Base Fee:</span>
              <span className="text-teal-accent font-bold">${baseFee.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min="2000"
              max="15000"
              step="500"
              value={baseFee}
              onChange={(e) => setBaseFee(Number(e.target.value))}
              className="w-full accent-teal-accent bg-black/60 h-1.5 rounded-lg cursor-pointer"
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-text-muted">Cost per 1,000 Layers:</span>
              <span className="text-teal-accent font-bold">${(layerCost * 1000).toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="0.01"
              max="0.15"
              step="0.005"
              value={layerCost}
              onChange={(e) => setLayerCost(Number(e.target.value))}
              className="w-full accent-teal-accent bg-black/60 h-1.5 rounded-lg cursor-pointer"
            />
          </div>

          <div className="pt-2 border-t border-border-dark text-[10px] text-text-muted leading-normal">
            <p>Proposed credit model charges a low base fee + volume-based consumption fee. Legacy model charges a flat ${legacyFixedPerPrinter.toLocaleString()}/yr per node.</p>
          </div>
        </div>

        {/* Fleet & Usage Inputs */}
        <div className="md:col-span-4 bg-surface border border-border-dark rounded-xl p-4 flex flex-col gap-4">
          <h4 className="font-mono text-[10px] uppercase tracking-wider text-teal-accent font-bold">
            2. Production & Fleet
          </h4>

          <div className="space-y-1">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-text-muted">Active Printers:</span>
              <span className="text-teal-accent font-bold">{fleetSize} {fleetSize === 1 ? "Node" : "Nodes"}</span>
            </div>
            <input
              type="range"
              min="1"
              max="20"
              step="1"
              value={fleetSize}
              onChange={(e) => setFleetSize(Number(e.target.value))}
              className="w-full accent-teal-accent bg-black/60 h-1.5 rounded-lg cursor-pointer"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] font-mono text-text-muted">
                <span>Height:</span>
                <span className="text-white font-semibold">{buildHeight}mm</span>
              </div>
              <input
                type="range"
                min="10"
                max="500"
                step="10"
                value={buildHeight}
                onChange={(e) => setBuildHeight(Number(e.target.value))}
                className="w-full accent-teal-accent bg-black/60 h-1.5 rounded-lg cursor-pointer"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[10px] font-mono text-text-muted">
                <span>Layer Res:</span>
                <span className="text-white font-semibold">{layerHeight}µm</span>
              </div>
              <input
                type="range"
                min="20"
                max="120"
                step="10"
                value={layerHeight}
                onChange={(e) => setLayerHeight(Number(e.target.value))}
                className="w-full accent-teal-accent bg-black/60 h-1.5 rounded-lg cursor-pointer"
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-text-muted">Weekly Builds (Total):</span>
              <span className="text-teal-accent font-bold">{weeklyBuilds} / week</span>
            </div>
            <input
              type="range"
              min="1"
              max="100"
              step="1"
              value={weeklyBuilds}
              onChange={(e) => setWeeklyBuilds(Number(e.target.value))}
              className="w-full accent-teal-accent bg-black/60 h-1.5 rounded-lg cursor-pointer"
            />
          </div>
        </div>

        {/* Calculated Results Block */}
        <div className="md:col-span-4 grid grid-rows-3 gap-3">
          {/* Main cost output */}
          <div className="bg-surface border border-border-dark rounded-xl p-3 flex justify-between items-center">
            <div>
              <p className="text-[9px] font-mono uppercase tracking-wider text-text-muted font-bold">Proposed Credit Cost</p>
              <h3 className="text-xl font-bold text-white mt-1">${Math.round(proposedTotalCost).toLocaleString()}<span className="text-xs text-text-muted font-normal">/yr</span></h3>
            </div>
            <div className="text-right">
              <p className="text-[9px] font-mono uppercase tracking-wider text-text-muted font-bold">Legacy Fixed Cost</p>
              <p className="text-sm font-bold text-teal-accent mt-1">${legacyTotalCost.toLocaleString()}/yr</p>
            </div>
          </div>

          {/* Tipping point */}
          <div className="bg-surface border border-border-dark rounded-xl p-3 flex justify-between items-center">
            <div>
              <p className="text-[9px] font-mono uppercase tracking-wider text-text-muted font-bold">Parity Threshold</p>
              <h3 className="text-sm font-bold text-white mt-1">{tippingPointBuilds} Builds / year</h3>
              <p className="text-[8px] text-text-muted">Below this point, credits save money</p>
            </div>
            <div className="text-right">
              <p className="text-[9px] font-mono uppercase tracking-wider text-text-muted font-bold">Weekly Target</p>
              <p className="text-xs font-semibold text-text-secondary mt-1">{(tippingPointBuilds / 52).toFixed(1)} builds</p>
            </div>
          </div>

          {/* Recommendation badge */}
          <div className={`rounded-xl p-3 border flex flex-col justify-center items-center text-center gap-1 transition-all ${
            isCreditsRecommended
              ? "bg-emerald-950/20 border-emerald-900/50 text-emerald-400"
              : "bg-amber-950/20 border-amber-900/50 text-teal-accent"
          }`}>
            <span className="text-[10px] font-mono uppercase font-bold tracking-widest">
              {isCreditsRecommended ? "✔ Credit Pricing Recommended" : "Legacy Fixed Pricing Better"}
            </span>
            <span className="text-[8px] text-text-muted leading-none">
              {isCreditsRecommended 
                ? `Saves $${Math.max(0, Math.round(legacyTotalCost - proposedTotalCost)).toLocaleString()}/yr over legacy flat pricing` 
                : `Proposed is $${Math.max(0, Math.round(proposedTotalCost - legacyTotalCost)).toLocaleString()}/yr higher than legacy`}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Visual Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Fleet Scaling Bar Chart (Responsive SVG) */}
        <div className="bg-surface border border-border-dark rounded-xl p-4 flex flex-col gap-3">
          <h4 className="font-mono text-[10px] uppercase tracking-wider text-text-muted font-bold">
            Annual Cost Comparison (Fleet Scaling)
          </h4>
          <div className="h-[200px] w-full flex items-end justify-between px-2 pb-6 pt-4 border-b border-l border-border-dark relative">
            {/* Grid Line Guides */}
            <div className="absolute inset-x-0 bottom-1/4 border-b border-border-dark/40 pointer-events-none" />
            <div className="absolute inset-x-0 bottom-2/4 border-b border-border-dark/40 pointer-events-none" />
            <div className="absolute inset-x-0 bottom-3/4 border-b border-border-dark/40 pointer-events-none" />

            {fleetScalingData.map((data) => (
              <div key={data.fleet} className="flex flex-col items-center gap-2 flex-1 group">
                <div className="w-full flex justify-center gap-3 items-end h-[140px]">
                  {/* Legacy bar */}
                  <div 
                    className="w-4 bg-border-dark hover:bg-border-dark/80 border border-border-dark rounded-t transition-all duration-500 relative"
                    style={{ height: `${data.legacyHeightPercent}%` }}
                  >
                    <div className="opacity-0 group-hover:opacity-100 absolute bottom-full left-1/2 -translate-x-1/2 bg-surface border border-border-dark px-1.5 py-0.5 rounded text-[8px] font-mono text-text-muted mb-1 z-10 whitespace-nowrap shadow-md transition-opacity duration-300">
                      Legacy: ${Math.round(data.legacyCost / 1000)}k
                    </div>
                  </div>
                  {/* Proposed bar */}
                  <div 
                    className="w-4 bg-teal-accent hover:bg-amber-600 rounded-t transition-all duration-500 relative"
                    style={{ height: `${data.proposedHeightPercent}%` }}
                  >
                    <div className="opacity-0 group-hover:opacity-100 absolute bottom-full left-1/2 -translate-x-1/2 bg-surface border border-border-dark px-1.5 py-0.5 rounded text-[8px] font-mono text-teal-accent mb-1 z-10 whitespace-nowrap shadow-md transition-opacity duration-300">
                      Credits: ${Math.round(data.proposedCost / 1000)}k
                    </div>
                  </div>
                </div>
                <span className="text-[10px] text-text-muted font-mono font-medium">{data.fleet} {data.fleet === 1 ? "Node" : "Nodes"}</span>
              </div>
            ))}
          </div>
          {/* Legend */}
          <div className="flex justify-center gap-4 text-[9px] font-mono uppercase tracking-wider text-text-muted font-bold">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2 bg-border-dark rounded-sm border border-border-dark" /> Legacy Fixed</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2 bg-teal-accent rounded-sm" /> Proposed Credit</span>
          </div>
        </div>

        {/* Breakeven Threshold Line Chart (Responsive SVG) */}
        <div className="bg-surface border border-border-dark rounded-xl p-4 flex flex-col gap-3">
          <h4 className="font-mono text-[10px] uppercase tracking-wider text-text-muted font-bold">
            Parity Threshold Analysis (Active Fleet)
          </h4>
          <div className="h-[200px] w-full relative border-b border-l border-border-dark">
            {/* SVG Plotting */}
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              {/* Legacy Baseline Line (dashed horizontal) */}
              {lineChartData.maxVal > 0 && (
                <line
                  x1="0"
                  y1={100 - (legacyTotalCost / lineChartData.maxVal) * 100}
                  x2="100"
                  y2={100 - (legacyTotalCost / lineChartData.maxVal) * 100}
                  stroke="#232426"
                  strokeWidth="1.5"
                  strokeDasharray="3 3"
                />
              )}

              {/* Proposed cost slope */}
              {lineChartData.points.length > 0 && (
                <>
                  <path
                    d={`M 0,${100 - (baseFee / lineChartData.maxVal) * 100} ${lineChartData.points
                       .map((p, idx) => {
                         const x = (idx / (lineChartData.points.length - 1)) * 100;
                         const y = 100 - (p.proposedVal / lineChartData.maxVal) * 100;
                         return `L ${x},${y}`;
                       })
                       .join(" ")} L 100,100 L 0,100 Z`}
                    fill="url(#goldGradient)"
                    opacity="0.08"
                  />
                  <path
                    d={`M 0,${100 - (baseFee / lineChartData.maxVal) * 100} ${lineChartData.points
                       .map((p, idx) => {
                         const x = (idx / (lineChartData.points.length - 1)) * 100;
                         const y = 100 - (p.proposedVal / lineChartData.maxVal) * 100;
                         return `L ${x},${y}`;
                       })
                       .join(" ")}`}
                    fill="none"
                    stroke="#b08e4f"
                    strokeWidth="2"
                  />
                </>
              )}

              {/* Tipping point intersection marker */}
              {tippingPointBuilds > 0 && tippingPointBuilds < lineChartData.maxRange && (
                <circle
                  cx={(tippingPointBuilds / lineChartData.maxRange) * 100}
                  cy={100 - (legacyTotalCost / lineChartData.maxVal) * 100}
                  r="3.5"
                  fill="#b08e4f"
                />
              )}

              <defs>
                <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#b08e4f" />
                  <stop offset="100%" stopColor="#b08e4f" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>

            {/* Labels overlay */}
            <div className="absolute top-2 left-2 flex flex-col gap-0.5">
              <span className="text-[9px] font-mono text-text-muted bg-canvas px-1 py-0.5 rounded border border-border-dark shadow-sm font-semibold">
                Legacy baseline: ${legacyTotalCost.toLocaleString()}
              </span>
            </div>

            {/* Breakeven marker callout */}
            {tippingPointBuilds > 0 && tippingPointBuilds < lineChartData.maxRange && (
              <div 
                className="absolute text-[8px] font-mono bg-canvas text-teal-accent border border-border-dark rounded px-1.5 py-0.5 shadow-md flex flex-col items-center pointer-events-none -translate-x-1/2 -translate-y-full"
                style={{
                  left: `${(tippingPointBuilds / lineChartData.maxRange) * 100}%`,
                  top: `${(100 - (legacyTotalCost / lineChartData.maxVal) * 100)}%`,
                  marginTop: "-6px"
                }}
              >
                <span className="font-bold">Parity Point</span>
                <span className="font-black">{tippingPointBuilds} builds/yr</span>
              </div>
            )}

            {/* Axis labels */}
            <div className="absolute bottom-1 left-2 text-[8px] text-text-muted font-mono">0 builds</div>
            <div className="absolute bottom-1 right-2 text-[8px] text-text-muted font-mono">{Math.round(lineChartData.maxRange)} builds/yr</div>
          </div>
          {/* Legend */}
          <div className="flex justify-center gap-4 text-[9px] font-mono uppercase tracking-wider text-text-muted font-bold">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-0.5 border-t border-dashed border-border-dark" /> Legacy Baseline</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-0.5 bg-teal-accent" /> Proposed Credits</span>
          </div>
        </div>
      </div>

      {/* 3. Info Block */}
      <div className="bg-[#1a1b1d] border border-border-dark rounded-xl p-3 text-xs text-text-muted leading-relaxed grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <span className="font-bold text-white">Weekly Layer Calculation Details:</span>
          <p className="mt-1">
            Each print build runs layers of thickness <span className="text-white font-semibold font-mono">{layerHeight}µm</span>. For a build height of <span className="text-white font-semibold font-mono">{buildHeight}mm</span>, this requires <span className="text-teal-accent font-bold font-mono">{layersPerBuild.toLocaleString()}</span> individual layers. Under a 52-week schedule with <span className="text-white font-semibold font-mono">{weeklyBuilds}</span> builds/week, the fleet consumes <span className="text-teal-accent font-bold font-mono">{yearlyLayers.toLocaleString()}</span> layers per year.
          </p>
        </div>
        <div>
          <span className="font-bold text-white">Licensing Formula Model:</span>
          <p className="mt-1">
            `Proposed Cost = Base Fee (${baseFee.toLocaleString()}) + (Yearly Layers ({yearlyLayers.toLocaleString()}) &times; Cost per Layer (${layerCost.toFixed(3)}))`
            <br />
            `Legacy Cost = Base Fee ($8,000) + (Printers ({fleetSize}) &times; Annual License ($6,000))`
          </p>
        </div>
      </div>
    </div>
  );
}

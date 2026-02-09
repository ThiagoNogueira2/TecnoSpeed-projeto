import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts";
import CustomTooltip from "./CustomTooltip";
import { formatarHora } from "../utils/formatadores";
import type { RegistroBanco } from "../types/banco.types";

interface GraficoTempoProps {
  dados: RegistroBanco[];
}

export default function GraficoTempo({ dados }: GraficoTempoProps) {
  return (
    <ResponsiveContainer width="100%" height={560}>
      <AreaChart
        data={dados.slice(-50)}
        margin={{ top: 10, right: 30, left: 10, bottom: 10 }}
      >
        <defs>
          <linearGradient id="gradientTempo" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#B4F22E" stopOpacity={0.35} />
            <stop offset="40%" stopColor="#B4F22E" stopOpacity={0.15} />
            <stop offset="100%" stopColor="#B4F22E" stopOpacity={0.02} />
          </linearGradient>
          <filter id="glowVerde" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <CartesianGrid stroke="#1a2035" strokeDasharray="none" />
        <XAxis
          dataKey="disparado_em"
          angle={-45}
          textAnchor="end"
          height={80}
          tickFormatter={formatarHora}
          tick={{ fill: "#6b7280", fontSize: 11 }}
          interval={0}
          axisLine={{ stroke: "#1a2035" }}
          tickLine={{ stroke: "#1a2035" }}
        />
        <YAxis
          domain={[100, 1000]}
          ticks={[100, 200, 300, 400, 500, 600, 700, 800, 900, 1000]}
          tick={{ fill: "#6b7280", fontSize: 12 }}
          axisLine={{ stroke: "#1a2035" }}
          tickLine={{ stroke: "#1a2035" }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Area
          type="monotone"
          dataKey="tempo"
          stroke="#B4F22E"
          strokeWidth={2.5}
          fill="url(#gradientTempo)"
          isAnimationActive={true}
          animationDuration={2000}
          animationEasing="ease-in-out"
          animationBegin={0}
          dot={(props: any) => {
            const { cx, cy, payload } = props;
            let fill = "#B4F22E";
            let r = 3.5;

            if (payload.erro) {
              fill = "#FF2F2F";
              r = 5;
            } else if (payload.tempo > 500) {
              fill = "#FFDE2F";
              r = 4.5;
            }

            return (
              <circle
                key={`dot-${cx}-${cy}`}
                cx={cx}
                cy={cy}
                r={r}
                fill={fill}
                stroke={fill}
                strokeWidth={1.5}
                strokeOpacity={0.6}
                filter={payload.tempo > 500 ? undefined : "url(#glowVerde)"}
              />
            );
          }}
          activeDot={{
            r: 6,
            fill: "#B4F22E",
            stroke: "#B4F22E",
            strokeWidth: 2,
            strokeOpacity: 0.4,
            filter: "url(#glowVerde)",
          }}
        />
        <ReferenceLine
          y={200}
          stroke="#B4F22E"
          strokeDasharray="8 6"
          strokeOpacity={0.25}
          label={{
            value: "Ideal",
            position: "right",
            fill: "#B4F22E",
            fontSize: 10,
            opacity: 0.4,
          }}
        />
        <ReferenceLine
          y={500}
          stroke="#FFDE2F"
          strokeDasharray="8 6"
          strokeOpacity={0.25}
          label={{
            value: "Lento",
            position: "right",
            fill: "#FFDE2F",
            fontSize: 10,
            opacity: 0.4,
          }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export function ScoreTrendChart({ data }: { data: { label: string; score: number; date: string }[] }) {
  return (
    <div className="h-56 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, left: -22, bottom: 0 }}>
          <defs>
            <linearGradient id="scoreFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#375ff8" stopOpacity={0.35} />
              <stop offset="100%" stopColor="#375ff8" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="#eceef2" vertical={false} />
          <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "#8794ae" }} />
          <YAxis domain={[0, 100]} tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "#8794ae" }} width={44} />
          <Tooltip
            cursor={{ stroke: "#bdcfff", strokeWidth: 1 }}
            contentStyle={{
              borderRadius: 12,
              border: "1px solid #eceef2",
              fontSize: 12,
              boxShadow: "0 8px 24px -12px rgba(16,24,40,.25)",
            }}
            labelFormatter={(_l, p) => {
              const d = p?.[0]?.payload?.date;
              return d ? new Date(d).toLocaleDateString("en-NG", { day: "numeric", month: "short" }) : "";
            }}
            formatter={(v) => [`${v as number}%`, "Score"] as [string, string]}
          />
          <Area
            type="monotone"
            dataKey="score"
            stroke="#1f3fed"
            strokeWidth={2.5}
            fill="url(#scoreFill)"
            dot={{ r: 3, fill: "#1f3fed", strokeWidth: 0 }}
            activeDot={{ r: 5 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function SubjectBarChart({ data }: { data: { subject: string; accuracy: number }[] }) {
  const color = (v: number) => (v >= 70 ? "#10b981" : v >= 50 ? "#f59e0b" : "#f43f5e");
  return (
    <div className="w-full" style={{ height: Math.max(160, data.length * 42) }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 4, right: 28, left: 4, bottom: 4 }}>
          <CartesianGrid stroke="#eceef2" horizontal={false} />
          <XAxis type="number" domain={[0, 100]} tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "#8794ae" }} />
          <YAxis
            type="category"
            dataKey="subject"
            width={110}
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 11, fill: "#535e7b" }}
          />
          <Tooltip
            cursor={{ fill: "#f6f7f9" }}
            contentStyle={{ borderRadius: 12, border: "1px solid #eceef2", fontSize: 12 }}
            formatter={(v) => [`${v as number}%`, "Accuracy"] as [string, string]}
          />
          <Bar dataKey="accuracy" radius={[0, 6, 6, 0]} barSize={16}>
            {data.map((d) => (
              <Cell key={d.subject} fill={color(d.accuracy)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

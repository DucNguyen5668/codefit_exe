import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload?.length) {
        return (
            <div style={{
                background: "var(--bg-card)", border: "1px solid var(--border-color)",
                borderRadius: "var(--radius-md)", padding: "10px 14px", fontSize: "0.85rem",
            }}>
                <p style={{ color: "var(--text-secondary)", marginBottom: 4 }}>{label}</p>
                {payload.map((p) => (
                    <p key={p.name} style={{ color: p.color, fontWeight: 600 }}>
                        {p.name}: {p.value}
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

export default function ProgressChart({ data, type = "area" }) {
    if (!data || data.length === 0) return (
        <div style={{ textAlign: "center", padding: 40, color: "var(--text-muted)" }}>No data yet</div>
    );

    if (type === "bar") {
        return (
            <ResponsiveContainer width="100%" height={220}>
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="date" tick={{ fill: "var(--text-muted)", fontSize: 11 }} />
                    <YAxis tick={{ fill: "var(--text-muted)", fontSize: 11 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="submits" fill="#6c63ff" radius={[4, 4, 0, 0]} name="Submits" />
                </BarChart>
            </ResponsiveContainer>
        );
    }

    return (
        <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={data}>
                <defs>
                    <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6c63ff" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#6c63ff" stopOpacity={0} />
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="date" tick={{ fill: "var(--text-muted)", fontSize: 11 }} />
                <YAxis domain={[0, 100]} tick={{ fill: "var(--text-muted)", fontSize: 11 }} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="score" stroke="#6c63ff" strokeWidth={2}
                    fill="url(#scoreGradient)" name="Score" />
            </AreaChart>
        </ResponsiveContainer>
    );
}

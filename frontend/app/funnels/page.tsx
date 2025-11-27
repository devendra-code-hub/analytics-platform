"use client";

import { useEffect, useState } from "react";
import { getFunnel } from "@/lib/api";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
} from "recharts";

export default function FunnelsPage() {
    const [funnelData, setFunnelData] = useState([]);
    const [loading, setLoading] = useState(true);
    const STEPS = ["page_view", "signup_success", "purchase"];

    useEffect(() => {
        async function fetchFunnel() {
            try {
                const data = await getFunnel(STEPS);
                // Calculate conversion rates
                const processedData = data.map((step: any, index: number) => {
                    const prevCount = index > 0 ? data[index - 1].count : step.count;
                    const conversion = prevCount > 0 ? ((step.count / prevCount) * 100).toFixed(1) : 0;
                    return { ...step, conversion };
                });
                setFunnelData(processedData);
            } catch (error) {
                console.error("Failed to fetch funnel", error);
            } finally {
                setLoading(false);
            }
        }
        fetchFunnel();
    }, []);

    if (loading) return <div>Loading funnel...</div>;

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Conversion Funnel</h2>
                <p className="text-sm text-gray-500 mb-6">
                    Tracking: Page View → Signup Success → Purchase
                </p>

                <div className="h-96">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={funnelData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                            <XAxis type="number" />
                            <YAxis dataKey="step" type="category" width={120} />
                            <Tooltip
                                cursor={{ fill: 'transparent' }}
                                content={({ active, payload }) => {
                                    if (active && payload && payload.length) {
                                        const data = payload[0].payload;
                                        return (
                                            <div className="bg-white p-3 border border-gray-200 shadow-lg rounded-lg">
                                                <p className="font-semibold">{data.step}</p>
                                                <p className="text-indigo-600">Users: {data.count}</p>
                                                <p className="text-sm text-gray-500">Conversion: {data.conversion}%</p>
                                            </div>
                                        );
                                    }
                                    return null;
                                }}
                            />
                            <Bar dataKey="count" fill="#4f46e5" radius={[0, 4, 4, 0]}>
                                {funnelData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={index === 0 ? '#818cf8' : index === 1 ? '#6366f1' : '#4f46e5'} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}

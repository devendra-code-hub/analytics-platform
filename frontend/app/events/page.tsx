"use client";

import { useEffect, useState } from "react";
import { getEvents } from "@/lib/api";

export default function EventsPage() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchEvents() {
            try {
                const data = await getEvents();
                setEvents(data);
            } catch (error) {
                console.error("Failed to fetch events", error);
            } finally {
                setLoading(false);
            }
        }
        fetchEvents();
    }, []);

    if (loading) return <div>Loading events...</div>;

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-800">Recent Events</h2>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-600">
                    <thead className="bg-gray-50 text-gray-900 font-medium">
                        <tr>
                            <th className="px-6 py-3">Event Name</th>
                            <th className="px-6 py-3">User ID</th>
                            <th className="px-6 py-3">URL</th>
                            <th className="px-6 py-3">Time</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {events.map((event: any) => (
                            <tr key={event._id} className="hover:bg-gray-50">
                                <td className="px-6 py-3 font-medium text-indigo-600">{event.eventName}</td>
                                <td className="px-6 py-3">{event.sessionId}</td>
                                <td className="px-6 py-3 text-gray-500">{event.url}</td>
                                <td className="px-6 py-3 text-gray-500">
                                    {new Date(event.timestamp).toLocaleString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

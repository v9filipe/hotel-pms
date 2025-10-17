import React, { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from "recharts";
import {
  Calendar,
  Users,
  CheckSquare,
  Coffee,
  FileText,
  Settings,
  Layers,
  TrendingUp,
  CircleDot,
} from "lucide-react";

// NOTE: This file is a single-file React prototype designed to be used with Tailwind CSS.
// It's intentionally self-contained and focuses on UI/UX, flows, and mock data.
// - Default export is a React component
// - Uses Tailwind classes for styling (Tailwind must be installed in the project)
// - Uses framer-motion for subtle animation
// - Uses recharts for simple charts
// - Replace mock data / API stubs with real endpoints in production

// ---------------------- Mock Data & Utilities ----------------------
const sampleRooms = Array.from({ length: 14 }).map((_, i) => ({
  id: i + 101,
  number: (100 + i + 1).toString(),
  type: i % 3 === 0 ? "Suite" : i % 2 === 0 ? "Double" : "Single",
  status: i % 5 === 0 ? "Dirty" : i % 7 === 0 ? "Maintenance" : "Available",
  price: 80 + (i % 5) * 25,
}));

const sampleReservations = [
  {
    id: "R-1001",
    guest: "Ana Silva",
    room: "101",
    checkin: "2025-10-16",
    checkout: "2025-10-18",
    status: "Checked-in",
    total: 240,
  },
  {
    id: "R-1002",
    guest: "John Carter",
    room: "106",
    checkin: "2025-10-18",
    checkout: "2025-10-20",
    status: "Reserved",
    total: 160,
  },
  {
    id: "R-1003",
    guest: "Li Wei",
    room: "109",
    checkin: "2025-10-19",
    checkout: "2025-10-21",
    status: "Arrival",
    total: 200,
  },
];

const occupancySeries = Array.from({ length: 10 }).map((_, i) => ({
  date: `Oct ${7 + i}`,
  occupancy: Math.floor(40 + Math.random() * 60),
  revenue: Math.floor(2000 + Math.random() * 4000),
}));

// Simple helper to format currency
const fmt = (n) => `€${n.toFixed(2)}`;

// ---------------------- UI Components ----------------------
function StatCard({ title, value, delta, icon: Icon, className = "" }) {
  return (
    <div className={`p-4 rounded-2xl shadow-md bg-white/80 backdrop-blur ${className}`}>
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs text-slate-500">{title}</div>
          <div className="mt-1 text-2xl font-semibold">{value}</div>
          {delta ? (
            <div className="text-sm text-slate-600 mt-1">{delta}</div>
          ) : null}
        </div>
        <div className="p-2 rounded-xl bg-gradient-to-br from-indigo-500 to-pink-500 text-white">
          <Icon size={20} />
        </div>
      </div>
    </div>
  );
}

function SmallButton({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-emerald-400 to-cyan-500 text-white text-sm shadow-sm"
    >
      {children}
    </button>
  );
}

// ---------------------- Main App ----------------------
export default function NewHotelPMSPrototype() {
  const [rooms, setRooms] = useState(sampleRooms);
  const [reservations, setReservations] = useState(sampleReservations);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [filterStatus, setFilterStatus] = useState("All");

  useEffect(() => {
    // mimic fetching: in production replace with real API calls
  }, []);

  const filteredRooms = useMemo(() => {
    return rooms.filter((r) => {
      if (filterStatus !== "All" && r.status !== filterStatus) return false;
      if (!query) return true;
      return r.number.includes(query) || r.type.toLowerCase().includes(query.toLowerCase());
    });
  }, [rooms, query, filterStatus]);

  function quickCheckIn(res) {
    // small mock update
    setReservations((prev) =>
      prev.map((p) => (p.id === res.id ? { ...p, status: "Checked-in" } : p))
    );
    // mark room as occupied
    setRooms((prev) => prev.map((r) => (r.number === res.room ? { ...r, status: "Occupied" } : r)));
  }

  function quickClean(roomNumber) {
    setRooms((prev) => prev.map((r) => (r.number === roomNumber ? { ...r, status: "Available" } : r)));
  }

  // simple metrics
  const metrics = useMemo(() => {
    const occupied = rooms.filter((r) => r.status === "Occupied").length;
    const available = rooms.filter((r) => r.status === "Available").length;
    const dirty = rooms.filter((r) => r.status === "Dirty").length;
    const adr = (reservations.reduce((s, r) => s + r.total, 0) / Math.max(reservations.length, 1)).toFixed(2);
    return { occupied, available, dirty, adr };
  }, [rooms, reservations]);

  // ---------------------- Layout ----------------------
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-rose-50 p-6 text-slate-800">
      <div className="max-w-7xl mx-auto">
        <header className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="rounded-full w-12 h-12 bg-gradient-to-br from-indigo-600 to-pink-500 flex items-center justify-center text-white font-bold text-xl shadow">NH</div>
            <div>
              <div className="text-lg font-bold">NewHotel — Clean Cloud PMS</div>
              <div className="text-sm text-slate-500">Faster · Cleaner · More colorful</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <input
              placeholder="Search rooms, type, guest..."
              className="px-3 py-2 rounded-lg border border-slate-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <SmallButton onClick={() => setActiveTab("Reservations")}>New Reservation</SmallButton>
            <div className="p-2 rounded-lg bg-white shadow-sm flex items-center gap-2">
              <div className="text-sm">Lisbon</div>
              <div className="text-xs text-slate-400">• Oct 17, 2025</div>
            </div>
          </div>
        </header>

        <main className="grid grid-cols-12 gap-6">
          <aside className="col-span-3 bg-white/60 rounded-2xl p-4 shadow-md sticky top-6 h-[70vh] overflow-auto">
            <nav className="space-y-3">
              {[
                "Dashboard",
                "Front Desk",
                "Reservations",
                "Housekeeping",
                "POS",
                "Reports",
                "Settings",
              ].map((t) => (
                <button
                  key={t}
                  onClick={() => setActiveTab(t)}
                  className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-3 hover:bg-slate-100 transition-colors ${
                    activeTab === t ? "bg-indigo-50 border-l-4 border-indigo-400 font-semibold" : ""
                  }`}
                >
                  <span className="w-6">
                    {t === "Dashboard" && <TrendingUp size={16} />}
                    {t === "Front Desk" && <CheckSquare size={16} />}
                    {t === "Reservations" && <Calendar size={16} />}
                    {t === "Housekeeping" && <Coffee size={16} />}
                    {t === "POS" && <FileText size={16} />}
                    {t === "Reports" && <Layers size={16} />}
                    {t === "Settings" && <Settings size={16} />}
                  </span>
                  {t}
                </button>
              ))}
            </nav>

            <div className="mt-4">
              <div className="text-xs text-slate-500 mb-2">Quick filters</div>
              <div className="flex flex-wrap gap-2">
                {[
                  "All",
                  "Available",
                  "Occupied",
                  "Dirty",
                  "Maintenance",
                ].map((s) => (
                  <button
                    key={s}
                    onClick={() => setFilterStatus(s)}
                    className={`px-3 py-1 rounded-lg text-sm ${filterStatus === s ? "bg-indigo-500 text-white" : "bg-white/90"}`}>
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <div className="text-xs text-slate-500 mb-2">Quick actions</div>
              <div className="flex flex-col gap-2">
                <SmallButton onClick={() => alert("Open quick arrival modal (stub)")}>Quick Check-in</SmallButton>
                <SmallButton onClick={() => alert("Open group booking modal (stub)")}>Group Booking</SmallButton>
                <SmallButton onClick={() => alert("Open billing / master folio (stub)")}>Master Folio</SmallButton>
              </div>
            </div>
          </aside>

          <section className="col-span-9">
            {activeTab === "Dashboard" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <div className="grid grid-cols-4 gap-4">
                  <StatCard title="Occupied" value={`${metrics.occupied}/${rooms.length}`} delta="vs yesterday +3%" icon={Users} />
                  <StatCard title="Available" value={`${metrics.available}`} delta={null} icon={CircleDot} />
                  <StatCard title="Dirty / Maintenance" value={`${metrics.dirty}`} icon={Coffee} />
                  <StatCard title="Avg Daily Rate" value={fmt(Number(metrics.adr))} icon={TrendingUp} />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-2 bg-white/80 rounded-2xl p-4 shadow-md">
                    <div className="flex items-center justify-between">
                      <div className="font-semibold">Occupancy & Revenue (last 10 days)</div>
                      <div className="text-sm text-slate-500">Auto-refresh every minute</div>
                    </div>

                    <div className="h-64 mt-3">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={occupancySeries}>
                          <XAxis dataKey="date" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Line type="monotone" dataKey="occupancy" stroke="#6366f1" strokeWidth={3} dot={{ r: 2 }} />
                          <Line type="monotone" dataKey="revenue" stroke="#06b6d4" strokeWidth={3} dot={false} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="col-span-1 bg-white/80 rounded-2xl p-4 shadow-md">
                    <div className="font-semibold mb-3">Today's Arrivals</div>
                    <div className="space-y-3">
                      {reservations.map((r) => (
                        <div key={r.id} className="p-3 rounded-lg bg-slate-50 flex items-center justify-between">
                          <div>
                            <div className="font-medium">{r.guest}</div>
                            <div className="text-xs text-slate-500">{r.room} • {r.status}</div>
                          </div>
                          <div className="flex flex-col items-end gap-1">
                            <div className="text-sm font-semibold">{fmt(r.total)}</div>
                            <div className="text-xs">
                              <button onClick={() => quickCheckIn(r)} className="text-xs text-indigo-600">Check-in</button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="bg-white/80 rounded-2xl p-4 shadow-md">
                  <div className="font-semibold mb-3">Rooms Overview</div>
                  <div className="grid grid-cols-4 gap-3">
                    {filteredRooms.map((room) => (
                      <div key={room.id} className="p-3 rounded-xl bg-gradient-to-br from-white to-slate-50 shadow-sm">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-sm text-slate-500">Room</div>
                            <div className="text-lg font-semibold">{room.number} • {room.type}</div>
                          </div>
                          <div className="text-sm text-right">
                            <div className={`text-xs px-2 py-1 rounded ${room.status === 'Available' ? 'bg-emerald-100 text-emerald-700' : room.status === 'Occupied' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'}`}>{room.status}</div>
                            <div className="mt-2 text-sm font-semibold">{fmt(room.price)}</div>
                          </div>
                        </div>

                        <div className="mt-3 flex items-center gap-2">
                          <button onClick={() => setSelectedRoom(room)} className="text-sm px-2 py-1 rounded bg-indigo-50 border">Open</button>
                          <button onClick={() => quickClean(room.number)} className="text-sm px-2 py-1 rounded bg-emerald-50">Mark Clean</button>
                          <button onClick={() => alert('Open room notes (stub)')} className="text-sm px-2 py-1 rounded bg-slate-50">Notes</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "Reservations" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="font-semibold">Reservations</div>
                  <div className="flex items-center gap-2">
                    <input placeholder="Filter guest or id" className="px-3 py-2 rounded-lg border" />
                    <SmallButton onClick={() => alert('Open new reservation modal (stub)')}>New Reservation</SmallButton>
                  </div>
                </div>

                <div className="bg-white/80 rounded-2xl p-4 shadow-md overflow-auto">
                  <table className="min-w-full text-left text-sm">
                    <thead>
                      <tr className="text-slate-500">
                        <th className="p-2">ID</th>
                        <th className="p-2">Guest</th>
                        <th className="p-2">Room</th>
                        <th className="p-2">Check-in</th>
                        <th className="p-2">Check-out</th>
                        <th className="p-2">Status</th>
                        <th className="p-2">Total</th>
                        <th className="p-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reservations.map((r) => (
                        <tr key={r.id} className="border-t">
                          <td className="p-2">{r.id}</td>
                          <td className="p-2">{r.guest}</td>
                          <td className="p-2">{r.room}</td>
                          <td className="p-2">{r.checkin}</td>
                          <td className="p-2">{r.checkout}</td>
                          <td className="p-2">{r.status}</td>
                          <td className="p-2">{fmt(r.total)}</td>
                          <td className="p-2">
                            <div className="flex gap-2">
                              <button onClick={() => quickCheckIn(r)} className="text-xs px-2 py-1 rounded bg-indigo-50">Check-in</button>
                              <button onClick={() => setReservations((prev) => prev.filter(x => x.id !== r.id))} className="text-xs px-2 py-1 rounded bg-rose-50">Cancel</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === "Housekeeping" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="font-semibold">Housekeeping Queue</div>
                  <SmallButton onClick={() => alert('Assign tasks (stub)')}>Assign</SmallButton>
                </div>

                <div className="bg-white/80 rounded-2xl p-4 shadow-md grid grid-cols-3 gap-4">
                  {rooms.filter(r => r.status === 'Dirty' || r.status === 'Maintenance').map(r => (
                    <div key={r.id} className="p-3 rounded-xl bg-amber-50">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-semibold">Room {r.number}</div>
                          <div className="text-xs text-slate-600">{r.type}</div>
                        </div>
                        <div className="text-sm text-amber-700">{r.status}</div>
                      </div>
                      <div className="mt-3 flex gap-2">
                        <button onClick={() => quickClean(r.number)} className="px-2 py-1 rounded bg-emerald-50 text-sm">Mark Clean</button>
                        <button onClick={() => alert('Open maintenance form (stub)')} className="px-2 py-1 rounded bg-rose-50 text-sm">Report</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "POS" && (
              <div className="space-y-4">
                <div className="font-semibold">POS / Transactions</div>
                <div className="bg-white/80 rounded-2xl p-4 shadow-md">
                  <div className="text-sm text-slate-500">Quick post to folio</div>
                  <div className="mt-3 grid grid-cols-3 gap-3">
                    <div>
                      <input placeholder="Guest or Room #" className="w-full px-3 py-2 rounded-lg border" />
                    </div>
                    <div>
                      <input placeholder="Description" className="w-full px-3 py-2 rounded-lg border" />
                    </div>
                    <div>
                      <input placeholder="Amount" className="w-full px-3 py-2 rounded-lg border" />
                    </div>
                  </div>
                  <div className="mt-3 text-right">
                    <SmallButton onClick={() => alert('Post transaction (stub)')}>Post</SmallButton>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "Reports" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="font-semibold">Reports</div>
                  <div className="text-sm text-slate-500">Export .CSV · Print</div>
                </div>

                <div className="bg-white/80 rounded-2xl p-4 shadow-md">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <div className="text-xs text-slate-500">Occupancy</div>
                      <div className="text-lg font-semibold mt-1">{metrics.occupied}/{rooms.length}</div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-500">ADR</div>
                      <div className="text-lg font-semibold mt-1">{fmt(Number(metrics.adr))}</div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-500">Revenue (period)</div>
                      <div className="text-lg font-semibold mt-1">{fmt(occupancySeries.reduce((s, x) => s + x.revenue, 0))}</div>
                    </div>
                  </div>

                  <div className="mt-4 h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={occupancySeries}>
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="revenue" barSize={14} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "Settings" && (
              <div className="bg-white/80 rounded-2xl p-4 shadow-md">
                <div className="font-semibold">Settings & Integrations</div>
                <div className="mt-3 grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-slate-50">
                    <div className="font-medium">Channels & OTAs</div>
                    <div className="text-sm text-slate-500 mt-2">Connect your Booking.com, Expedia, and Channel Manager here.</div>
                    <div className="mt-3 flex gap-2">
                      <button className="px-3 py-1 rounded bg-indigo-50">Connect</button>
                      <button className="px-3 py-1 rounded bg-rose-50">Disconnect</button>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg bg-slate-50">
                    <div className="font-medium">Security & Backups</div>
                    <div className="text-sm text-slate-500 mt-2">Enable 2FA, encryption, and offsite backups.</div>
                    <div className="mt-3 flex gap-2">
                      <button className="px-3 py-1 rounded bg-emerald-50">Audit Logs</button>
                      <button className="px-3 py-1 rounded bg-indigo-50">Run Backup</button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </section>
        </main>

        {/* Room side panel */}
        {selectedRoom && (
          <div className="fixed right-6 bottom-6 w-96">
            <div className="bg-white/95 rounded-2xl p-4 shadow-2xl">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-slate-500 text-xs">Room</div>
                  <div className="font-semibold text-lg">{selectedRoom.number} — {selectedRoom.type}</div>
                  <div className="text-sm text-slate-600 mt-1">Status: {selectedRoom.status}</div>
                </div>
                <div>
                  <button onClick={() => setSelectedRoom(null)} className="text-slate-400">Close</button>
                </div>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2">
                <button onClick={() => { quickClean(selectedRoom.number); setSelectedRoom(null); }} className="px-3 py-2 rounded bg-emerald-50">Mark Clean</button>
                <button onClick={() => alert('Open maintenance (stub)')} className="px-3 py-2 rounded bg-rose-50">Maintenance</button>
                <button onClick={() => alert('Open notes (stub)')} className="px-3 py-2 rounded bg-indigo-50">Notes</button>
                <button onClick={() => alert('Attach image (stub)')} className="px-3 py-2 rounded bg-slate-50">Attach</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

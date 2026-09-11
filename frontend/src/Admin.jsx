import React, { useEffect, useState } from "react";
import {
  Users,
  UserCheck,
  UserX,
  UserRound,
  CalendarDays,
  RefreshCw,
  Search,
  Menu,
  X,
  LogOut,
} from "lucide-react";

export default function Admin() {
  const [rsvps, setRsvps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // =========================
  // FETCH RSVPS
  // =========================
  const fetchRSVPs = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/rsvp`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch RSVPs");
      }

      setRsvps(data.rsvps || []);
    } catch (error) {
      console.error("Fetch RSVPs Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRSVPs();
  }, []);

  // =========================
  // STATISTICS
  // =========================
  const totalRSVPs = rsvps.length;

  const attending = rsvps.filter(
    (rsvp) => rsvp.attending === "yes"
  ).length;

  const notAttending = rsvps.filter(
    (rsvp) => rsvp.attending === "no"
  ).length;

  const totalGuests = rsvps
    .filter((rsvp) => rsvp.attending === "yes")
    .reduce(
      (total, rsvp) => total + Number(rsvp.guests || 0),
      0
    );

  // =========================
  // SEARCH
  // =========================
  const filteredRSVPs = rsvps.filter((rsvp) => {
    const searchText = search.toLowerCase();

    return (
      rsvp.name?.toLowerCase().includes(searchText) ||
      rsvp.phone?.toLowerCase().includes(searchText)
    );
  });

  // =========================
  // LOGOUT
  // =========================
  const handleLogout = () => {
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800">

      {/* MOBILE HEADER */}
      <div className="sticky top-0 z-40 flex items-center justify-between bg-green-900 px-4 py-4 text-white lg:hidden">
        <button
          onClick={() => setSidebarOpen(true)}
          className="rounded-lg p-2 hover:bg-green-800"
        >
          <Menu size={24} />
        </button>

        <h1 className="text-lg font-semibold">
          Alfred & Pearl
        </h1>

        <div className="w-10" />
      </div>

      {/* SIDEBAR */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 transform bg-green-900 text-white transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen
            ? "translate-x-0"
            : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">

          {/* SIDEBAR HEADER */}
          <div className="flex items-center justify-between border-b border-green-800 px-6 py-6">
            <div>
              <h1 className="text-xl font-bold">
                Alfred & Pearl
              </h1>

              <p className="mt-1 text-sm text-green-200">
                Wedding Admin
              </p>
            </div>

            <button
              onClick={() => setSidebarOpen(false)}
              className="rounded-lg p-2 hover:bg-green-800 lg:hidden"
            >
              <X size={22} />
            </button>
          </div>

          {/* NAVIGATION */}
          <nav className="flex-1 px-4 py-6">

            <button className="flex w-full items-center gap-3 rounded-xl bg-white px-4 py-3 text-left font-medium text-green-900">
              <Users size={20} />
              Dashboard
            </button>

            <button className="mt-2 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-green-100 hover:bg-green-800">
              <UserCheck size={20} />
              Attending
            </button>

            <button className="mt-2 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-green-100 hover:bg-green-800">
              <UserX size={20} />
              Not Attending
            </button>

          </nav>

          {/* LOGOUT */}
          <div className="border-t border-green-800 p-4">
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-green-100 hover:bg-green-800"
            >
              <LogOut size={20} />
              Back to Wedding
            </button>
          </div>

        </div>
      </aside>

      {/* MOBILE OVERLAY */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
        />
      )}

      {/* MAIN CONTENT */}
      <main className="lg:ml-72">

        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">

          {/* PAGE HEADER */}
          <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <p className="text-sm font-medium text-green-700">
                Wedding RSVP Management
              </p>

              <h2 className="mt-1 text-2xl font-bold text-gray-900 sm:text-3xl">
                RSVP Dashboard
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Manage your wedding guest responses.
              </p>
            </div>

            <button
              onClick={fetchRSVPs}
              className="flex items-center justify-center gap-2 rounded-xl bg-green-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-green-800"
            >
              <RefreshCw
                size={18}
                className={loading ? "animate-spin" : ""}
              />
              Refresh
            </button>
          </div>

          {/* STAT CARDS */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

            <div className="rounded-2xl bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">
                    Total RSVPs
                  </p>

                  <h3 className="mt-2 text-3xl font-bold text-gray-900">
                    {totalRSVPs}
                  </h3>
                </div>

                <div className="rounded-xl bg-green-100 p-3 text-green-800">
                  <Users size={24} />
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">
                    Attending
                  </p>

                  <h3 className="mt-2 text-3xl font-bold text-green-700">
                    {attending}
                  </h3>
                </div>

                <div className="rounded-xl bg-green-100 p-3 text-green-800">
                  <UserCheck size={24} />
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">
                    Not Attending
                  </p>

                  <h3 className="mt-2 text-3xl font-bold text-red-600">
                    {notAttending}
                  </h3>
                </div>

                <div className="rounded-xl bg-red-100 p-3 text-red-600">
                  <UserX size={24} />
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">
                    Total Guests
                  </p>

                  <h3 className="mt-2 text-3xl font-bold text-yellow-600">
                    {totalGuests}
                  </h3>
                </div>

                <div className="rounded-xl bg-yellow-100 p-3 text-yellow-700">
                  <UserRound size={24} />
                </div>
              </div>
            </div>

          </div>

          {/* RSVP TABLE */}
          <div className="mt-8 overflow-hidden rounded-2xl bg-white shadow-sm">

            {/* TABLE HEADER */}
            <div className="border-b border-gray-100 p-5">
              <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">

                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    Guest RSVPs
                  </h3>

                  <p className="mt-1 text-sm text-gray-500">
                    All submitted wedding responses
                  </p>
                </div>

                {/* SEARCH */}
                <div className="relative w-full md:w-72">
                  <Search
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type="text"
                    value={search}
                    onChange={(e) =>
                      setSearch(e.target.value)
                    }
                    placeholder="Search guest or phone..."
                    className="w-full rounded-xl border border-gray-200 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-green-700 focus:ring-2 focus:ring-green-100"
                  />
                </div>

              </div>
            </div>

            {/* LOADING */}
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <RefreshCw
                  size={28}
                  className="animate-spin text-green-800"
                />
              </div>
            ) : filteredRSVPs.length === 0 ? (
              <div className="px-5 py-16 text-center">
                <Users
                  size={40}
                  className="mx-auto text-gray-300"
                />

                <p className="mt-4 font-medium text-gray-600">
                  No RSVPs found
                </p>

                <p className="mt-1 text-sm text-gray-400">
                  Guest responses will appear here.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">

                <table className="w-full min-w-[800px] text-left">

                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                        Guest
                      </th>

                      <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                        Phone
                      </th>

                      <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                        Attendance
                      </th>

                      <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                        Guests
                      </th>

                      <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                        Message
                      </th>

                      <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                        Date
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100">

                    {filteredRSVPs.map((rsvp) => (
                      <tr
                        key={rsvp._id}
                        className="transition hover:bg-gray-50"
                      >

                        <td className="px-5 py-4">
                          <div className="font-medium text-gray-900">
                            {rsvp.name}
                          </div>
                        </td>

                        <td className="px-5 py-4 text-sm text-gray-600">
                          {rsvp.phone}
                        </td>

                        <td className="px-5 py-4">
                          {rsvp.attending === "yes" ? (
                            <span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                              Attending
                            </span>
                          ) : (
                            <span className="inline-flex rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
                              Not Attending
                            </span>
                          )}
                        </td>

                        <td className="px-5 py-4 text-sm font-medium text-gray-700">
                          {rsvp.guests}
                        </td>

                        <td className="max-w-xs truncate px-5 py-4 text-sm text-gray-500">
                          {rsvp.message || "—"}
                        </td>

                        <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-500">
                          <div className="flex items-center gap-2">
                            <CalendarDays size={15} />
                            {new Date(
                              rsvp.createdAt
                            ).toLocaleDateString()}
                          </div>
                        </td>

                      </tr>
                    ))}

                  </tbody>

                </table>
              </div>
            )}

          </div>

        </div>

      </main>
    </div>
  );
}
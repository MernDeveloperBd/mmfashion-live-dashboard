// src/views/admin/Users.jsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Pagination from '../pagination/Pagination';
import { FaEye } from 'react-icons/fa6';
import { get_users } from '../../store/Reducers/userReducer';
import api from '../../api/api';
import { toast } from 'react-hot-toast';

const Users = () => {
  const dispatch = useDispatch();
  const { users, totalUsers, loader, errorMessage } = useSelector(state => state.user);
  const { token } = useSelector(state => state.auth);

  const [currentPage, setCurrentPage] = useState(1);
  const [searchValue, setSearchValue] = useState('');
  const [perPage, setPerPage] = useState(10);

  // Modal states
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Referral states
  const [refLoading, setRefLoading] = useState(false);
  const [refSummary, setRefSummary] = useState(null);
  const [refEvents, setRefEvents] = useState([]);
  const [refPage, setRefPage] = useState(1);
  const [refPerPage, setRefPerPage] = useState(10);
  const [refTotal, setRefTotal] = useState(0);

  // Engagement states
  const [engLoading, setEngLoading] = useState(false);
  const [engSummary, setEngSummary] = useState(null);
  const [engSessions, setEngSessions] = useState([]);
  const [engPage, setEngPage] = useState(1);
  const [engPerPage, setEngPerPage] = useState(10);
  const [engTotal, setEngTotal] = useState(0);

  useEffect(() => {
    if (token) {
      dispatch(get_users({
        perPage: parseInt(perPage),
        page: parseInt(currentPage),
        searchValue
      }));
    }
  }, [token, dispatch, perPage, currentPage, searchValue]);

  const avatar = (u) =>
    u?.image ||
    u?.avatar ||
    'https://ui-avatars.com/api/?background=random&name=' + encodeURIComponent(u?.name || 'User');

  const openView = async (user) => {
    setSelectedUser(user);
    setRefPage(1);
    setEngPage(1);
    setViewOpen(true);
    await fetchReferrals(user?._id || user?.id, 1, refPerPage);
    await fetchEngagement(user?._id || user?.id, 1, engPerPage);
  };

  const closeView = () => {
    setViewOpen(false);
    setSelectedUser(null);

    setRefSummary(null);
    setRefEvents([]);
    setRefTotal(0);

    setEngSummary(null);
    setEngSessions([]);
    setEngTotal(0);
  };

  // Esc close + scroll lock
  useEffect(() => {
    if (!viewOpen) return;
    const onKey = (e) => e.key === 'Escape' && closeView();
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [viewOpen]);

  // Referral fetcher
  const fetchReferrals = async (userId, page = refPage, per = refPerPage) => {
    if (!userId) return;
    try {
      setRefLoading(true);
      const { data } = await api.get(`/user/${userId}/referrals?page=${page}&perPage=${per}`, {
        withCredentials: true
      });
      if (data?.error) throw new Error(data.error);

      setRefSummary(data?.summary || null);
      setRefEvents(data?.events?.data || []);
      setRefTotal(data?.events?.total || 0);
      setRefPage(data?.events?.page || page);
      setRefPerPage(data?.events?.perPage || per);
    } catch (e) {
      setRefSummary(null);
      setRefEvents([]);
      setRefTotal(0);
      toast.error(e?.message || 'Failed to load referral details');
    } finally {
      setRefLoading(false);
    }
  };

  // Engagement fetcher
  const fetchEngagement = async (userId, page = engPage, per = engPerPage) => {
    if (!userId) return;
    try {
      setEngLoading(true);
      const { data } = await api.get(`/analytics/user/${userId}/sessions?page=${page}&perPage=${per}`, {
        withCredentials: true
      });
      if (data?.error) throw new Error(data.error);

      setEngSummary(data?.summary || null);
      setEngSessions(data?.sessions?.data || []);
      setEngTotal(data?.sessions?.total || 0);
      setEngPage(data?.sessions?.page || page);
      setEngPerPage(data?.sessions?.perPage || per);
    } catch (e) {
      setEngSummary(null);
      setEngSessions([]);
      setEngTotal(0);
      toast.error(e?.message || 'Failed to load engagement');
    } finally {
      setEngLoading(false);
    }
  };

  const copy = async (text) => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Copied!');
    } catch {
      toast.error('Copy failed');
    }
  };

  const formatDate = (d) => (d ? new Date(d).toLocaleString() : '-');

  const fmtDur = (sec = 0) => {
    const s = Math.max(0, Math.round(sec));
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const r = s % 60;
    return [h ? `${h}h` : null, m ? `${m}m` : null, `${r}s`].filter(Boolean).join(' ');
  };

  const exportCSV = () => {
    if (!refEvents?.length) return toast.error('No data to export');
    const rows = [
      ['Name', 'Email', 'ReferralCode', 'ReferredAt'],
      ...refEvents.map(e => [
        e?.referredUser?.name || '',
        e?.referredUser?.email || '',
        e?.referredUser?.referralCode || '',
        e?.referredAt ? new Date(e.referredAt).toISOString() : ''
      ])
    ];
    const csv = rows.map(r => r.map(v => `"${(v || '').toString().replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const name = (selectedUser?.name || 'user').toString().replace(/\s+/g, '-').toLowerCase();
    a.href = url;
    a.download = `${name}-referrals.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="px-2 md:px-7 md:py-5">
      <div className="w-full bg-[#283046] p-4 rounded-md">
        <div className="flex flex-col md:flex-row gap-3 md:gap-0 md:justify-between md:items-center">
          <h2 className="text-lg font-semibold text-white">All Users</h2>
          <div className="flex items-center gap-3">
            <select
              onChange={(e) => { setPerPage(parseInt(e.target.value)); setCurrentPage(1); }}
              value={perPage}
              className="px-4 py-2 focus:border-indigo-500 outline-none bg-[#283046] border border-slate-700 rounded-md text-[#d0d2d6]"
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
            </select>
            <input
              onChange={e => { setSearchValue(e.target.value); setCurrentPage(1); }}
              value={searchValue}
              type="text"
              placeholder="Search by name or email"
              className="px-4 py-2 focus:border-indigo-500 outline-none bg-[#283046] border border-slate-700 rounded-md text-white"
            />
          </div>
        </div>

        {errorMessage ? <div className="mt-3 text-red-400">{errorMessage}</div> : null}

        <div className="relative overflow-x-auto mt-4">
          <table className="w-full text-sm text-left text-[#d0d2d6]">
            <thead className="text-xs uppercase border-b border-slate-700">
              <tr>
                <th className="py-3 px-2">No</th>
                <th className="py-3 px-2">Avatar</th>
                <th className="py-3 px-2">Name</th>
                <th className="py-3 px-2">Email</th>
                <th className="py-3 px-2">Method</th>
                <th className="py-3 px-2">Role</th>
                <th className="py-3 px-2">Status</th>
                <th className="py-3 px-2">Joined</th>
                <th className="py-3 px-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {loader ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i}>
                    <td className="py-2 px-2"><div className="h-3 w-6 bg-slate-700 animate-pulse rounded" /></td>
                    <td className="py-2 px-2"><div className="h-10 w-10 bg-slate-700 animate-pulse rounded-full" /></td>
                    <td className="py-2 px-2"><div className="h-3 w-28 bg-slate-700 animate-pulse rounded" /></td>
                    <td className="py-2 px-2"><div className="h-3 w-40 bg-slate-700 animate-pulse rounded" /></td>
                    <td className="py-2 px-2"><div className="h-3 w-16 bg-slate-700 animate-pulse rounded" /></td>
                    <td className="py-2 px-2"><div className="h-3 w-16 bg-slate-700 animate-pulse rounded" /></td>
                    <td className="py-2 px-2"><div className="h-3 w-16 bg-slate-700 animate-pulse rounded" /></td>
                    <td className="py-2 px-2"><div className="h-3 w-24 bg-slate-700 animate-pulse rounded" /></td>
                    <td className="py-2 px-2"><div className="h-8 w-8 bg-slate-700 animate-pulse rounded" /></td>
                  </tr>
                ))
              ) : users?.length ? (
                users.map((u, i) => (
                  <tr key={u?._id || i} className="border-b border-slate-800">
                    <td className="py-2 px-2">{(currentPage - 1) * perPage + i + 1}</td>
                    <td className="py-2 px-2">
                      <img className="w-10 h-10 rounded-full object-cover" src={avatar(u)} alt="avatar" />
                    </td>
                    <td className="py-2 px-2">{u?.name}</td>
                    <td className="py-2 px-2">{u?.email}</td>
                    <td className="py-2 px-2 capitalize">{u?.method || '-'}</td>
                    <td className="py-2 px-2 capitalize">{u?.role || 'user'}</td>
                    <td className="py-2 px-2 capitalize">
                      <span className={`px-2 py-1 rounded text-xs ${u?.status === 'active' ? 'bg-emerald-600/20 text-emerald-300' : 'bg-rose-600/20 text-rose-300'}`}>
                        {u?.status || 'active'}
                      </span>
                    </td>
                    <td className="py-2 px-2">
                      {u?.createdAt ? new Date(u.createdAt).toLocaleDateString() : '-'}
                    </td>
                    <td className="py-2 px-2">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openView(u)}
                          className="p-[6px] bg-green-500 rounded hover:shadow-lg hover:shadow-yellow-500/50 cursor-pointer"
                          title="View details"
                          aria-label="View details"
                        >
                          <FaEye />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="py-4 px-2 text-center text-slate-400" colSpan={9}>
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {totalUsers > perPage ? (
          <div className="w-full flex justify-end mt-4">
            <Pagination
              pageNumber={currentPage}
              setPageNumber={setCurrentPage}
              totalItem={totalUsers}
              perPage={perPage}
              showItem={4}
            />
          </div>
        ) : null}
      </div>

      {/* Details + Referral + Engagement Modal */}
      {viewOpen && selectedUser && (
        <div className="fixed inset-0 z-[1000]">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={closeView} />
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <div className="w-full max-w-5xl bg-[#1f2937] text-[#d0d2d6] rounded-lg shadow-2xl border border-slate-700 overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-700">
                <div>
                  <h3 className="text-lg font-semibold">{selectedUser?.name}</h3>
                  <p className="text-xs text-gray-400">{selectedUser?.email}</p>
                  <p className="text-xs text-gray-500">Joined: {selectedUser?.createdAt ? new Date(selectedUser.createdAt).toLocaleString() : '-'}</p>
                </div>
                <button onClick={closeView} className="px-3 py-2 rounded bg-slate-700 hover:bg-slate-600">Close</button>
              </div>

              {/* Body */}
              <div className="p-5 grid grid-cols-1 lg:grid-cols-3 gap-5 max-h-[75vh] overflow-y-auto">
                {/* Left column: User + Referral + Engagement */}
                <div className="lg:col-span-1 space-y-4">
                  {/* User Info */}
                  <div className="rounded border border-slate-700 p-3">
                    <h4 className="text-sm font-semibold mb-2">User Info</h4>
                    <div className="text-sm space-y-1">
                      <div className="flex justify-between"><span className="text-gray-400">Method</span><span className="font-medium capitalize">{selectedUser?.method || '-'}</span></div>
                      <div className="flex justify-between"><span className="text-gray-400">Role</span><span className="font-medium capitalize">{selectedUser?.role || 'user'}</span></div>
                      <div className="flex justify-between"><span className="text-gray-400">Status</span><span className="font-medium capitalize">{selectedUser?.status || 'active'}</span></div>
                    </div>
                  </div>

                  {/* Referral Summary */}
                  <div className="rounded border border-slate-700 p-3">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-semibold">Referral Summary</h4>
                      {!refLoading && (
                        <button
                          onClick={() => fetchReferrals(selectedUser?._id || selectedUser?.id, refPage, refPerPage)}
                          className="text-xs px-2 py-1 rounded bg-slate-700 hover:bg-slate-600"
                        >
                          Refresh
                        </button>
                      )}
                    </div>

                    {refLoading ? (
                      <div className="space-y-2">
                        <div className="h-3 bg-slate-700/60 rounded w-3/4 animate-pulse" />
                        <div className="h-3 bg-slate-700/60 rounded w-2/3 animate-pulse" />
                        <div className="h-3 bg-slate-700/60 rounded w-1/2 animate-pulse" />
                      </div>
                    ) : refSummary ? (
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between"><span className="text-gray-400">Code</span>
                          <span className="font-medium break-all">{refSummary.code || '-'}</span>
                        </div>
                        <div className="flex justify-between items-center gap-2">
                          <span className="text-gray-400">Link</span>
                          <div className="flex-1 text-right">
                            <button onClick={() => copy(refSummary.link)} className="text-xs px-2 py-1 rounded bg-emerald-600 hover:bg-emerald-700">
                              Copy Link
                            </button>
                          </div>
                        </div>
                        <div className="flex justify-between"><span className="text-gray-400">Total Signups</span><span className="font-medium">{refSummary.totalSignups}</span></div>
                        <div className="flex justify-between"><span className="text-gray-400">Balance</span><span className="font-medium">{refSummary.balance}</span></div>
                        <div className="flex justify-between"><span className="text-gray-400">Pending</span><span className="font-medium">{refSummary.pending}</span></div>
                        <div className="pt-2 border-t border-slate-700">
                          <p className="text-xs text-gray-400">Referred By</p>
                          {refSummary.referredBy ? (
                            <div className="text-sm">
                              <div className="font-medium">{refSummary.referredBy.name}</div>
                              <div className="text-gray-400 text-xs">{refSummary.referredBy.email}</div>
                              <div className="text-gray-400 text-xs">Code: {refSummary.referredBy.referralCode || '-'}</div>
                            </div>
                          ) : (<div className="text-sm text-gray-400">N/A</div>)}
                        </div>
                      </div>
                    ) : (
                      <div className="text-sm text-gray-400">No referral info available.</div>
                    )}
                  </div>

                  {/* Engagement Summary */}
                  <div className="rounded border border-slate-700 p-3">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-semibold">Engagement (Time on site)</h4>
                      {!engLoading && (
                        <button
                          onClick={() => fetchEngagement(selectedUser?._id || selectedUser?.id, engPage, engPerPage)}
                          className="text-xs px-2 py-1 rounded bg-slate-700 hover:bg-slate-600"
                        >
                          Refresh
                        </button>
                      )}
                    </div>

                    {engLoading ? (
                      <div className="space-y-2">
                        <div className="h-3 bg-slate-700/60 rounded w-3/4 animate-pulse" />
                        <div className="h-3 bg-slate-700/60 rounded w-2/3 animate-pulse" />
                        <div className="h-3 bg-slate-700/60 rounded w-1/2 animate-pulse" />
                      </div>
                    ) : engSummary ? (
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between"><span className="text-gray-400">Total time</span><span className="font-medium">{fmtDur(engSummary.totalSec)}</span></div>
                        <div className="flex justify-between"><span className="text-gray-400">Avg session</span><span className="font-medium">{fmtDur(engSummary.avgSec)}</span></div>
                        <div className="flex justify-between"><span className="text-gray-400">Sessions</span><span className="font-medium">{engSummary.sessionCount}</span></div>
                        <div className="flex justify-between"><span className="text-gray-400">Last visit</span><span className="font-medium">{engSummary.lastVisitAt ? new Date(engSummary.lastVisitAt).toLocaleString() : '-'}</span></div>
                      </div>
                    ) : (
                      <div className="text-sm text-gray-400">No engagement yet.</div>
                    )}
                  </div>
                </div>

                {/* Right column: Referral events + Sessions */}
                <div className="lg:col-span-2">
                  {/* Referral Events */}
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-semibold">Referral Events</h4>
                    <div className="flex items-center gap-2">
                      <select
                        value={refPerPage}
                        onChange={(e) => {
                          const v = parseInt(e.target.value);
                          setRefPerPage(v);
                          fetchReferrals(selectedUser?._id || selectedUser?.id, 1, v);
                        }}
                        className="px-2 py-1 bg-slate-800 border border-slate-700 rounded text-sm"
                      >
                        <option value="5">5</option>
                        <option value="10">10</option>
                        <option value="20">20</option>
                        <option value="50">50</option>
                      </select>
                      <button onClick={exportCSV} className="text-xs px-2 py-1 rounded bg-indigo-600 hover:bg-indigo-700">Export CSV</button>
                    </div>
                  </div>

                  <div className="border border-slate-700 rounded overflow-hidden">
                    <table className="w-full text-sm text-left">
                      <thead className="text-xs uppercase border-b border-slate-700 bg-slate-800/40">
                        <tr>
                          <th className="py-2 px-3">No</th>
                          <th className="py-2 px-3">Name</th>
                          <th className="py-2 px-3">Email</th>
                          <th className="py-2 px-3">Ref Code</th>
                          <th className="py-2 px-3">Referred At</th>
                        </tr>
                      </thead>
                      <tbody>
                        {refLoading ? (
                          [...Array(5)].map((_, i) => (
                            <tr key={i} className="border-b border-slate-800">
                              <td className="py-2 px-3"><div className="h-3 w-6 bg-slate-700 animate-pulse rounded" /></td>
                              <td className="py-2 px-3"><div className="h-3 w-28 bg-slate-700 animate-pulse rounded" /></td>
                              <td className="py-2 px-3"><div className="h-3 w-44 bg-slate-700 animate-pulse rounded" /></td>
                              <td className="py-2 px-3"><div className="h-3 w-20 bg-slate-700 animate-pulse rounded" /></td>
                              <td className="py-2 px-3"><div className="h-3 w-28 bg-slate-700 animate-pulse rounded" /></td>
                            </tr>
                          ))
                        ) : refEvents?.length ? (
                          refEvents.map((e, i) => (
                            <tr key={e.id || i} className="border-b border-slate-800">
                              <td className="py-2 px-3">{(refPage - 1) * refPerPage + i + 1}</td>
                              <td className="py-2 px-3">{e?.referredUser?.name || '-'}</td>
                              <td className="py-2 px-3">{e?.referredUser?.email || '-'}</td>
                              <td className="py-2 px-3">{e?.referredUser?.referralCode || '-'}</td>
                              <td className="py-2 px-3">{formatDate(e?.referredAt)}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td className="py-4 px-3 text-center text-slate-400" colSpan={5}>No referral events</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  {refTotal > refPerPage && (
                    <div className="w-full flex justify-end mt-3">
                      <Pagination
                        pageNumber={refPage}
                        setPageNumber={(p) => {
                          setRefPage(p);
                          fetchReferrals(selectedUser?._id || selectedUser?.id, p, refPerPage);
                        }}
                        totalItem={refTotal}
                        perPage={refPerPage}
                        showItem={5}
                      />
                    </div>
                  )}

                  {/* Sessions Table */}
                  <div className="mt-6">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-semibold">Sessions</h4>
                      <select
                        value={engPerPage}
                        onChange={(e) => {
                          const v = parseInt(e.target.value);
                          setEngPerPage(v);
                          fetchEngagement(selectedUser?._id || selectedUser?.id, 1, v);
                        }}
                        className="px-2 py-1 bg-slate-800 border border-slate-700 rounded text-sm"
                      >
                        <option value="5">5</option>
                        <option value="10">10</option>
                        <option value="20">20</option>
                      </select>
                    </div>

                    <div className="border border-slate-700 rounded overflow-hidden">
                      <table className="w-full text-sm">
                        <thead className="text-xs uppercase border-b border-slate-700 bg-slate-800/40">
                          <tr>
                            <th className="py-2 px-3">No</th>
                            <th className="py-2 px-3">Started</th>
                            <th className="py-2 px-3">Last Seen</th>
                            <th className="py-2 px-3">Duration</th>
                            <th className="py-2 px-3">Active</th>
                          </tr>
                        </thead>
                        <tbody>
                          {engLoading ? (
                            [...Array(5)].map((_, i) => (
                              <tr key={i} className="border-b border-slate-800">
                                <td className="py-2 px-3"><div className="h-3 w-6 bg-slate-700 animate-pulse rounded" /></td>
                                <td className="py-2 px-3"><div className="h-3 w-32 bg-slate-700 animate-pulse rounded" /></td>
                                <td className="py-2 px-3"><div className="h-3 w-32 bg-slate-700 animate-pulse rounded" /></td>
                                <td className="py-2 px-3"><div className="h-3 w-16 bg-slate-700 animate-pulse rounded" /></td>
                                <td className="py-2 px-3"><div className="h-3 w-12 bg-slate-700 animate-pulse rounded" /></td>
                              </tr>
                            ))
                          ) : engSessions?.length ? (
                            engSessions.map((s, i) => (
                              <tr key={s._id || i} className="border-b border-slate-800">
                                <td className="py-2 px-3">{(engPage - 1) * engPerPage + i + 1}</td>
                                <td className="py-2 px-3">{s.startedAt ? new Date(s.startedAt).toLocaleString() : '-'}</td>
                                <td className="py-2 px-3">{s.lastSeenAt ? new Date(s.lastSeenAt).toLocaleString() : '-'}</td>
                                <td className="py-2 px-3">{fmtDur(s.durationSec)}</td>
                                <td className="py-2 px-3">
                                  <span className={`px-2 py-0.5 rounded text-xs ${s.active ? 'bg-emerald-600/20 text-emerald-300' : 'bg-slate-600/20 text-slate-300'}`}>
                                    {s.active ? 'Active' : 'Ended'}
                                  </span>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td className="py-3 text-center text-slate-400" colSpan={5}>No sessions</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>

                    {engTotal > engPerPage && (
                      <div className="w-full flex justify-end mt-3">
                        <Pagination
                          pageNumber={engPage}
                          setPageNumber={(p) => {
                            setEngPage(p);
                            fetchEngagement(selectedUser?._id || selectedUser?.id, p, engPerPage);
                          }}
                          totalItem={engTotal}
                          perPage={engPerPage}
                          showItem={5}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
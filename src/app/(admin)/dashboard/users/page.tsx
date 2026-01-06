"use client"

import { useState, useMemo, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Home, ChevronRight } from "lucide-react"
import { getAllUsers } from "@/actions/users"
import Link from "next/link"
import { cn } from "@/lib/utils"

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [sortBy, setSortBy] = useState("date-desc")

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const result = await getAllUsers()
        if (!result.success) {
          setError("Failed to load users")
        } else {
          const userData = (result as { success: boolean; data?: any }).data || []
          setUsers(userData)
        }
      } catch {
        setError("Failed to load users")
      } finally {
        setLoading(false)
      }
    }
    fetchUsers()
  }, [])

  const filteredAndSortedUsers = useMemo(() => {
    const filtered = users.filter((user) => {
      const matchesSearch =
        (user.name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
        (user.email?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
        user._id.toLowerCase().includes(searchTerm.toLowerCase())
      const roleMatch = roleFilter === "all" || user.role?.toLowerCase() === roleFilter
      return matchesSearch && roleMatch
    })

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "date-desc":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case "date-asc":
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        case "name-asc":
          return (a.name || "").localeCompare(b.name || "")
        case "name-desc":
          return (b.name || "").localeCompare(a.name || "")
        default:
          return 0
      }
    })
    return filtered
  }, [users, searchTerm, roleFilter, sortBy])

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-8">
          <div className="w-16 h-16 border-[3px] border-green-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-black text-xl font-medium tracking-tight animate-pulse">Accessing user directory...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white p-12">
        <div className="max-w-2xl mx-auto bg-red-50 border border-red-100 rounded-[2rem] p-12 text-center">
          <h2 className="text-red-600 font-medium text-4xl tracking-tighter mb-4">Access Error</h2>
          <p className="text-red-500/80 text-lg mb-10 font-light">{error}</p>
          <button onClick={() => window.location.reload()} className="px-10 py-4 bg-black text-white rounded-full font-medium hover:bg-gray-900 transition-all">
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Breadcrumb */}
      <div className="pt-6 pb-6 border-b border-gray-100">
        <div className="container mx-auto px-6 max-w-7xl">
          <nav className="flex items-center space-x-3 text-sm">
            <Link href="/" className="text-gray-400 hover:text-black transition-colors flex items-center gap-1.5">
              <Home className="h-4 w-4" />
              <span className="font-medium">Home</span>
            </Link>
            <ChevronRight className="h-3 w-3 text-gray-300" />
            <span className="text-gray-400 font-medium">Admin</span>
            <ChevronRight className="h-3 w-3 text-gray-300" />
            <span className="text-black font-bold uppercase tracking-widest text-[10px]">Users</span>
          </nav>
        </div>
      </div>

      {/* Header Section */}
      <section className="py-10 md:py-20 px-6 bg-white">
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 md:gap-10">
            <div className="max-w-4xl">
              <h1 className="text-black text-4xl sm:text-6xl md:text-8xl font-medium leading-[1.1] md:leading-[0.9] tracking-tighter mb-4 md:mb-8">
                User <br />
                <span className="text-green-600 italic">Directory.</span>
              </h1>
              <p className="text-gray-500 text-lg md:text-2xl leading-relaxed max-w-2xl font-light">
                Manage your community, monitor user roles, and track registration growth across the platform with ease.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-20 md:pb-32">
        {/* Stats Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-12 mb-12 md:mb-20 border-y border-gray-100 py-8 md:py-12">
          <div className="group cursor-default">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-2 md:mb-4 group-hover:text-green-600 transition-colors">Total Users</p>
            <h3 className="text-3xl md:text-7xl font-medium text-black tracking-tighter group-hover:translate-x-2 transition-transform duration-500">{users.length}</h3>
          </div>
          <div className="border-l border-gray-100 pl-4 md:pl-12 group cursor-default">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-2 md:mb-4 group-hover:text-green-600 transition-colors">Administrators</p>
            <h3 className="text-3xl md:text-7xl font-medium text-black tracking-tighter group-hover:translate-x-2 transition-transform duration-500">{users.filter(u => u.role === "admin").length}</h3>
          </div>
          <div className="lg:border-l border-gray-100 lg:pl-12 group cursor-default">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-2 md:mb-4 group-hover:text-green-600 transition-colors">New This Month</p>
            <h3 className="text-3xl md:text-7xl font-medium text-black tracking-tighter group-hover:translate-x-2 transition-transform duration-500">
              {users.filter(u => new Date(u.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length}
            </h3>
          </div>
          <div className="border-l border-gray-100 pl-4 md:pl-12 group cursor-default">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-2 md:mb-4 group-hover:text-green-600 transition-colors">Active Now</p>
            <h3 className="text-3xl md:text-7xl font-medium text-black tracking-tighter group-hover:translate-x-2 transition-transform duration-500">{users.length}</h3>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="mb-12 md:mb-16 space-y-6 md:space-y-8">
          <div className="flex flex-col lg:flex-row gap-4 md:gap-6">
            <div className="relative flex-grow group">
              <Search className="w-5 h-5 absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-300 group-focus-within:text-green-600 transition-colors" />
              <Input
                placeholder="Search by name, email, or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-14 md:h-16 pl-14 pr-6 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:ring-4 focus:ring-green-500/5 focus:border-green-500/20 transition-all text-lg md:text-xl placeholder:text-gray-300"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="h-14 md:h-16 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:ring-4 focus:ring-green-500/5 focus:border-green-500/20 transition-all min-w-[150px] text-sm md:text-base font-medium">
                  <SelectValue placeholder="All Roles" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-gray-100 p-2">
                  <SelectItem value="all" className="rounded-xl py-2 md:py-3 text-sm">All Roles</SelectItem>
                  <SelectItem value="admin" className="rounded-xl py-2 md:py-3 text-sm">Admin</SelectItem>
                  <SelectItem value="user" className="rounded-xl py-2 md:py-3 text-sm">User</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="h-14 md:h-16 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:ring-4 focus:ring-green-500/5 focus:border-green-500/20 transition-all min-w-[150px] text-sm md:text-base font-medium">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-gray-100 p-2">
                  <SelectItem value="date-desc" className="rounded-xl py-2 md:py-3 text-sm">Newest First</SelectItem>
                  <SelectItem value="date-asc" className="rounded-xl py-2 md:py-3 text-sm">Oldest First</SelectItem>
                  <SelectItem value="name-asc" className="rounded-xl py-2 md:py-3 text-sm">Name A-Z</SelectItem>
                  <SelectItem value="name-desc" className="rounded-xl py-2 md:py-3 text-sm">Name Z-A</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Desktop Table - Hidden on Phone */}
        <div className="hidden md:block bg-white rounded-[2rem] border border-gray-100 overflow-hidden shadow-2xl shadow-black/5">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="px-8 py-6 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">User</th>
                  <th className="px-8 py-6 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Contact</th>
                  <th className="px-8 py-6 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Role</th>
                  <th className="px-8 py-6 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Joined</th>
                  <th className="px-8 py-6 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredAndSortedUsers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-8 py-32 text-center">
                      <div className="flex flex-col items-center gap-6">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center">
                          <Search className="w-10 h-10 text-gray-200" />
                        </div>
                        <p className="text-gray-400 text-xl font-light">No users found matching your criteria.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredAndSortedUsers.map((user, index) => (
                    <tr key={user._id || index} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="px-8 py-8">
                        <div className="flex items-center gap-5">
                          <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center text-black font-bold text-lg uppercase border border-gray-100 group-hover:bg-green-600 group-hover:text-white group-hover:border-green-600 transition-all duration-500">
                            {user.name?.charAt(0) || "U"}
                          </div>
                          <div>
                            <div className="text-lg font-medium text-black">{user.name || "Anonymous User"}</div>
                            <div className="text-[10px] text-gray-400 uppercase tracking-[0.2em] mt-1 font-mono">ID: {user._id?.slice(-8)}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-8">
                        <div className="text-base text-gray-600 font-light">{user.email || "—"}</div>
                      </td>
                      <td className="px-8 py-8">
                        <Badge className={cn(
                          "rounded-full px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest border shadow-none",
                          user.role === "admin" 
                            ? "bg-green-50 text-green-600 border-green-100" 
                            : "bg-blue-50 text-blue-600 border-blue-100"
                        )}>
                          {user.role || "user"}
                        </Badge>
                      </td>
                      <td className="px-8 py-8">
                        <div className="text-base font-medium text-black">{user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : "—"}</div>
                        <div className="text-[10px] font-bold text-gray-400 mt-1.5 uppercase tracking-widest">{user.createdAt ? new Date(user.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "—"}</div>
                      </td>
                      <td className="px-8 py-8 text-right">
                        <Badge className="bg-emerald-50 text-emerald-600 border-emerald-100 rounded-full px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest border shadow-none">
                          Active
                        </Badge>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile View - Cards */}
        <div className="md:hidden space-y-4">
          {filteredAndSortedUsers.length === 0 ? (
            <div className="px-8 py-20 text-center bg-gray-50 rounded-[2rem] border border-dashed border-gray-200">
              <p className="text-gray-400">No users found.</p>
            </div>
          ) : (
            filteredAndSortedUsers.map((user, index) => (
              <div 
                key={user._id || index} 
                className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm active:scale-[0.98] transition-all"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-black font-bold text-base uppercase border border-gray-100">
                      {user.name?.charAt(0) || "U"}
                    </div>
                    <div>
                      <div className="text-lg font-bold text-black">{user.name || "Anonymous User"}</div>
                      <div className="text-xs text-gray-500 font-mono tracking-tighter">ID: {user._id?.slice(-8)}</div>
                    </div>
                  </div>
                  <Badge className={cn(
                    "rounded-full px-3 py-1 text-[8px] font-bold uppercase tracking-widest border shadow-none",
                    user.role === "admin" 
                      ? "bg-green-50 text-green-600 border-green-100" 
                      : "bg-blue-50 text-blue-600 border-blue-100"
                  )}>
                    {user.role || "user"}
                  </Badge>
                </div>
                
                <div className="mb-4">
                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Email Address</div>
                  <div className="text-sm text-gray-600">{user.email || "—"}</div>
                </div>

                <div className="flex justify-between items-end pt-4 border-t border-gray-50">
                  <div>
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Joined On</div>
                    <div className="text-sm font-medium text-black">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : "—"}
                    </div>
                  </div>
                  <Badge className="bg-emerald-50 text-emerald-600 border-emerald-100 rounded-full px-3 py-1 text-[8px] font-bold uppercase tracking-widest border shadow-none">
                    Active
                  </Badge>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      </div>
  )
}

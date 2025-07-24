"use client"

import { useState, useMemo, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { UsersIcon, Clock, Hash, Mail, User, Search, Filter } from "lucide-react"
import { getAllUsers } from "@/actions/users"

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
        console.log("Result is: ", result)

        if (!result.success) {
          setError("Failed to load users")
        } else {
          const userData = (result as { success: boolean; data?: any }).data || []
          setUsers(userData)
          console.log("Users are: ", userData)
        }
      } catch  {
        setError("Failed to load users")
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  const filteredAndSortedUsers = useMemo(() => {
    const filtered = users.filter((user) => {
      // Search matches
      const matchesSearch =
        (user.name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
        (user.email?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
        user._id.toLowerCase().includes(searchTerm.toLowerCase())

      // Role matches
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
      <div className="max-w-7xl mx-auto">
        <div className="bg-gray-900/30 border border-gray-800/30 rounded-lg p-6 animate-fade-in">
          <p className="text-gray-300">Loading users...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-6 animate-fade-in">
          <h2 className="text-red-400 font-semibold mb-2 text-xl">Error</h2>
          <p className="text-red-300">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8 animate-fade-in">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
            <UsersIcon className="w-4 h-4 text-blue-400" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Users Management
          </h1>
        </div>
        <p className="text-gray-400 text-lg">Manage and view all registered users</p>
        <div className="flex items-center gap-2 mt-3">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-gray-300">
            Total: <span className="font-semibold text-blue-400">{filteredAndSortedUsers.length}</span> users
          </span>
        </div>
      </div>

      {/* Filters */}
      <Card className="mb-6 bg-gray-900/50 border-gray-800/50 backdrop-blur-sm animate-fade-in">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-medium text-gray-300">Filters & Search</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative group">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-blue-400 transition-colors" />
              <Input
                placeholder="Search by name, email, or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-800/50 border-gray-700/50 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500/20 transition-all"
              />
            </div>

            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="bg-gray-800/50 border-gray-700/50 text-white focus:border-blue-500 focus:ring-blue-500/20 transition-all">
                <SelectValue placeholder="All Roles" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="user">User</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="bg-gray-800/50 border-gray-700/50 text-white focus:border-blue-500 focus:ring-blue-500/20 transition-all">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="date-desc">Newest First</SelectItem>
                <SelectItem value="date-asc">Oldest First</SelectItem>
                <SelectItem value="name-asc">Name A-Z</SelectItem>
                <SelectItem value="name-desc">Name Z-A</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Users Table Header */}
      <div className="bg-gray-900/30 border border-gray-800/30 rounded-t-lg px-6 py-4 mb-0">
        <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-400">
          <div className="col-span-3 flex items-center gap-2">
            <User className="w-4 h-4" />
            Name
          </div>
          <div className="col-span-3 flex items-center gap-2">
            <Mail className="w-4 h-4" />
            Email
          </div>
          <div className="col-span-2 flex items-center gap-2">
            <Hash className="w-4 h-4" />
            Role
          </div>
          <div className="col-span-2 flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Created
          </div>
          <div className="col-span-2">Status</div>
        </div>
      </div>

      {/* Users */}
      {filteredAndSortedUsers.length === 0 ? (
        <Card className="bg-gray-900/30 border-gray-800/30 backdrop-blur-sm rounded-t-none">
          <CardContent className="p-12 text-center">
            <div className="w-16 h-16 bg-gray-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
              <UsersIcon className="w-8 h-8 text-gray-500" />
            </div>
            <p className="text-gray-400 text-lg">No users found matching your criteria.</p>
            <p className="text-gray-500 text-sm mt-2">Try adjusting your filters or search terms.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="bg-gray-900/20 border-x border-b border-gray-800/30 rounded-b-lg">
          {filteredAndSortedUsers.map((user: any, index: number) => (
            <div
              key={user._id || index}
              className="border-b border-gray-800/20 last:border-b-0 hover:bg-gray-900/40 transition-all duration-200 animate-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="px-6 py-4">
                <div className="grid grid-cols-12 gap-4 items-center">
                  {/* Name */}
                  <div className="col-span-3">
                    <div className="text-sm text-white font-medium">{user.name || "—"}</div>
                    <div className="text-xs text-gray-400">ID: {user._id?.slice(-8) || "—"}</div>
                  </div>

                  {/* Email */}
                  <div className="col-span-3">
                    <div className="text-sm text-white truncate">{user.email || "—"}</div>
                  </div>

                  {/* Role */}
                  <div className="col-span-2">
                    <Badge
                      className={`border font-medium px-2 py-1 text-xs w-fit ${
                        user.role === "admin"
                          ? "bg-green-500/20 text-green-400 border-green-500/30"
                          : "bg-blue-500/20 text-blue-400 border-blue-500/30"
                      }`}
                    >
                      {user.role || "user"}
                    </Badge>
                  </div>

                  {/* Created Date */}
                  <div className="col-span-2">
                    <div className="text-sm text-white font-medium">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "—"}
                    </div>
                    <div className="text-xs text-gray-400">
                      {user.createdAt ? new Date(user.createdAt).toLocaleTimeString() : "—"}
                    </div>
                  </div>

                  {/* Status */}
                  <div className="col-span-2">
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30 border font-medium px-2 py-1 text-xs w-fit">
                      Active
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

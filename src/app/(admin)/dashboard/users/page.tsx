import { getAllUsers } from "@/actions/users";

export default async function UsersPage() {
  const result = await getAllUsers();
  console.log("Result is: ", result);

  if (!result.success) {
    return (
      <div className="p-6">
        <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
          <h2 className="text-red-400 font-semibold mb-2">Error</h2>
          <p className="text-red-300">Failed to load users</p>
        </div>
      </div>
    );
  }

  const users = (result as { success: boolean; data?: any }).data || [];
  console.log("Users are: ", users);

  return (
    <div className="p-6 animate-fade-in">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">Users Management</h1>
        <p className="text-gray-400">Manage and view all registered users</p>
      </div>

      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <div className="p-4 border-b border-border">
          <h2 className="text-xl font-semibold text-card-foreground">
            All Users ({users.length})
          </h2>
        </div>

        {users.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-muted-foreground">No users found</p>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left p-4 font-medium text-muted-foreground">
                      Name
                    </th>
                    <th className="text-left p-4 font-medium text-muted-foreground">
                      Email
                    </th>
                    <th className="text-left p-4 font-medium text-muted-foreground">
                      Role
                    </th>
                    <th className="text-left p-4 font-medium text-muted-foreground">
                      Created
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user: any, index: number) => (
                    <tr
                      key={user._id || index}
                      className="border-b border-border hover:bg-muted/30 transition-colors"
                    >
                      <td className="p-4">
                        <div className="font-medium text-card-foreground">
                          {user.name || "-"}
                        </div>
                      </td>
                      <td className="p-4 text-card-foreground">
                        {user.email || "-"}
                      </td>
                      <td className="p-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                            user.role === "admin"
                              ? "bg-green-500/20 text-green-400 border border-green-500/30"
                              : "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                          }`}
                        >
                          {user.role || "user"}
                        </span>
                      </td>
                      <td className="p-4 text-muted-foreground text-sm">
                        {user.createdAt
                          ? new Date(user.createdAt).toLocaleString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden">
              {users.map((user: any, index: number) => (
                <div
                  key={user._id || index}
                  className="p-4 border-b border-border last:border-b-0"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-card-foreground">
                        {user.name || "-"}
                      </h3>
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          user.role === "admin"
                            ? "bg-green-500/20 text-green-400 border border-green-500/30"
                            : "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                        }`}
                      >
                        {user.role || "user"}
                      </span>
                    </div>
                    <p className="text-card-foreground text-sm">
                      {user.email || "-"}
                    </p>
                    <p className="text-muted-foreground text-xs">
                      Created:{" "}
                      {user.createdAt
                        ? new Date(user.createdAt).toLocaleString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "-"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AdminSidebar, AdminMobileHeader } from "@/components/AdminSidebar";
import { Mail, Trash2, User, Search } from "lucide-react";
import { useState } from "react";
import useManageUsers from "@/hooks/useManageUsers";
import Spinner from "@/components/Spinner";
import { Input } from "@/components/ui/input";
import useDelUser from "@/hooks/useDelUser";

const AdminManageUsers = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { data, isLoading, error } = useManageUsers(searchQuery);
  const { mutate: deleteUser } = useDelUser();

  if (isLoading) return <Spinner />;
  if (error) return <p>Something went wrong</p>;

  const handleDelete = (id: number, name: string) => {
    if (window.confirm(`Are you sure you want to delete user "${name}"?`)) {
      deleteUser(id);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-background">
      <AdminMobileHeader />
      <AdminSidebar />

      <main className="flex-1 p-4 md:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-6 md:space-y-8">
          <div className="animate-fade-in-up">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2">
              Manage Users
            </h1>
            <p className="text-sm md:text-base text-muted-foreground">
              View and manage registered users
            </p>
          </div>

          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="grid gap-3 md:gap-4">
            {data?.length === 0 ? (
              <Card className="border-gray-400/40">
                <CardContent className="p-6 text-center text-gray-500">
                  No users found matching "{searchQuery}"
                </CardContent>
              </Card>
            ) : (
              data?.map((user) => (
                <Card
                  key={user.id}
                  className="hover:shadow-lg transition-all border-gray-300/40"
                >
                  <CardContent className="p-4 md:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      <div className="flex items-center gap-3 md:gap-4 flex-1 min-w-0">
                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-linear-to-br from-primary to-violet-300 flex items-center justify-center shrink-0">
                          <User className="w-5 h-5 md:w-6 md:h-6 text-white" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-bold text-base md:text-xl">
                            {user.name}
                          </h3>
                          <div className="flex items-center gap-2 text-sm  text-muted-foreground mt-1">
                            <Mail className="w-3 h-3 md:w-4 md:h-4 shrink-0" />
                            <span>{user.email}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-4 md:gap-10">
                        <div className="flex gap-4 md:gap-6">
                          <div className="text-center">
                            <p className="text-xl md:text-2xl font-bold text-primary">
                              {user.bookingCount}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Bookings
                            </p>
                          </div>
                          <div className="text-center hidden sm:block mt-2">
                            <p className="text-sm font-medium">
                              {new Date(user.createdAt).toLocaleDateString(
                                "en-US",
                                { month: "short", year: "numeric" },
                              )}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Joined
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="destructive"
                            size="icon"
                            className="h-8 w-8 md:h-10 md:w-10 text-white"
                            onClick={() => handleDelete(user.id, user.name)}
                          >
                            <Trash2 className="w-3 h-3 md:w-4 md:h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminManageUsers;

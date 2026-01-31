import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Mail, Phone, Save, ArrowLeft, Lock } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useEditProfile from "@/hooks/useEditProfile";
import useUserDetails from "@/hooks/useUserDetails";
import toast from "react-hot-toast";

const EditProfile = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const userId = Number(id);

  const { data: user, isLoading: loadingUser } = useUserDetails(userId);
  const { mutate, isPending: updating } = useEditProfile();

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    if (user) {
      setProfile({
        name: user.name,
        email: user.email,
        phone: user.contact,
      });
    }
  }, [user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    mutate(
      {
        id: userId,
        data: {
          name: profile.name,
          email: profile.email,
          contact: profile.phone,
        },
      },
      {
        onSuccess: () => {
          toast.success("Profile updated!");
          navigate("/profile");
        },
        onError: () => {
          toast.error("Update failed. Please try again later.");
        },
      },
    );
  };

  if (loadingUser) return <div>Loading...</div>;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-1 pt-24 pb-12">
        <div className="container mx-auto px-4 max-w-2xl">
          {/* Back Button */}
          <Button
            variant="ghost"
            className="mb-6 text-violet-300 hover:text-violet-400"
            onClick={() => navigate("/profile")}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Profile
          </Button>

          <Card className="border-gray-300/70">
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-2xl">Edit Profile</CardTitle>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name */}
                <div className="space-y-2">
                  <Label htmlFor="name" className="flex items-center gap-2">
                    <User className="w-4 h-4 text-muted-foreground" />
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    value={profile.name}
                    onChange={(e) =>
                      setProfile({ ...profile, name: e.target.value })
                    }
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    onChange={(e) =>
                      setProfile({ ...profile, email: e.target.value })
                    }
                    placeholder="Enter your email"
                    required
                  />
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <Label htmlFor="phone" className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={profile.phone}
                    onChange={(e) =>
                      setProfile({ ...profile, phone: e.target.value })
                    }
                    placeholder="Enter your phone number"
                  />
                </div>

                <div className="md:flex gap-4 pt-4 grid grid-rows-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => navigate("/profile")}
                  >
                    Cancel
                  </Button>

                  <Button
                    type="submit"
                    className="flex-1 text-white"
                    disabled={updating}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {updating ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Change Password Button */}
          <Card className="border-gray-300/70 shadow-card mt-6">
            <CardContent className="md:flex items-center justify-between p-6 grid grid-rows-2 gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-full">
                  <Lock className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Password</h3>
                  <p className="text-sm text-muted-foreground">
                    Update your password
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                onClick={() => navigate(`/profile/${user?.id}/change-password`)}
              >
                Change Password
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default EditProfile;

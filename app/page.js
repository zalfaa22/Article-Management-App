"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

    try {
      const response = await fetch(`${baseUrl}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error("Login failed");
      }

      const data = await response.json();
      console.log(data);

      if (!data || !data.access) {
        throw new Error("Token not found in response");
      }

      localStorage.setItem("token", data.access);

      const profileResponse = await fetch(`${baseUrl}/api/auth/me`, {
        headers: {
          Authorization: `Bearer ${data.access}`,
        },
      });

      if (!profileResponse.ok) {
        throw new Error("Failed to fetch user profile");
      }

      const profileData = await profileResponse.json();
      console.log(profileData);

      if (profileData.role === "admin") {
        router.push("/admin/users");
      } else if (profileData.role === "owner") {
        router.push("/owner/profile");
      } else {
        console.warn(
          `Unknown role: ${profileData.role}. Redirecting to default page.`
        );
        router.push("/default");
      }
    } catch (error) {
      console.error("Login failed:", error);
      alert("Login failed. Please check your credentials.");
    }
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-9 sm:px-6 lg:px-8">
        <div className="flex flex-col max-w-md p-6 rounded-md sm:p-10 dark:bg-gray-900 dark:text-gray-100 bg-indigo-100">
          <div className="mb-8 text-center">
            <h1 className="my-3 text-4xl font-bold">Log in</h1>
            <p className="text-sm dark:text-gray-400">
              Log in to access your account
            </p>
          </div>
          <form
            novalidate=""
            action=""
            className="space-y-12"
            onSubmit={handleLogin}
          >
            <div className="space-y-4">
              <div>
                <label for="username" className="block mb-2 text-sm">
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Username"
                  required
                  className="w-full px-3 py-2 border rounded-md dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
                />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <label for="password" className="text-sm">
                    Password
                  </label>
                </div>
                <input
                  type="password"
                  name="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="*****"
                  className="w-full px-3 py-2 border rounded-md dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
                />
              </div>
            </div>
            <div className="space-y-2">
              <div>
                <button
                  type="submit"
                  className="w-full px-8 py-3 font-semibold rounded-md dark:bg-violet-400 dark:text-gray-900 bg-indigo-300"
                >
                  Log in
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

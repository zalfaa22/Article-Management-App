"use client";
import React, { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar";

export default function ProfilePage() {
  const [userDetails, setUserDetails] = useState(null);

  useEffect(() => {
    fetchUserDetails();
  }, []);

  const fetchUserDetails = async () => {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${baseUrl}/api/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch user details");
      }
      const data = await response.json();
      console.log(data);
      setUserDetails(data);
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  return (
    <div className="flex h-screen">
      <Sidebar
        userRole={userDetails?.role}
        userUsername={userDetails?.username}
      />
      <div className="flex-grow p-6">
        <h1 className="text-2xl font-bold mb-4">Profile</h1>
        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="flex text-left w-full">
            <div className="w-28">
              <img
                src="/icons-user-96.png"
                alt="User Icon"
                className="w-full"
              />
            </div>
            <div className="flex flex-col items-start ml-14">
              <div className="mb-8">
                <p className="font-semibold">Username</p>
                <p className="p-2 w-60 mt-2 text-sm bg-slate-200 rounded">
                  {userDetails?.username}
                </p>
              </div>
              <div className="mb-8">
                <p className="font-semibold">Email</p>
                <p className="p-2 w-60 mt-2 text-sm bg-slate-200 rounded">
                  {userDetails?.email}
                </p>
              </div>
              <div className="mb-8">
                <p className="font-semibold">First Name</p>
                <p className="p-2 w-60 mt-2 text-sm bg-slate-200 rounded">
                  {userDetails?.first_name}
                </p>
              </div>
              <div className="mb-8">
                <p className="font-semibold">Last Name</p>
                <p className="p-2 w-60 mt-2 text-sm bg-slate-200 rounded">
                  {userDetails?.last_name}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

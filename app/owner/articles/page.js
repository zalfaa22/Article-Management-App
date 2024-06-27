"use client";
import React, { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar";

export default function ProfilePage() {
  const [articles, setArticles] = useState([]);
  const [userDetails, setUserDetails] = useState(null);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 10;

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
      setUserDetails(data);
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  useEffect(() => {
    const fetchArticles = async () => {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${baseUrl}/api/articles`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch articles");
        }
        const data = await response.json();
        setArticles(data.data);
      } catch (error) {
        console.error("Error fetching articles:", error);
      }
    };

    fetchArticles();
  }, []);

  const indexOfLastArticle = currentPage * articlesPerPage;
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
  const currentArticles = articles.slice(
    indexOfFirstArticle,
    indexOfLastArticle
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const totalPages = Math.ceil(articles.length / articlesPerPage);

  return (
    <div className="flex h-screen">
      <Sidebar
        userRole={userDetails?.role}
        userUsername={userDetails?.username}
      />
      <div className="flex-grow overflow-y-auto">
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-4">Articles</h1>
          <div className="bg-white shadow-md rounded-lg p-6">
            {!selectedArticle ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {currentArticles.map((article) => (
                    <div
                      key={article.id}
                      className="border rounded-lg overflow-hidden shadow-lg cursor-pointer"
                      onClick={() => setSelectedArticle(article)}
                    >
                      <img
                        src={article.image}
                        alt={article.title}
                        className="w-full h-40 object-cover"
                      />
                      <div className="p-4">
                        <h2 className="text-sm font-bold">{article.title}</h2>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-center mt-4">
                  {Array.from({ length: totalPages }, (_, index) => (
                    <button
                      key={index}
                      onClick={() => handlePageChange(index + 1)}
                      className={`mx-1 px-3 py-1 border rounded ${
                        currentPage === index + 1
                          ? "bg-blue-500 text-white"
                          : "bg-white text-gray-700"
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <div>
                <button
                  onClick={() => setSelectedArticle(null)}
                  className="mb-4 text-blue-500"
                >
                  Back to Articles
                </button>
                <div className="border rounded-lg overflow-hidden shadow-lg">
                  <img
                    src={selectedArticle.image}
                    alt={selectedArticle.title}
                    className="w-full h-64 object-cover"
                  />
                  <div className="p-4">
                    <h2 className="text-lg font-bold mb-3 mt-2">
                      {selectedArticle.title}
                    </h2>
                    <p className="text-sm">{selectedArticle.description}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

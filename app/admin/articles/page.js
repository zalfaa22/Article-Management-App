"use client";
import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import DataTable from 'react-data-table-component';

export default function ArticlesPage() {
  const [articles, setArticles] = useState([]);
  const [userDetails, setUserDetails] = useState(null);

  useEffect(() => {
    fetchUserDetails();
  }, []);

  const fetchUserDetails = async () => {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${baseUrl}/api/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch user details');
      }
      const data = await response.json();
      setUserDetails(data); // Set user details
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  useEffect(() => {
    const fetchArticles = async () => {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
      try {
        const token = localStorage.getItem('token'); // Ambil token dari localStorage
        const response = await fetch(`${baseUrl}/api/articles`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch articles');
        }
        const data = await response.json();
        console.log(data)
        setArticles(data.data);
      } catch (error) {
        console.error('Error fetching articles:', error);
      }
    };
  
    fetchArticles();
  }, []);

  const columns = [
    {
        name: 'Image',
        selector: row => row.image,
        sortable: true,
        cell: row => <img src={row.image} alt={row.title} style={{ width: '50px', height: 'auto' }} />,
      },
    {
      name: 'Title',
      selector: row => row.title,
      sortable: true,
    },
    {
      name: 'Status',
      selector: row => row.status,
      sortable: true,
    },
  ];

  return (
    <div className='flex h-screen'>
      {/* <div className='flex'> */}
        <Sidebar userRole={userDetails?.role} userUsername={userDetails?.username}/>
        <div className='flex-grow p-6 overflow-y-auto'>
          <h1 className='text-2xl font-bold mb-4'>Articles</h1>
          <div className='bg-white shadow-md rounded-lg p-6'>
            <DataTable
              columns={columns}
              data={articles}
              pagination
              responsive
              highlightOnHover
            />
          </div>
        </div>
      {/* </div> */}
    </div>
  );
}
// // pages/admin/articles.js
// import { useSession, getSession } from 'next-auth/react';
// import { useEffect, useState } from 'react';
// import axios from 'axios';
// import DataTable from 'react-data-table-component';

// export default function ArticlesPage() {
//   const { data: session, status } = useSession();
//   const [articles, setArticles] = useState([]);

//   useEffect(() => {
//     const fetchData = async () => {
//       const response = await axios.get('http://103.164.54.252:8000/api/articles', {
//         headers: {
//           Authorization: `Bearer ${session?.accessToken}`,
//         },
//       });
//       setArticles(response.data);
//     };

//     if (status === 'authenticated') {
//       fetchData();
//     }
//   }, [session, status]);

//   const columns = [
//     {
//       name: 'Title',
//       selector: 'title',
//       sortable: true,
//     },
//     {
//       name: 'Author',
//       selector: 'author',
//       sortable: true,
//     },
//   ];

//   return (
//     <div className="container mx-auto py-8">
//       <h1 className="text-3xl font-semibold mb-4">Article Management</h1>
//       <DataTable columns={columns} data={articles} pagination />
//     </div>
//   );
// }

// export async function getServerSideProps(context) {
//   const session = await getSession(context);
//   if (!session) {
//     return {
//       redirect: {
//         destination: '/login',
//         permanent: false,
//       },
//     };
//   }
//   return {
//     props: { session },
//   };
// }


"use client";
import React, { useState, useEffect } from 'react';
import Sidebar from '@/app/components/sidebar';
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
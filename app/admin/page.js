// pages/admin/users.js
import { useSession, getSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import DataTable from 'react-data-table-component';

export default function UsersPage() {
  const { data: session, status } = useSession();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get('http://103.164.54.252:8000/api/users', {
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
        },
      });
      setUsers(response.data);
    };

    if (status === 'authenticated') {
      fetchData();
    }
  }, [session, status]);

  const columns = [
    {
      name: 'Username',
      selector: 'username',
      sortable: true,
    },
    {
      name: 'Role',
      selector: 'role',
      sortable: true,
    },
  ];

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-semibold mb-4">User Management</h1>
      <DataTable columns={columns} data={users} pagination />
    </div>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);
  if (!session) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }
  return {
    props: { session },
  };
}

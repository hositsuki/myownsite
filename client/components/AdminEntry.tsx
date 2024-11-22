'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FaCog } from 'react-icons/fa';
import { checkAdminStatus } from '@/services/api';

export default function AdminEntry() {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const verifyAdmin = async () => {
      try {
        const adminStatus = await checkAdminStatus();
        setIsAdmin(adminStatus);
      } catch (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
      }
    };

    verifyAdmin();
  }, []);

  if (!isAdmin) {
    return null;
  }

  return (
    <Link
      href="/admin"
      className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
      title="管理后台"
    >
      <FaCog className="w-5 h-5" />
    </Link>
  );
}

import React from 'react';
import { toast } from 'react-hot-toast';
import { RiLogoutCircleRLine } from 'react-icons/ri';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const navigate = useNavigate();

  const deleteSpecificCookie = (cookieName) => {
    document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  };

  const deleteAllCookies = () => {
    const cookies = document.cookie.split(';');
    cookies.forEach((cookie) => {
      const name = cookie.split('=')[0].trim();
      deleteSpecificCookie(name);
    });

    deleteSpecificCookie('authToken');
  };

  const clearAllLocalStorageAndCookies = () => {
    localStorage.clear();
    sessionStorage.clear();
    deleteAllCookies();

    toast.success('Logged out, storage and cookies cleared.');
    navigate('/login');
  };

  return (
    <button
      onClick={clearAllLocalStorageAndCookies}
      className="flex items-center gap-3 p-3 text-gray-200 hover:bg-gray-700 rounded-lg transition-colors duration-200 w-full"
    >
      <RiLogoutCircleRLine size={18} />

      Logout
    </button>
  );
};

export default Logout;

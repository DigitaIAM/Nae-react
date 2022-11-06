import React from 'react';
import { ImFilesEmpty } from 'react-icons/im';
import { BsBookmarks } from 'react-icons/bs';
import { MdOutlineHome } from 'react-icons/md';
import { FaUserAlt } from 'react-icons/fa';

export const routes = [
  {
    id: 1,
    url: '/documents',
    name: 'Documents',
    icon: <ImFilesEmpty />
  },
  {
    id: 2,
    url: '/',
    name: 'Bookmarks',
    icon: <BsBookmarks />
  },
  {
    id: 3,
    url: '/',
    name: 'Home',
    icon: <MdOutlineHome />
  },
  {
    id: 4,
    url: '/',
    name: 'User',
    icon: <FaUserAlt />
  }
];

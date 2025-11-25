import React from 'react';
import Navbar from './Navbar';

function Header() {
  // Header público sempre usa o Navbar com role 'guest'
  return <Navbar userRole="guest" />;
}

export default Header;

import React from 'react';
import Menubar from './Menubar';
import Playlistbar from './Playlistbar';

const Sidebar = () => {
  return (
    <aside className="sidebar-section grow-0 flex flex-col gap-2 overflow-hidden">
      <Menubar />
      <Playlistbar />
    </aside>
  )
}

export default Sidebar
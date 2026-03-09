import { createContext, useState } from 'react';

export const SidebarContext = createContext({
  open: false,
  toggleOpen: () => {},
});

export const SidebarProvider = ({ children }) => {
  const [open, setOpen] = useState(false);
  const toggleOpen = () => setOpen((prev) => !prev);

  return (
    <SidebarContext.Provider value={{ open, toggleOpen }}>
      {children}
    </SidebarContext.Provider>
  );
};

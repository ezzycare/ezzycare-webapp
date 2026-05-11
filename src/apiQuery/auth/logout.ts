export const handleLogout = async () => {
  try {
    await fetch('/api/auth/logout', {
      method: 'POST',
    });
    window?.location?.reload();
  } catch (error) {}
};

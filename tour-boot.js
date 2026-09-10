(() => {
  try {
    if (localStorage.getItem('tile-tutorial-seen-v1') !== 'yes') document.documentElement.classList.add('tile-tour-pending');
  } catch {
    document.documentElement.classList.add('tile-tour-pending');
  }
})();

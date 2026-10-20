(() => {
  try {
    if (localStorage.getItem('tile-tutorial-seen-v1') !== 'yes') document.documentElement.classList.add('tile-tour-pending');
  } catch {
    document.documentElement.classList.add('tile-tour-pending');
  }
  try {
    if (sessionStorage.getItem('tile-reset-reveal') === '1') {
      sessionStorage.removeItem('tile-reset-reveal');
      document.documentElement.classList.add('tile-reset-returning');
    }
  } catch {
    // A blocked session store must never leave the page covered.
  }
})();

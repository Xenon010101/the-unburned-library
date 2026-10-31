(() => {
  if (location.protocol === 'file:' || window.top !== window.self || new URLSearchParams(location.search).has('standalone')) return;

  const page = `${location.pathname.split('/').pop() || 'home.html'}${location.search}${location.hash}`;
  const shell = new URL('index.html', location.href);
  shell.searchParams.set('page', page);
  location.replace(shell);
})();

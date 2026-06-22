export const THEME_SCRIPT = `(function(){
  var landingRoots = ['/our-doctors','/how-it-works','/blog'];
  var path = window.location.pathname;
  var isLanding = path === '/' || landingRoots.some(function(r){return path === r || path.startsWith(r+'/')});
  if(isLanding) return;
  try {
    var stored = localStorage.getItem('theme-preference');
    if(stored){
      var parsed = JSON.parse(stored);
      var theme = parsed.state ? parsed.state.theme : parsed.theme;
      var resolved = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme:dark)').matches) ? 'dark' : 'light';
      if(resolved === 'dark') document.documentElement.classList.add('dark');
    }
  } catch(e){}
})();`;

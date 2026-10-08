const view = document.getElementById('view');
const url = document.getElementById('url');
const opacity = document.getElementById('opacity');
const ct = document.getElementById('ct');

function normalize(input) {
  input = input.trim();
  if (!input) return null;
  if (/^https?:\/\//i.test(input)) return input;
  if (/^[\w-]+(\.[\w-]+)+(\/.*)?$/.test(input) && !/\s/.test(input)) return 'https://' + input;
  return 'https://www.google.com/search?q=' + encodeURIComponent(input);
}

url.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    const target = normalize(url.value);
    if (target) view.loadURL(target);
    url.blur();
  }
});

document.getElementById('back').onclick = () => view.canGoBack() && view.goBack();
document.getElementById('fwd').onclick = () => view.canGoForward() && view.goForward();
document.getElementById('reload').onclick = () => view.reload();
document.getElementById('min').onclick = () => overlay.minimize();
document.getElementById('close').onclick = () => overlay.close();
ct.onclick = () => overlay.setClickThrough(true);
opacity.oninput = () => overlay.setOpacity(opacity.value / 100);

view.addEventListener('did-navigate', (e) => (url.value = e.url));
view.addEventListener('did-navigate-in-page', (e) => e.isMainFrame && (url.value = e.url));

function applyState(s) {
  opacity.value = Math.round(s.opacity * 100);
  ct.classList.toggle('on', s.clickThrough);
}
overlay.onHover((h) => document.body.classList.toggle('hover', h));
url.addEventListener('focus', () => document.body.classList.add('focused'));
url.addEventListener('blur', () => document.body.classList.remove('focused'));

overlay.getState().then(applyState);
overlay.onState(applyState);

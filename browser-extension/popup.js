import { API_KEY_PAGE, shortenUrl } from './src/core.js';

const $ = (id) => document.getElementById(id);
const urlInput = $('url');
const keyInput = $('api-key');
const status = $('status');
const result = $('result');
const shortUrl = $('short-url');
let savedKey = '';

function showStatus(message, success = false) { status.textContent = message; status.className = success ? 'success' : ''; }
async function load() {
  const data = await chrome.storage.local.get(['apiKey', 'pendingUrl']);
  savedKey = data.apiKey || '';
  keyInput.value = savedKey;
  if (data.pendingUrl) { urlInput.value = data.pendingUrl; await chrome.storage.local.remove('pendingUrl'); }
  if (!urlInput.value) {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab?.url?.startsWith('http')) urlInput.value = tab.url;
  }
}
async function submit() {
  const key = keyInput.value.trim();
  $('shorten').disabled = true; result.hidden = true; showStatus('Shortening…');
  try {
    if (key !== savedKey) { await chrome.storage.local.set({ apiKey: key }); savedKey = key; }
    const value = await shortenUrl(urlInput.value, key);
    shortUrl.textContent = value; shortUrl.href = value; result.hidden = false; showStatus('Link created. It is ready to copy.', true);
  } catch (error) { showStatus(error instanceof Error ? error.message : 'Could not shorten this URL.'); }
  finally { $('shorten').disabled = false; }
}
$('shorten').addEventListener('click', submit);
$('remove-key').addEventListener('click', async () => { await chrome.storage.local.remove('apiKey'); savedKey = ''; keyInput.value = ''; showStatus('Saved API key removed.'); });
$('key-help').addEventListener('click', (event) => { event.preventDefault(); chrome.tabs.create({ url: API_KEY_PAGE }); });
$('copy').addEventListener('click', async () => { await navigator.clipboard.writeText(shortUrl.textContent); showStatus('Copied to clipboard.', true); });
load();

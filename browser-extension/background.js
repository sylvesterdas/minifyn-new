const MENU_ID = 'minifyn-shorten-selection';


chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({ id: MENU_ID, title: 'Shorten with MiniFyn', contexts: ['link', 'selection'] });
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  const url = info.linkUrl || info.selectionText;
  if (!url) return;
  await chrome.storage.local.set({ pendingUrl: url });
  // The context-menu click is a user gesture, so the popup can take over the
  // request and present its result/copy controls without page scripting access.
  await chrome.action.openPopup();
});

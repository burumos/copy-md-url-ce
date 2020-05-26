
const id = chrome.contextMenus.create({
  id: 'copy-url',
  title: 'COPY URL',
});

const textarea = document.createElement('textarea');
document.body.appendChild(textarea);

function copy(text) {
  textarea.value = text;
  textarea.select();
  document.execCommand('copy');
}

chrome.contextMenus.onClicked.addListener((obj, tab) => {
  copy(`[${tab.title}](${tab.url})`);
});

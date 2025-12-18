import { useMemo } from 'react';

// Función para escapar HTML y prevenir XSS
function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function formatWhatsAppText(text: string) {  
  let safeText = escapeHtml(text);
  
  safeText = safeText.replace(/(https?:\/\/[^\s]+)/g, (match) => {
    try {
      new URL(match);
      return `<a href="${match}" target="_blank" rel="noopener noreferrer">${match}</a>`;
    } catch {
      return match;
    }
  });
  
  safeText = safeText.replace(/\*(.*?)\*/g, (match, content) => {
    if (content.includes('<a href=')) return match;
    return `<b>${content}</b>`;
  });
  
  safeText = safeText.replace(/_(.*?)_/g, (match, content) => {
    if (content.includes('<a href=')) return match;
    return `<i>${content}</i>`;
  });
  
  safeText = safeText.replace(/~(.*?)~/g, (match, content) => {
    if (content.includes('<a href=')) return match;
    return `<s>${content}</s>`;
  });
  
  safeText = safeText.replace(/`(.*?)`/g, (match, content) => {
    if (content.includes('<a href=')) return match;
    return `<code>${content}</code>`;
  });

  safeText = safeText.replace(/\n/g, '<br/>');
  return safeText;
}

export function useFormattedWhatsAppText(text: string) {
  const formattedText = useMemo(() => formatWhatsAppText(text), [text]);
  return formattedText;
}
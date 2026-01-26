/**
 * Function to translate tag names with fallback to last segment
 * 
 * When a tag doesn't have a translation, instead of showing the full key
 * (e.g., "conversations.tags.Cambios y devoluciones"), it extracts and 
 * returns the last segment after the last dot (e.g., "Cambios y devoluciones").
 * 
 * @param t - The translation function from i18next
 * @param tagName - The name of the tag to translate
 * @returns The translated tag name or the last segment if translation doesn't exist
 * 
 * @example
 * const { t } = useTranslation('translations');
 * getTagTranslation(t, 'Necesita atención') // Returns: "Needs Attention" (if translation exists)
 * getTagTranslation(t, 'Cambios y devoluciones') // Returns: "Cambios y devoluciones" (fallback if no translation)
 */
export const getTagTranslation = (t: (key: string) => string, tagName: string): string => {
  if (!tagName) return '';
  
  // Clean tagName if it already has the prefix (shouldn't happen but just in case)
  const cleanTagName = tagName.startsWith('conversations.tags.') 
    ? tagName.replace('conversations.tags.', '') 
    : tagName;
  
  const translationKey = `conversations.tags.${cleanTagName}`;
  const translated = t(translationKey);
  
  // If translation doesn't exist (i18next returns the key), return the clean tag name
  if (translated === translationKey || translated.startsWith('conversations.tags.')) {
    return cleanTagName;
  }
  
  return translated;
};

/**
 * Function to translate reference_id with fallback to the reference_id itself
 * 
 * When a reference_id doesn't have a translation, it returns the reference_id as is.
 * 
 * @param t - The translation function from i18next
 * @param referenceId - The reference_id to translate
 * @returns The translated reference_id or the reference_id itself if translation doesn't exist
 * 
 * @example
 * const { t } = useTranslation('translations');
 * getReferenceIdTranslation(t, 'user_sent_image') // Returns: "El usuario envió una imagen" (if translation exists)
 * getReferenceIdTranslation(t, 'unknown_ref') // Returns: "unknown_ref" (fallback if no translation)
 */
export const getReferenceIdTranslation = (t: (key: string) => string, referenceId: string): string => {
  if (!referenceId) return '';
  
  const translationKey = `conversations.tags.referenceIds.${referenceId}`;
  const translated = t(translationKey);
  
  // If translation doesn't exist, return the reference_id as is
  if (translated === translationKey) {
    return referenceId;
  }
  
  return translated;
};


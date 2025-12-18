import { describe, it, expect, vi } from 'vitest';
import { getTagTranslation } from './useTagTranslation';

describe('getTagTranslation', () => {
  describe('when translation exists', () => {
    it('should return the translated value for a tag with translation', () => {
      const mockT = vi.fn((key: string) => {
        if (key === 'conversations.tags.Necesita atención') {
          return 'Needs Attention';
        }
        return key;
      });

      const result = getTagTranslation(mockT, 'Necesita atención');

      expect(result).toBe('Needs Attention');
      expect(mockT).toHaveBeenCalledWith('conversations.tags.Necesita atención');
    });

    it('should return the translated value for different tag names', () => {
      const mockT = vi.fn((key: string) => {
        const translations: Record<string, string> = {
          'conversations.tags.Urgente': 'Urgent',
          'conversations.tags.Pendiente': 'Pending',
          'conversations.tags.Resuelto': 'Resolved',
        };
        return translations[key] || key;
      });

      expect(getTagTranslation(mockT, 'Urgente')).toBe('Urgent');
      expect(getTagTranslation(mockT, 'Pendiente')).toBe('Pending');
      expect(getTagTranslation(mockT, 'Resuelto')).toBe('Resolved');
    });
  });

  describe('when translation does not exist', () => {
    it('should extract the last segment for a custom tag without translation', () => {
      const mockT = vi.fn((key: string) => key);

      const result = getTagTranslation(mockT, 'Cambios y devoluciones');

      expect(result).toBe('Cambios y devoluciones');
      expect(mockT).toHaveBeenCalledWith('conversations.tags.Cambios y devoluciones');
    });

    it('should extract the last segment when tag name has multiple dots', () => {
      const mockT = vi.fn((key: string) => key);

      const result = getTagTranslation(mockT, 'Tag.With.Multiple.Dots');

      expect(result).toBe('Dots');
      expect(mockT).toHaveBeenCalledWith('conversations.tags.Tag.With.Multiple.Dots');
    });

    it('should return the tag name as-is if it has no dots', () => {
      const mockT = vi.fn((key: string) => key);

      const result = getTagTranslation(mockT, 'SimpleTag');

      expect(result).toBe('SimpleTag');
      expect(mockT).toHaveBeenCalledWith('conversations.tags.SimpleTag');
    });

    it('should handle tag names with spaces correctly', () => {
      const mockT = vi.fn((key: string) => key);

      const result = getTagTranslation(mockT, 'Problemas con envío');

      expect(result).toBe('Problemas con envío');
      expect(mockT).toHaveBeenCalledWith('conversations.tags.Problemas con envío');
    });

    it('should handle tag names with special characters', () => {
      const mockT = vi.fn((key: string) => key);

      const result = getTagTranslation(mockT, 'Devolución & Reembolso');

      expect(result).toBe('Devolución & Reembolso');
      expect(mockT).toHaveBeenCalledWith('conversations.tags.Devolución & Reembolso');
    });
  });

  describe('edge cases', () => {
    it('should return empty string when tagName is undefined', () => {
      const mockT = vi.fn((key: string) => key);

      const result = getTagTranslation(mockT, undefined as any);

      expect(result).toBe('');
      expect(mockT).not.toHaveBeenCalled();
    });

    it('should return empty string when tagName is null', () => {
      const mockT = vi.fn((key: string) => key);

      const result = getTagTranslation(mockT, null as any);

      expect(result).toBe('');
      expect(mockT).not.toHaveBeenCalled();
    });

    it('should return empty string when tagName is empty string', () => {
      const mockT = vi.fn((key: string) => key);

      const result = getTagTranslation(mockT, '');

      expect(result).toBe('');
      expect(mockT).not.toHaveBeenCalled();
    });

    it('should handle tag names with only whitespace', () => {
      const mockT = vi.fn((key: string) => key);

      const result = getTagTranslation(mockT, '   ');

      expect(result).toBe('   ');
      expect(mockT).toHaveBeenCalledWith('conversations.tags.   ');
    });

    it('should handle tag names ending with a dot', () => {
      const mockT = vi.fn((key: string) => key);

      const result = getTagTranslation(mockT, 'TagWithDot.');

      // When the key ends with a dot, lastIndexOf returns the last position
      // but substring would return empty, so it falls back to original tagName
      expect(result).toBe('TagWithDot.');
      expect(mockT).toHaveBeenCalledWith('conversations.tags.TagWithDot.');
    });

    it('should handle very long tag names', () => {
      const mockT = vi.fn((key: string) => key);
      const longTagName = 'A'.repeat(200);

      const result = getTagTranslation(mockT, longTagName);

      expect(result).toBe(longTagName);
      expect(mockT).toHaveBeenCalledWith(`conversations.tags.${longTagName}`);
    });
  });

  describe('real-world scenarios', () => {
    it('should handle a tag that exists in Spanish but is displayed in the app', () => {
      const mockT = vi.fn((key: string) => {
        if (key === 'conversations.tags.Necesita atención') {
          return 'Requiere atención'; // Spanish translation
        }
        return key;
      });

      const result = getTagTranslation(mockT, 'Necesita atención');

      expect(result).toBe('Requiere atención');
    });

    it('should handle a custom tag created by merchant without translation', () => {
      const mockT = vi.fn((key: string) => key);

      const result = getTagTranslation(mockT, 'Cambios y devoluciones');

      // Should show the clean tag name without the prefix
      expect(result).toBe('Cambios y devoluciones');
    });

    it('should handle mixed scenario with multiple tags', () => {
      const mockT = vi.fn((key: string) => {
        const translations: Record<string, string> = {
          'conversations.tags.Necesita atención': 'Needs Attention',
          'conversations.tags.Urgente': 'Urgent',
        };
        return translations[key] || key;
      });

      // Tag with translation
      expect(getTagTranslation(mockT, 'Necesita atención')).toBe('Needs Attention');
      // Tag with translation
      expect(getTagTranslation(mockT, 'Urgente')).toBe('Urgent');
      // Custom tag without translation
      expect(getTagTranslation(mockT, 'Mi Tag Personalizado')).toBe('Mi Tag Personalizado');
    });

    it('should preserve emojis in custom tag names', () => {
      const mockT = vi.fn((key: string) => key);

      const result = getTagTranslation(mockT, '🔥 Oferta Especial');

      expect(result).toBe('🔥 Oferta Especial');
    });

    it('should handle numbers in tag names', () => {
      const mockT = vi.fn((key: string) => key);

      const result = getTagTranslation(mockT, 'Pedido 12345');

      expect(result).toBe('Pedido 12345');
    });
  });

  describe('function behavior', () => {
    it('should return consistent results for the same input', () => {
      const mockT = vi.fn((key: string) => key);

      const result1 = getTagTranslation(mockT, 'Custom Tag');
      const result2 = getTagTranslation(mockT, 'Custom Tag');

      expect(result1).toBe(result2);
      expect(result1).toBe('Custom Tag');
    });

    it('should handle when t function returns the key (default i18next fallback)', () => {
      const mockT = vi.fn((key: string) => key);

      const result = getTagTranslation(mockT, 'NonExistentTag');

      // When no translation exists, i18next returns the key
      // Our function should extract the last segment
      expect(result).toBe('NonExistentTag');
    });

    it('should work with different translation functions', () => {
      const mockT1 = vi.fn(() => 'Translation 1');
      const mockT2 = vi.fn(() => 'Translation 2');

      expect(getTagTranslation(mockT1, 'Tag')).toBe('Translation 1');
      expect(getTagTranslation(mockT2, 'Tag')).toBe('Translation 2');
    });
  });
});

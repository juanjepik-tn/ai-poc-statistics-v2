import { useFormattedWhatsAppText } from '../hooks/use-formatted-whatsapp-text';

const FormattedTextWrapper = ({ text, children }: any) => {
  const formattedText = useFormattedWhatsAppText(text);
  return children(formattedText);
};

export default FormattedTextWrapper;
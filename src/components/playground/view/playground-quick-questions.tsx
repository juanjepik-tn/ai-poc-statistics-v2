import { Box, Button, IconButton } from '@nimbus-ds/components';
import { ChevronLeftIcon, ChevronRightIcon } from '@nimbus-ds/icons';
import { useRef } from 'react';

type Props = {
  isShortView: boolean;
  onQuestionClick: (question: string) => void;
  questions: string[];
};
export default function PlaygroundQuickQuestions({ isShortView, onQuestionClick, questions }: Props) {

  const containerRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({
        left: -200, // Ajusta la cantidad de desplazamiento
        behavior: 'smooth',
      });
    }
  };

  const scrollRight = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({
        left: 200, // Ajusta la cantidad de desplazamiento
        behavior: 'smooth',
      });
    }
  };

  return (

    isShortView ? (
      
      <Box display="flex" flexDirection="row" alignItems="center" padding="1">        
        <IconButton source={<ChevronLeftIcon size="small" />} onClick={scrollLeft} size="1.8rem"/>
        <Box
          ref={containerRef}
          display="flex"
          overflow="hidden"
          flex="1"   
          maxWidth="70vw"  // Ajusta este valor según tus necesidades
          width="715px"               
        >
          {questions.map((question, index) => (
            <Box key={index} marginY="none" marginX="2" width="fit-content" flexShrink="0">
              <Button
                appearance="neutral"
                onClick={() => {
                  onQuestionClick(question);
                }}
                style={{
                  height: '100%',
                  padding: '0.5rem 1rem',
                  borderRadius: '16px',
                  backgroundColor: '#f0f0f0',
                  border: '1px solid #ccc',
                  whiteSpace: 'nowrap',
                }}                
              >
                {question}
              </Button>
            </Box>
          ))}
        </Box>      
        <IconButton source={<ChevronRightIcon size="small" />} onClick={scrollRight} size="1.8rem"/>
      </Box>      
    ) : (
      <Box display="flex" flexWrap="wrap" justifyContent="center">
        {questions.map((question, index) => (
          <Box key={index} margin="1">
            <Button appearance="neutral" onClick={() => {
              onQuestionClick(question);
            }}>
              {question}
            </Button>
          </Box>
        ))}
      </Box>
    )
  )

}


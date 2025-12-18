// @mui
import Avatar from '@mui/material/Avatar';
import ListItemButton from '@mui/material/ListItemButton';
import Typography from '@mui/material/Typography';
// types
//
// import SearchNotFound from 'src/components/search-not-found';
// import { useLocales } from 'src/locales';
// import { IConversation } from 'src/types/conversation';

// ----------------------------------------------------------------------

type Props = {
  searchQuery: string;
  searchResults: any[];
  onClickResult: (contact: any) => void;
};

export default function ConversationNavSearchResults({
  searchQuery,
  searchResults,
  onClickResult,
}: Props) {
  const totalResults = searchResults.length;

  const notFound = !totalResults && !!searchQuery;
  // const { t } = useLocales();

  return (
    <>
      <Typography
        paragraph
        variant="h6"
        sx={{
          px: 2.5,
        }}
      >
        Contactos ({totalResults})
      </Typography>

      {notFound ? (
        <p>No hay resultados</p>
      ) : (
        <>
          {searchResults.map((result) => (
            <ListItemButton
              key={result.id}
              onClick={() => onClickResult(result)}
              sx={{
                px: 2.5,
                py: 1.5,
                typography: 'subtitle2',
              }}
            >
              <Avatar alt={result.name} sx={{ mr: 2 }} />
              {result.name}
            </ListItemButton>
          ))}
        </>
      )}
    </>
  );
}

import ReactDOM from 'react-dom/client';
import App from '@/app';

import '@nimbus-ds/styles/dist/index.css';
import './main.css';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import { AuthProvider } from '@/contexts/AuthContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <AuthProvider>
      <App />
    </AuthProvider>
  </Provider>
);

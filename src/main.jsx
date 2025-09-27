import { lazy, StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter } from "react-router-dom";
import { Provider } from 'react-redux';
import store from './store/store.js';
import { Toaster } from 'react-hot-toast';
const App = lazy(() => import('./App.jsx'))

createRoot(document.getElementById('root')).render(
  
    <BrowserRouter>
      <Provider store={store}>
        <Suspense fallback="loading...">
          <App />
          <Toaster toastOptions={{
            position:'top-right',
            style:{
              background:'#283046',
              color:'white'
            }
          }}/>
        </Suspense>
      </Provider>
    </BrowserRouter>

)



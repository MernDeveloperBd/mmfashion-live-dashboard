

import { lazy, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter } from "react-router-dom";
import { Provider } from 'react-redux';
import store from './store/store.js';
import { Toaster } from 'react-hot-toast';

const App = lazy(() => import('./App.jsx'))

createRoot(document.getElementById('root')).render(
    <Provider store={store}>
        <BrowserRouter>
            <Suspense fallback={
                <div className="flex items-center justify-center min-h-screen">
                    Loading...
                </div>
            }>
                <App />
                <Toaster
                    position="top-right"
                    toastOptions={{
                        style: {
                            background: '#283046',
                            color: 'white'
                        }
                    }}
                />
            </Suspense>
        </BrowserRouter>
    </Provider>
);


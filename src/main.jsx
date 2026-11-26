import React from 'react';
import { hydrateRoot, createRoot } from 'react-dom/client';
import App from './App.jsx';
import { routeFromUrl } from './site-paths.js';
import './styles.css';

const root = document.getElementById('root');
const element = <App path={routeFromUrl(window.location.pathname)} />;
if (root.querySelector('main')) hydrateRoot(root, element);
else createRoot(root).render(element);

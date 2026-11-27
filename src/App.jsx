import React from 'react';
import City from './pages/City.jsx';
import Catalog from './pages/Catalog.jsx';
import { catalogRoute } from './data.js';

export default function App({path='/'}) {
 const route=path.replace(/\\/g,'/').replace(/\/+$/,'') || '/';
 if(route===catalogRoute.slice(0, -1)) return <Catalog/>;
 return <City/>;
}

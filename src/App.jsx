import React from 'react';
import City from './pages/City.jsx';
import Studio from './pages/Studio.jsx';
import Signal from './pages/Signal.jsx';
import Catalog from './pages/Catalog.jsx';
import { catalogRoute } from './data.js';

export default function App({path='/'}) {
 const route=path.replace(/\\/g,'/').replace(/\/+$/,'') || '/';
 if(route==='/city') return <City/>;
 if(route==='/studio') return <Studio/>;
 if(route==='/signal') return <Signal/>;
 if(route===catalogRoute.slice(0, -1)) return <Catalog/>;
 return <City/>;
}

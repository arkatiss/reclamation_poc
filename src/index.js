import React from 'react';
import ReactDOM from 'react-dom/client';
import './App.scss';
import reportWebVitals from './reportWebVitals';
import {
  HashRouter,
  Routes,
  Route,
} from "react-router-dom";
import LayoutComponent from './layoutComponent/layoutComponent';
import 'bootstrap/dist/css/bootstrap.min.css';
import HomeComponent from './components/Home/homeComponent';
import CustomerSetupComponent from '../src/components/CustomerSetup/customerSetupComponent';
import { Provider } from 'react-redux';
import { store, persistor } from './store';
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import ItemComponent from './components/Item/itemComponent';
import VendorComponent from './components/Vendor/vendorComponent';
import RulesComponent from './components/Rules/RulesComponent';
import ScanSetupComponent from './components/ScanSetup/ScanSetupComponent';
import ValueMapComponent from './components/ValueMap/ValueMapComponent';
import ReportsComponent from './components/Reports/ReportsComponent';
import { PersistGate } from 'redux-persist/lib/integration/react';
import SettingsComponent from './components/Settings/SettingsComponent';
import LoginComponent from './components/Login/LoginComponent';
import Auth from './services/Auth'
import DashboardComponent from './components/dashboard/dashboardComponent';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
    <HashRouter>
    <Routes>
          <Route path="/login" element={<Auth element={<LoginComponent />} redirectTo="/login" />} />
          <Route path="/" element={<Auth element={<LayoutComponent />} redirectTo="/" />}>
            <Route path="home" element={<Auth element={<HomeComponent />} redirectTo="home" />} />
            <Route path="customerSetup" element={<Auth element={<CustomerSetupComponent />} redirectTo="customerSetup" />} />
            <Route path="itemSetup" element={<Auth element={<ItemComponent />} redirectTo="itemSetup" />} />
            <Route path="vendorSetup" element={<Auth element={<VendorComponent />} redirectTo="vendorSetup" />} />
            <Route path="rulesSetup" element={<Auth element={<RulesComponent />} redirectTo="rulesSetup" />} />
            <Route path="scanSetup" element={<Auth element={<ScanSetupComponent />} redirectTo="scanSetup" />} />
            <Route path="valueMap" element={<Auth element={<ValueMapComponent />} redirectTo="valueMap" />} />
            <Route path="reports" element={<Auth element={<ReportsComponent />} redirectTo="reports" />} />
            <Route path="settings" element={<Auth element={<SettingsComponent />} redirectTo="settings" />} />
            <Route path="dashboard" element={<Auth element={<DashboardComponent />} redirectTo="dashboard" />} />

            {/* <Route path="division" element={<Auth element={<DivivionComponent />} redirectTo="division" />} /> */}
          </Route>
        </Routes>
  </HashRouter>
  </PersistGate>
    </Provider>
);
// If you want to start measuring performance in your app, pass a function
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

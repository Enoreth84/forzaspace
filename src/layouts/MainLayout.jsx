import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { Home, Pill, Droplets, Smile, Scale } from 'lucide-react';

export default function MainLayout() {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <main className="container" style={{ marginBottom: '80px' }}>
                <Outlet />
            </main>

            <nav className="nav-bar">
                <NavLink to="/" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <Home size={24} />
                    <span>Home</span>
                </NavLink>
                <NavLink to="/log/medicine" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <Pill size={24} />
                    <span>Meds</span>
                </NavLink>
                <NavLink to="/log/excretion" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <Droplets size={24} />
                    <span>Bisogni</span>
                </NavLink>
                <NavLink to="/log/mood" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <Smile size={24} />
                    <span>Umore</span>
                </NavLink>
                <NavLink to="/log/weight" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <Scale size={24} />
                    <span>Peso</span>
                </NavLink>
            </nav>
        </div>
    );
}

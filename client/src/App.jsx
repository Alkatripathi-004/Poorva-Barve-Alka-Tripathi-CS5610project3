// src/App.jsx
import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Layout from './components/Layout.jsx'; // Use .jsx for clarity
import HomePage from './pages/HomePage.jsx';
import SelectionPage from './pages/SelectionPage.jsx';
import GamePage from './pages/GamePage.jsx';
import RulesPage from './pages/RulesPage.jsx';
import ScoresPage from './pages/ScoresPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';

const router = createBrowserRouter([
    {
        path: '/',
        element: <Layout />,
        children: [
            // CORRECTED: This 'index' route tells the router to render HomePage at the root URL ('/').
            { 
                index: true, 
                element: <HomePage /> 
            },
            { 
                path: 'games', 
                element: <SelectionPage /> 
            },
            {
                path: 'game/:gameId',
                element: <GamePage />
            },
            { 
                path: 'rules', 
                element: <RulesPage /> 
            },
            { 
                path: 'scores', 
                element: <ScoresPage /> 
            },
            { 
                path: 'login', 
                element: <LoginPage /> 
            },
            { 
                path: 'register', 
                element: <RegisterPage /> 
            },
        ]
    }
]);

function App() {
    return <RouterProvider router={router} />;
}

export default App;
import React, { createContext, useState, useMemo, useEffect } from 'react';
import authService from '../services/auth'; // On importe notre nouveau service

// Création du contexte
export const AuthContext = createContext(null);

// Création du fournisseur de contexte
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true); // Pour savoir si on vérifie l'auth au chargement

    // Au premier chargement, on vérifie si un token valide existe
    useEffect(() => {
        const currentUser = authService.getCurrentUser();
        if (currentUser) {
            setUser(currentUser);
        }
        setLoading(false);
    }, []);

    // Fonction de connexion asynchrone
    const login = async (credentials) => {
        const data = await authService.login(credentials);
        const currentUser = authService.getCurrentUser();
        setUser(currentUser);
        return data; // On retourne la réponse de l'API (utile pour la redirection)
    };

    // Fonction d'inscription asynchrone
    const signup = async (userData) => {
        const data = await authService.signup(userData);
        const currentUser = authService.getCurrentUser();
        setUser(currentUser);
        return data;
    }

    // Fonction de déconnexion
    const logout = () => {
        authService.logout();
        setUser(null);
    };

    const value = useMemo(
        () => ({
            user,
            login,
            signup,
            logout,
            isAuthenticated: !!user,
            loading, // On expose l'état de chargement
        }),
        [user, loading]
    );

    // On n'affiche rien tant qu'on ne sait pas si l'utilisateur est connecté ou non
    return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};

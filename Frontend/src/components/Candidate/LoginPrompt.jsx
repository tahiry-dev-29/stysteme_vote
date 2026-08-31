// @ts-nocheck
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../common/Button';

/**
 * Carte affichée aux visiteurs non connectés à la place de la liste
 * des candidats : message clair + appels à l'action (connexion / inscription).
 * Accessible : role="status" annoncé par les lecteurs d'écran, icône décorative masquée.
 */
const LoginPrompt = ({ title = 'Découvrez les Candidats' }) => {
    const navigate = useNavigate();

    return (
        <div className="container shadow rounded-2xl mx-auto px-6 py-10">
            <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">{title}</h2>
            <div
                role="status"
                className="max-w-xl mx-auto text-center bg-indigo-50 border border-indigo-100 rounded-2xl p-8"
            >
                <svg
                    aria-hidden="true"
                    className="mx-auto mb-4 h-12 w-12 text-indigo-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.8}
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75M4.5 10.5h15v9.75a1.5 1.5 0 01-1.5 1.5h-12a1.5 1.5 0 01-1.5-1.5V10.5z"
                    />
                </svg>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    Connectez-vous pour voir la liste
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                    La liste des candidats est réservée aux membres.
                    Créez un compte gratuit pour découvrir les candidats et exprimer votre vote.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-3">
                    <Button
                        label="Se connecter"
                        onClick={() => navigate('/login')}
                        color="bg-indigo-700"
                        textColor="text-white"
                        hoverColor="hover:bg-indigo-600"
                    />
                    <Button
                        label="Créer un compte"
                        onClick={() => navigate('/register')}
                        color="bg-white"
                        textColor="text-indigo-700"
                        hoverColor="hover:bg-indigo-100"
                        className="border border-indigo-300"
                    />
                </div>
            </div>
        </div>
    );
};

export default LoginPrompt;

// @ts-ignore
import React, { useState, useEffect, useCallback } from 'react';
import CandidateCard from "./CandidateCard.jsx";
import LoginPrompt from "./LoginPrompt.jsx";
import Button from "../common/Button.jsx";
import {getAllCandidates} from "../../services/vote.js";

const CandidateList = () => {
    const [candidates, setCandidates] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isUnauthorized, setIsUnauthorized] = useState(false);

    const fetchCandidates = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await getAllCandidates();
            // @ts-ignore
            setCandidates(data);
        } catch (err) {
            // Session expirée ou visiteur non connecté → invite de connexion (pas une "erreur")
            if (err.response?.status === 401) {
                setIsUnauthorized(true);
            } else {
                const errorMessage = err.response?.data?.message || err.message || 'Échec du chargement des candidats.';
                setError(errorMessage);
                console.error("Erreur lors de la récupération des candidats:", err);
            }
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCandidates();
    }, [fetchCandidates]);


    if (isUnauthorized) {
        return <LoginPrompt />;
    }

    return (
        <div className="container shadow rounded-2xl mx-auto px-6 py-10"> {/* Assure un container avec padding pour les cartes */}

            <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">Découvrez les Candidats</h2>

            {isLoading && (
                <div className="text-center text-lg text-gray-600" role="status" aria-live="polite">
                    Chargement des candidats...
                </div>
            )}

            {error && (
                <div className="text-center bg-red-50 border border-red-100 p-6 rounded-xl max-w-md mx-auto" role="alert">
                    <p className="font-semibold text-red-700 mb-3">Une erreur est survenue lors du chargement des candidats.</p>
                    <Button
                        label="Réessayer"
                        onClick={fetchCandidates}
                        color="bg-indigo-700"
                        textColor="text-white"
                        hoverColor="hover:bg-indigo-600"
                    />
                </div>
            )}

            {!isLoading && !error && candidates.length === 0 && (
                <div className="text-center text-lg text-gray-600 p-6 bg-gray-50 rounded-lg shadow-sm">
                    Aucun candidat disponible pour le moment. Revenez plus tard !
                </div>
            )}

            {!isLoading && !error && candidates.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {}
                    {candidates.map((candidate) => (
                        // @ts-ignore
                        <CandidateCard key={candidate._id} candidate={candidate} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default CandidateList;

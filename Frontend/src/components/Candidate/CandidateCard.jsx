// src/components/vote/CandidateCard.jsx

import React from 'react';

/**
 * Composant pour afficher les informations détaillées d'un candidat.
 * Il est conçu pour être réutilisable et affichera le nom complet, l'image,
 * l'âge, le slogan, le parti et la description du candidat.
 *
 * @param {object} props - Les propriétés passées au composant.
 * @param {object} props.candidate - L'objet candidat contenant au moins
 * { _id, fullName, age, image, description, slogan, party, votes }.
 * @returns {JSX.Element} Le composant carte du candidat.
 */
const CandidateCard = ({candidate}) => {
    if (!candidate) {
        return null; // Ne rend rien si le candidat est nul ou indéfini
    }

    // Destructuration pour faciliter l'accès aux propriétés
    const {
        fullName,
        age,
        image,
        description,
        slogan,
        party,
        votes // Même si les votes ne sont pas affichés ici, c'est bon de les connaître
    } = candidate;

    return (
        <div
            className="bg-white rounded-xl shadow-md overflow-hidden p-6 transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-lg flex flex-col items-center text-center border-t-4 border-indigo-600">
            {/* Image du candidat */}
            <div className="w-32 h-32 rounded-full overflow-hidden mb-4 border-4 border-gray-200 shadow-md">
                <img
                    src={image || "https://placehold.co/128x128/E0E0E0/616161?text=No+Image"} // Utilise l'image du backend ou un placeholder
                    alt={`Profile de ${fullName}`}
                    className="w-full h-full object-cover"
                    onError={(e) => { // Gestion d'erreur si l'image ne charge pas
                        e.target.onerror = null; // Évite les boucles infinies
                        e.target.src = "https://placehold.co/128x128/E0E0E0/616161?text=Image+Error";
                    }}
                />
            </div>

            {/* Nom complet du candidat */}
            <h3 className="text-2xl font-bold text-gray-900 mb-1">
                {fullName || 'Nom Inconnu'}
            </h3>

            {/* Parti politique */}
            {party && (
                <p className="text-md font-semibold text-indigo-700 mb-2">
                    Parti : {party}
                </p>
            )}

            {/* Âge du candidat */}
            {age && (
                <p className="text-sm text-gray-700 mb-2">
                    Âge : {age} ans
                </p>
            )}

            {/* Slogan du candidat (mis en italique pour le style) */}
            {slogan && (
                <p className="text-base italic text-gray-800 mb-3 px-2">
                    "{slogan}"
                </p>
            )}

            {/* Description du candidat */}
            <p className="text-gray-600 text-sm mb-4 line-clamp-4"> {/* line-clamp pour limiter les lignes */}
                {description || 'Aucune description disponible.'}
            </p>

            {/* Optionnel: Afficher le nombre de votes si pertinent sur la Home page */}
            {/* Tu pourrais l'ajouter si tu veux montrer un aperçu des résultats ici*/
                <div className="mt-auto pt-4 border-t border-gray-200 w-full text-center">
                    <p className="text-lg font-bold text-green-700">{votes} votes</p>
                </div>
            }

            {/* Tu pourrais ajouter un bouton "Voter" ou un lien si c'est la page d'aperçu */}
            {/* Par exemple, si tu as un bouton "Voter" ici:*/
                <button
                    className="mt-4 bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-blue-700 transition duration-300">
                    Voter pour {fullName}
                </button>
            }
        </div>
    );
};

export default CandidateCard;

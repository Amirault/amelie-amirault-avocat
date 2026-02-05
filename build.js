const fs = require('fs');
const path = require('path');

// Test simple : lire le about.json et l'afficher
const about = JSON.parse(fs.readFileSync('content/about.json', 'utf8'));
console.log('Contenu about.json:', about.intro);

// Lire le HTML actuel
let html = fs.readFileSync('index.html', 'utf8');

// Test simple : remplacer une section spécifique de À propos
const searchText = 'Avocate à Fort-de-France, <strong>experte en droit social, droit du travail et droit de la Sécurité Sociale</strong>. \n                        Forte d\'une formation académique d\'excellence et d\'un parcours professionnel dans des \n                        cabinets de grande renommée, je mets à votre disposition une expertise juridique \n                        <strong>rigoureuse et pragmatique</strong>.';

// Remplacer par le contenu du JSON (avec support markdown)
const newText = about.intro.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\\\\\\n/g, '\n                        ');

if (html.includes(searchText)) {
  html = html.replace(searchText, newText);
  console.log('✅ Section À propos mise à jour!');
} else {
  console.log('⚠️  Texte de recherche non trouvé');
}

// Write output
fs.writeFileSync('index.html', html, 'utf8');

console.log('✅ Site généré avec succès !');

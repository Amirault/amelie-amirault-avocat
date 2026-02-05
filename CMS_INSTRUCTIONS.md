# Instructions pour le CMS

## 🎯 Accès à l'interface d'administration

Une fois le site déployé sur Netlify, vous pourrez modifier le contenu via une interface web intuitive.

### Étapes de configuration (à faire une seule fois)

1. **Aller sur le dashboard Netlify** : https://app.netlify.com
2. **Sélectionner votre site** : `amirault-avocat`
3. **Activer Netlify Identity** :
   - Aller dans **Site settings** → **Identity**
   - Cliquer sur **Enable Identity**
4. **Activer Git Gateway** :
   - Dans **Identity** → **Services** → **Git Gateway**
   - Cliquer sur **Enable Git Gateway**
5. **Inviter l'utilisateur admin** :
   - Aller dans **Identity** → **Invite users**
   - Entrer l'email de l'avocate
   - Elle recevra un email d'invitation

### Accès au CMS

- **URL d'administration** : `https://amirault-avocat.netlify.app/admin/`
- Se connecter avec l'email invité
- Créer un mot de passe lors de la première connexion

## ✏️ Que peut-on modifier ?

Via l'interface CMS, vous pourrez modifier :

### Informations générales
- Nom du cabinet
- Téléphone
- Email
- Adresse

### Section À propos
- Textes de présentation
- Badge d'expérience
- Langues parlées
- Texte sur les formations

### Honoraires
- Prix du premier rendez-vous
- Fourchette des honoraires
- Notes et conditions

### Contact
- Horaires d'ouverture
- Adresse complète

### Expertises
- Ajouter / modifier / supprimer des expertises
- Changer l'ordre d'affichage

## 🚀 Comment ça marche ?

1. **Connexion** : Aller sur `/admin/`
2. **Modification** : Cliquer sur la section à modifier
3. **Édition** : Modifier le texte dans l'éditeur
4. **Publication** : Cliquer sur "Publish"
5. **Déploiement automatique** : Le site se met à jour en ~30 secondes

## ⚠️ Important

- Les modifications sont sauvegardées dans Git
- Chaque modification crée un commit
- Le site se redéploie automatiquement après chaque publication
- Il est possible d'annuler les modifications via l'historique Git

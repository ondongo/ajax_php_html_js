<?php
include 'db/db_connect.php';

if (isset($_POST['numeroCompte']) && isset($_POST['nouveauCode'])) {
    $numeroCompte = $_POST['numeroCompte'];
    $nouveauCode = $_POST['nouveauCode'];
    $conn = connecterBDD();

    
    $sql_update_code = "UPDATE comptes SET code = '$nouveauCode' WHERE numero = '$numeroCompte'";

    if ($conn->query($sql_update_code) === TRUE) {
        echo "Code d'accès mis à jour avec succès.";
    } else {
        echo "Erreur lors de la mise à jour du code d'accès : " . $conn->error;
    }

    $conn->close();
} else {
    echo "Données manquantes. Veuillez remplir tous les champs.";
}

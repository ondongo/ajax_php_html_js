<?php
function connecterBDD() {
    $servername = "localhost";
    $username = "root";
    $password = "root";
    $dbname = "mydbCompte"; 

  
    $conn = new mysqli($servername, $username, $password, $dbname);

    // Vérifier la connexion
    if ($conn->connect_error) {
        die("La connexion à la base de données a échoué : " . $conn->connect_error);
    }

    return $conn;
}
?>
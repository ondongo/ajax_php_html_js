<?php
include 'db/db_connect.php';


if (isset($_POST['numeroCompte']) && isset($_POST['codeCompte'])) {
   
    $numeroCompte = $_POST['numeroCompte'];
    $codeCompte = $_POST['codeCompte'];

    $conn = connecterBDD();

    $sql = "SELECT solde FROM comptes WHERE numero = '$numeroCompte' AND code = '$codeCompte'";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {

        $row = $result->fetch_assoc();
        $solde = $row['solde'];
        $response = array(
            'success' => true,
            'solde' => $solde
        );
        echo json_encode($response);
    } else {
        $response = array(
            'success' => false,
            'message' => 'Numéro de compte ou code incorrect.'
        );
        echo json_encode($response);
    }
    $conn->close();
} else {
    $response = array(
        'success' => false,
        'message' => 'Paramètres manquants.'
    );
    echo json_encode($response);
}
?>

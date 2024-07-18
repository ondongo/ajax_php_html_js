<?php
include 'db/db_connect.php';


if (isset($_POST['numeroCompte'])) {
    $numeroCompte = $_POST['numeroCompte'];

    $conn = connecterBDD();

    $sql = "SELECT * FROM transactions
            WHERE numero_compte = '$numeroCompte'
            ORDER BY date_transaction DESC
            LIMIT 5";

    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        $transactions = array();

        while($row = $result->fetch_assoc()) {
            $transaction = array(
                'id' => $row['id'],
                'montant' => $row['montant'],
                'type_transaction' => $row['type_transaction'],
                'date_transaction' => $row['date_transaction']
            );
            $transactions[] = $transaction;
        }

        $response = array(
            'success' => true,
            'transactions' => $transactions
        );
        echo json_encode($response);
    } else {
        $response = array(
            'success' => false,
            'message' => 'Aucune transaction trouvée pour ce compte.'
        );
        echo json_encode($response);
    }

    $conn->close();
} else {
    $response = array(
        'success' => false,
        'message' => 'Paramètre manquant : numeroCompte.'
    );
    echo json_encode($response);
}
?>

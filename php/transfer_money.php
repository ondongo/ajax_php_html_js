<?php
include 'db/db_connect.php';

$numeroSource = $_POST['numeroSource'];
$numeroDestinataire = $_POST['numeroDestinataire'];
$montant = $_POST['montant'];

$conn = connecterBDD();


$sqlCheckSource = "SELECT solde FROM comptes WHERE numero = '$numeroSource'";
$resultCheckSource = $conn->query($sqlCheckSource);

if ($resultCheckSource->num_rows > 0) {
    $rowSource = $resultCheckSource->fetch_assoc();
    $soldeSource = $rowSource['solde'];


    $sqlCheckDest = "SELECT solde FROM comptes WHERE numero = '$numeroDestinataire'";
    $resultCheckDest = $conn->query($sqlCheckDest);

    if ($resultCheckDest->num_rows > 0) {
        if ($soldeSource >= $montant) {

            $conn->autocommit(FALSE);

            $nouveauSoldeSource = $soldeSource - $montant;
            $sqlUpdateSource = "UPDATE comptes SET solde = '$nouveauSoldeSource' WHERE numero = '$numeroSource'";
            $conn->query($sqlUpdateSource);

            $sqlUpdateDest = "UPDATE comptes SET solde = solde + '$montant' WHERE numero = '$numeroDestinataire'";
            $conn->query($sqlUpdateDest);


            $sqlInsertTransaction = "INSERT INTO transactions (numero_compte, montant, type_transaction) VALUES ('$numeroSource', '$montant', 'debit')";
            $conn->query($sqlInsertTransaction);

            $sqlInsertTransactionDest = "INSERT INTO transactions (numero_compte, montant, type_transaction) VALUES ('$numeroDestinataire', '$montant', 'credit')";
            $conn->query($sqlInsertTransactionDest);

            $conn->commit();
            echo "Transfert d'argent réussi.";
        } else {
            echo "Solde insuffisant pour effectuer ce transfert.";
        }
    } else {
        echo "Compte destinataire non trouvé.";
    }
} else {
    echo "Compte source non trouvé.";
}

$conn->close();

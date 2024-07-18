

/************************************************************/
/*          Menu functions                       */
/***********************************************************/

function menu() {
  var choixService = document.getElementById("serviceInput").value;
  switch (choixService) {
    case "1":
      var numeroCompte = document.getElementById("numeroCompteDisplay").textContent.trim();
      fetchAndDisplaySolde(numeroCompte);
      break;
    case "2":
      afficherTransfert();
      break;
    case "3":
      afficherPaiementFacture();
      break;
    case "4":
      afficherAutresOptions();
      break;
    default:
      alert("Choix invalide. Veuillez sélectionner un service valide.");
  }
}

function menuOther() {
  var inputNumber = parseInt(document.getElementById("serviceInputOther").value);
  switch (inputNumber) {
    case 1:
      afficherChangeCodeForm();
      break;
    case 2:
      afficherTransactions();
      break;
    default:
      alert("Numéro de service invalide. Veuillez choisir un nombre entre 1 et 2.");
  }
}


/************************************************************/
/*          classCss Hidden Container functions                       */
/***********************************************************/

function cacherTousLesContainers() {
  var containers = document.querySelectorAll(".containerMenuAccount, .containerAutresOptions, .containerChangeCode, .containerTransactions");
  containers.forEach(container => {
    container.classList.add("hidden");
  });
}

function afficherChangeCodeForm() {
  cacherTousLesContainers();
  document.querySelector(".containerChangeCode").classList.remove("hidden");
}


function afficherTransactions() {
  cacherTousLesContainers();
  document.querySelector(".containerTransactions").classList.remove("hidden");
  fetchTransactions(document.getElementById("numeroCompteDisplay").textContent.trim());
}

function afficherSolde() {
  document.querySelector(".containerMenuAccount").classList.add("hidden");
  document.querySelector(".containerBalance").classList.remove("hidden");

}

function afficherTransfert() {
  document.querySelector(".containerMenuAccount").classList.add("hidden");
  document.querySelector(".containerTransfert").classList.remove("hidden");
}

function afficherPaiementFacture() {
  document.querySelector(".containerMenuAccount").classList.add("hidden");

}

function afficherAutresOptions() {
  cacherTousLesContainers();
  document.querySelector(".containerAutresOptions").classList.remove("hidden");
}

function retourMenu() {
  document
    .querySelectorAll(
      ".containerBalance, .containerTransfert, .containerPaiementFacture, .containerChangeCode, .containerTransactions"
    )
    .forEach((container) => container.classList.add("hidden"));
  document.querySelector(".containerMenuAccount").classList.remove("hidden");
}

/************************************************************/
/*           Ajax functions                       */
/***********************************************************/

function validerCompte() {
  var numeroCompte = document.getElementById("number").value;
  var codeCompte = document.getElementById("code").value;

  if (!numeroCompte || !codeCompte) {
    alert("Veuillez remplir tous les champs.");
    return;
  }

  var data = {
    numeroCompte: numeroCompte,
    codeCompte: codeCompte
  };

  $.ajax({
    url: 'php/validate_account.php',
    type: 'POST',
    dataType: 'json',
    data: data,
    success: function(response) {
      if (response.success) {
        $('#numeroCompteDisplay').text(numeroCompte);
        $('.containerCheckAccount').addClass('hidden');
        $('.containerMenuAccount').removeClass('hidden');
      } else {
        alert("Erreur : " + response.message);
      }
    },
    error: function(xhr, status, error) {
      alert("Erreur lors de la requête : " + status);
    }

  });  
}


function fetchAndDisplaySolde(numeroCompte) {
  $.ajax({
    url: 'php/fetch_balance.php',
    type: 'POST',
    dataType: 'json',
    data: { numeroCompte: numeroCompte },
    success: function(response) {
      if (response.success) {
        $('#soldeCompte').text(response.solde + ' FCFA');
        afficherSolde();
        $('#numeroCompteAffiche').text(numeroCompte);
      } else {
        alert("Erreur : " + response.message);
      }
    },
    error: function(xhr, status, error) {
      alert("Erreur lors de la récupération du solde : " + status);
    }
  });
}


function effectuerTransfert() {
  var numeroSource = document.getElementById("numeroCompteDisplay").textContent.trim();
  var numeroDestinataire = document.getElementById("numDestinataire").value;
  var montant = document.getElementById("montantTransfert").value;
  if (!numeroDestinataire || !montant) {
    alert("Veuillez remplir tous les champs."); 
    return;
  }
  $.ajax({
    url: 'php/transfer_money.php',
    type: 'POST',
    data: {
      numeroSource: numeroSource,
      numeroDestinataire: numeroDestinataire,
      montant: montant
    },
    success: function(response) {
      alert(response);
      $('.containerTransfert').addClass('hidden');
      $('.containerMenuAccount').removeClass('hidden');
    },
    error: function(xhr, status, error) {
      alert("Erreur lors de la requête : " + status);
    }
  });
}

function changerCode() {
  var numeroCompte = document.getElementById("numCompteChange").value;
  var nouveauCode = document.getElementById("nouveauCode").value;

  if (numeroCompte === "" || nouveauCode === "") {
    alert("Veuillez remplir tous les champs.");
    return;
  }

  $.ajax({
    url: 'php/change_password.php',
    type: 'POST',
    data: {
      numeroCompte: numeroCompte,
      nouveauCode: nouveauCode
    },
    success: function(response) {
      alert(response);
      $('.containerChangeCode').addClass('hidden');
      $('.containerCheckAccount').removeClass('hidden');
    },
    error: function(xhr, status, error) {
      alert("Erreur lors de la requête : " + status);
    }
  });
}


function fetchTransactions(numeroCompte) {
  $.ajax({
    url: 'php/fetch_transactions.php',
    type: 'POST',
    dataType: 'json',
    data: { numeroCompte: numeroCompte },
    success: function(response) {
      var transactionsList = document.getElementById("transactionsList");
      transactionsList.innerHTML = ""; // Efface le contenu précédent

      if (response.success) {
        var transactions = response.transactions;
        transactions.forEach(function(transaction) {
          var transactionItem = document.createElement("div");
          transactionItem.textContent = "Montant: " + transaction.montant + " FCFA, Type: " + transaction.type_transaction + ", Date: " + transaction.date_transaction;
          transactionsList.appendChild(transactionItem);
        });
      } else {
        var errorMessage = document.createElement("p");
        errorMessage.textContent = "Erreur : " + response.message;
        transactionsList.appendChild(errorMessage);
      }
    },
    error: function(xhr, status, error) {
      alert("Erreur lors de la récupération des transactions : " + status);
    }
  });
}
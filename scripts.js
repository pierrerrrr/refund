const form = document.querySelector("form");
const amount = document.getElementById("amount");
const expense = document.getElementById("expense");
const category = document.getElementById("category");

const expenseList = document.querySelector("ul");
const expensesQuantity = document.querySelector("aside header p span");
const expenseTotal = document.querySelector("aside header h2");

amount.oninput = () => {
  // regex para impedir a entrada de letras (simples)
  let value = amount.value.replace(/\D/g, "");

  // transforma em cents para a formatação funcionar
  value = Number(value) / 100;

  // retorno o valor formatado (sem letras)
  amount.value = formatCurrencyBRL(value);
};

function formatCurrencyBRL(value) {
  // formata o valor no padrão BRL
  value = value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  return value;
}

form.onsubmit = (event) => {
  event.preventDefault();

  // cria um objeto com os detalhes da nova despesa
  const newExpense = {
    // cria o ID com o timestamp
    id: new Date().getTime(),
    expense: expense.value,
    category_id: category.value,
    // aqui ele pega o texto dentro das opções do select
    category_name: category.options[category.selectedIndex].text,
    amount: amount.value,
    created_at: new Date(),
  };

  expenseAdd(newExpense);
};

// adiciona um novo item na lista
function expenseAdd(newExpense) {
  try {
    // elementos para adicionar na lista
    const expenseItem = document.createElement("li");
    expenseItem.classList.add("expense");

    // setando o icone do item
    const expenseIcon = document.createElement("img");
    expenseIcon.setAttribute("src", `img/${newExpense.category_id}.svg`);
    expenseIcon.setAttribute("alt", newExpense.category_name);

    const expenseInfo = document.createElement("div");
    expenseInfo.classList.add("expense-info");

    const expenseName = document.createElement("strong");
    expenseName.textContent = newExpense.expense;

    const expenseCategory = document.createElement("span");
    expenseCategory.textContent = newExpense.category_name;

    const expenseAmount = document.createElement("span");
    expenseAmount.classList.add("expense-amount");
    expenseAmount.innerHTML = `<small>R$</small>${newExpense.amount
      .toUpperCase()
      .replace("R$", "")}`;

    const expenseRemove = document.createElement("img");
    expenseRemove.classList.add("remove-icon");
    expenseRemove.setAttribute("src", "img/remove.svg");
    expenseRemove.setAttribute("alt", "remover");

    // add name e category nas informações da despesa
    expenseInfo.append(expenseName, expenseCategory);

    // adiciona as informações no item
    expenseItem.append(expenseIcon, expenseInfo, expenseAmount, expenseRemove);

    // adiciona o item na lista
    expenseList.append(expenseItem);

    // limpa o form
    formClear();

    updateTotals();
  } catch (error) {
    alert("Não foi possível atualizar a lista de despesas!");
    console.log(error);
  }
}

// atualiza os totais
function updateTotals() {
  try {
    // recupera todos os items da lista
    const items = expenseList.children;

    // atualiza a quantidade de itens na lista
    expensesQuantity.textContent = `${items.length} ${
      items.length > 1 ? "despesas" : "despesa"
    }`;

    let total = 0;

    // percorre cada item da lista
    for (let item = 0; item < items.length; item++) {
      const itemAmount = items[item].querySelector(".expense-amount");

      let value = itemAmount.textContent
        // removendo caracteres não numéricos
        .replace(/[^\d,]/g, "")
        .replace(",", ".");

      value = parseFloat(value);

      if (isNaN(value)) {
        return alert(
          "não é foi possível calcular o total. o valor não parece ser um número"
        );
      }

      total += Number(value);
    }

    const symbolBRL = document.createElement("small");
    symbolBRL.textContent = "R$";

    total = formatCurrencyBRL(total).toUpperCase().replace("R$", "");

    // limpa o conteúdo do elemento
    expenseTotal.innerHTML = "";

    expenseTotal.append(symbolBRL, total);
  } catch (error) {
    console.log(error);
    alert("não foi possível atualizar os valores totais");
  }
}

// evento que captura os clicks na lista
expenseList.addEventListener("click", (event) => {
  if (event.target.classList.contains("remove-icon")) {
    // obtem a li pai do elemento clicado
    const item = event.target.closest(".expense");

    item.remove();
  }

  // atualiza os totais
  updateTotals();
});

// limpa campos depois da conversão do form
function formClear() {
  expense.value = "";
  category.value = "";
  amount.value = "";

  expense.focus();
}

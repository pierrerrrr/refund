const form = document.querySelector("form");
const amount = document.getElementById("amount");
const expense = document.getElementById("expense");
const category = document.getElementById("category");

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
};

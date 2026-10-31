async function carregarProduto() {
  const botao = document.querySelector("#comprar");
  const preco = document.querySelector("#preco");
  const status = document.querySelector("#status");
  try {
    const resposta = await fetch("./config/produto.json", { cache: "no-store" });
    if (!resposta.ok) throw new Error("Não foi possível carregar a configuração");
    const produto = await resposta.json();
    if (typeof produto.preco === "number") {
      preco.textContent = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(produto.preco);
    }
    const url = produto.checkoutUrl;
    if (typeof url === "string" && /^https:\/\//i.test(url)) {
      const destino = new URL(url);
      if (!["cakto.com.br", "pay.cakto.com.br"].includes(destino.hostname)) {
        throw new Error("Domínio de checkout não autorizado");
      }
      botao.href = destino.href;
      botao.textContent = "Ir para o checkout";
      botao.classList.remove("desabilitado");
      botao.removeAttribute("aria-disabled");
      status.textContent = "Link de checkout configurado.";
    }
  } catch (erro) {
    console.error("Configuração do produto:", erro);
    status.textContent = "Checkout indisponível neste momento.";
  }
}
document.querySelector("#comprar").addEventListener("click", (evento) => {
  if (evento.currentTarget.getAttribute("aria-disabled") === "true") evento.preventDefault();
});
carregarProduto();

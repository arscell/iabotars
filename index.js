const express = require("express");
const axios = require("axios");
require("dotenv").config();

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("ARSCELL BOT rodando liso!");
});

app.post("/pergunta", async (req, res) => {
  const pergunta = req.body.mensagem;
  if (!pergunta) return res.status(400).json({ erro: "Mensagem vazia" });

  try {
    const resposta = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "Você é um atendente simpático, técnico e objetivo da assistência ARSCELL." },
          { role: "user", content: pergunta }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );
    res.json({ resposta: resposta.data.choices[0].message.content });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ erro: "Erro ao consultar a IA" });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`ARSCELL BOT online na porta ${port}`);
});

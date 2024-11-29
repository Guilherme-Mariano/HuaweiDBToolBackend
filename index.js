require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const port = 3030 || process.env.PORT;

app.use(express.json());
app.use(cors());


mongoose.connect(process.env.mongo, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Conectado ao MongoDB Atlas'))
  .catch((err) => console.log('Erro ao conectar ao MongoDB', err));

const perguntaSchema = new mongoose.Schema({
  enunciado: { type: String, required: true },
  type: {type:String, required: true},
  options: { type: [String], required: false },
  correctOption: { type: [String], required: true },
});

const Pergunta = mongoose.model('Pergunta', perguntaSchema);

app.post('/pergunta', async (req, res) => {
  console.log(req.body)
  const enunciado = req.body.enunciado
  const type = req.body.type
  const options = req.body.options
  const correctOption = req.body.checkedOptions

  if (!enunciado || !type || !correctOption) {
    return res.status(400).json({ erro: 'Enunciado, tipo e Resposta Correta são obrigatórios.' });
  }

  try {
    const novaPergunta = new Pergunta({
      enunciado,
      type,
      options,
      correctOption,
    });

    await novaPergunta.save();
    res.status(201).json({ mensagem: 'Pergunta criada com sucesso!', pergunta: novaPergunta });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao salvar a pergunta', detalhe: err.message });
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});

import express from 'express';
import { pool } from './db.js';

const app = express();

app.use(express.json());
app.use(express.static('public'));

app.get('/produtos', async (req, res) => {

    const busca = req.query.busca;

    let sql = 'SELECT * FROM produto ORDER BY id';
    let parametros = [];

    if (busca) {
        sql = 'SELECT * FROM produto WHERE nome LIKE ? ORDER BY id';
        parametros = [`%${busca}%`];
    }

    const [rows] = await pool.execute(sql, parametros);

    res.json(rows);
});

app.get('/categorias', async (req, res) => {
    const [rows] = await pool.execute(
        'SELECT * FROM categoria ORDER BY id'
    );

    res.json(rows);
});

app.post('/produtos', async (req, res) => {

    const { nome, preco, estoque, categoria_id } = req.body;

    const [result] = await pool.execute(
    'INSERT INTO produto (nome, preco, estoque, categoria_id) VALUES (?, ?, ?, ?)',
    [nome, preco, estoque ?? 0, categoria_id]
    );
    
    res.status(201).json({ id: result.insertId, nome, preco });
});

app.post('/categorias', async (req, res) => {

    const { nome } = req.body;

    const [result] = await pool.execute(
        'INSERT INTO categoria (nome) VALUES (?)',
        [nome]
    );
        
    res.status(201).json({ id: result.insertId, nome});

});

app.delete('/produtos/:id', async (req, res) => {

    const { id } = req.params;

    const [result] = await pool.execute(
        'DELETE FROM produto WHERE id = ?',
        [id]
    );

    if (result.affectedRows === 0) {
        return res.status(404).json({ erro: 'Produto não encontrado' });
    }

    res.status(204).end();

});


app.listen(3000, () => {
    console.log('Servidor funcionando na porta 3000!');
});
const express = require('express');
const session = require('express-session');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const userRoutes = require('./routes/userRoutes');
const admin_userRoutes = require('./routes/admin_userRoutes');
const genericRoutes = require('./routes/genericRoutes');
const forumRoutes = require('./routes/forumRoutes');
const areaRoutes = require('./routes/areaRoutes');
const estabRoutes = require('./routes/estabelecimentoRoutes');
const eventRoutes = require('./routes/eventoRoutes');
const partRoutes = require('./routes/participacaoRoutes');
const formularioRoutes = require('./routes/formularioRoutes');
const centroRoutes = require('./routes/centroRoutes');
const albumRoutes = require('./routes/albumRoutes');
const utilizadorGrupoRoutes = require('./routes/utilizadorGrupoRoutes');
const grupoRoutes = require('./routes/grupoRoutes');
const comentarioRoutes = require('./routes/comentarioRoutes');
const sequelize = require('./configs/database');
const errorHandler = require('./middleware/errorHandler');
const dotenv = require('dotenv');
const path = require('path');
const multer = require('multer');
const fs = require('fs');

dotenv.config();

const app = express();

app.set('port', process.env.PORT || 3000);

// Defina o caminho de upload
const uploadDir = path.join(__dirname, '../uploads');

// Verifique se o diretório existe e crie-o se não existir
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configuração do armazenamento de arquivos
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir); // Caminho para onde o arquivo será salvo
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname)); // Nome do arquivo no destino
    }
});

// Instância do multer com as configurações
const upload = multer({ storage });

app.use('/uploads', express.static(uploadDir)); // Middleware para servir arquivos estáticos

// Middlewares
app.use(express.json());
app.use(cors());

// Configuração de headers CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

// Rotas
app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/generic', genericRoutes);
app.use('/estab', estabRoutes);
app.use('/forum', forumRoutes);
app.use('/areas', areaRoutes);
app.use('/envt', eventRoutes);
app.use('/part', partRoutes);
app.use('/form', formularioRoutes);
app.use('/centros', centroRoutes);
app.use('/album', albumRoutes);
app.use('/grupo', grupoRoutes);
app.use('/comentario', comentarioRoutes);
app.use('/admin', adminRoutes);
app.use('/utilizadorgrupo', utilizadorGrupoRoutes);
app.use('/adminuser', admin_userRoutes);




// Middleware para upload de arquivos
app.use(upload.single('file'));

// Rota de exemplo
app.get('/', (req, res) => {
    res.send('API está a funcionar. Acesse /api/data para obter dados.');
});

app.get('/health', (req, res) => {
    res.send('API está funcionando corretamente.');
});

// Middleware de tratamento de erros
app.use(errorHandler);

// Sincroniza os modelos com a base de dados e inicia o servidor
sequelize.sync({ alter: true })
    .then(() => {
        app.listen(app.get('port'), () => {
            console.log(`Servidor está a funcionar em http://localhost:${app.get('port')}`);
        });
    })
    .catch(err => {
        console.error('Erro ao sincronizar com a base de dados:', err);
    });

module.exports = app;

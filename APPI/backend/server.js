const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const bodyParser = require('body-parser'); // Importa bodyParser
const app = express()
app.use(express.json());
app.use(cors());


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ limit: '10mb' }));


const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password:"",
    database: "safestore"
})

const credentials = {
    host: "localhost",
    user: "root",
    password:"",
    database: "safestore"
};

app.post( '/signup', (req, res) =>{
    const sql= "INSERT INTO `usuario`(`id_usuario`, `Nombre`, `App`, `Apm`, `Correo`, `Contraseña`, `Telefono` ) VALUES (null,?,?,?,?,?,?)";
    
  
    db.query(sql, [
        req.body.name,
        req.body.app,
        req.body.apm,
        req.body.email,
        req.body.password,
        req.body.tel], (err, data) =>{
        if(err) return res.json(err);
        return res.json(data);
    })

  
})

app.post('/login', (req,res)=>{
    const {email, password}=req.body
    const values= [email, password]
    var connection = mysql.createConnection(credentials)
    connection.query("SELECT  * FROM usuario WHERE Correo= ? AND Contraseña = ? ", values, (err, result)=>{
        if (err) {
            res.status(500).send (err)
        } else {
            if (result.length > 0) {
				res.status(200).send({
                    "id": result[0].id,
					"user": result[0].user,
					"username": result[0].username
				})
			} else {
				res.status(400).send('Usuario no existe')
			}
        }
    })
    connection.end()
})

app.get('/registros', (req, res)=>{
    const sql= "SELECT * FROM usuario";

    db.query(sql, (err,data)=>{
        if(err) return res.json("Error");
        res.json(data);
    })
})

// // Eliminar un registro


// router.delete('/registros/:id', (req, res)=>{
//     const id= req.params.id;
//     connection.query("DELETE * FROM usuario WHERE id=?,", id, (err, results)=>{
//     if (err){
//         console.error('Error al eliminar el registro:',err);
//         return;
//     }
//     res.json({message:'Registro Eliminado correctamente'});
//     });
// });



//Eliminar Usuarios 
app.delete("/registros/:id", (req, res) => {
    const id = req.params.id;
    const sql = "DELETE FROM usuario WHERE id_usuario = ?";
    
    db.query(sql, id, (err, result) => {
        if (err) {
            // En caso de error en la consulta, devolvemos un código de estado 500 y el error
            return res.status(500).json({ error: "Error al eliminar el registro", details: err });
        }
        
        if (result.affectedRows === 0) {
            // Si ningún registro fue afectado por la consulta, devolvemos un código de estado 404
            return res.status(404).json({ error: "No se encontró ningún registro para eliminar" });
        }

        // Si la eliminación fue exitosa, devolvemos un código de estado 200 y un mensaje de éxito
        return res.status(200).json({ message: "Registro eliminado correctamente" });
    });
});


// Ruta para editar usuarios
app.put("/registros/:id", (req, res) => {
    const id = req.params.id;
    const datosActualizados = req.body;
    const sql= "UPDATE `usuario` SET ? WHERE id_usuario = ?";

    db.query(sql, [datosActualizados, id],  (err, data)=>{
        if(err) return res.json(err);
        return res.json("Datos Actualizados Correctamente") 
    })
});


// app.get( '/signup', (req, res) =>{
//     const sql= "INSERT INTO `usuario`(`id_usuario`,`Nombre`, `App`, `Apm`, `Correo`, `Contraseña`, `Telefono`) VALUES (null,?,?,?,?,?,?)";
//     db.query(sql, [ "id_usuario","Administrador", "Daniel", "Fonseca", "Torres", "fonseca@gmail.com", "1234567", 12345678, 1], (err, data) =>{
//         if(err) return res.json(err);
//         return res.json(data);
//     })
// })

app.listen(8080, ()=> {
    console.log("Ya cargue...");
})


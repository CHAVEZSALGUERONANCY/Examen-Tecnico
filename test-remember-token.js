// test-remember-token.js
const { promisePool } = require('./config/db');
const userModel = require('./models/user.model');

const testRememberToken = async () => {
    try {
        console.log('=== PRUEBA DE REMEMBER_TOKEN ===\n');
        
        // 1. Verificar estructura de la tabla
        const [columns] = await promisePool.query(
            'SHOW COLUMNS FROM usuarios WHERE Field = "remember_token"'
        );
        
        if (columns.length > 0) {
            console.log('✅ Columna remember_token existe en la tabla');
            console.log('  - Tipo:', columns[0].Type);
            console.log('  - Nulo:', columns[0].Null);
        } else {
            console.log('❌ Columna remember_token NO existe');
        }

        // 2. Verificar usuarios existentes
        const [users] = await promisePool.query(
            'SELECT id, email, remember_token FROM usuarios'
        );
        
        console.log(`\n📊 Usuarios encontrados: ${users.length}`);
        users.forEach(user => {
            console.log(`  - ${user.email}: ${user.remember_token ? '✅ Tiene token' : '❌ Sin token'}`);
        });

        // 3. Probar setRememberToken con un usuario
        if (users.length > 0) {
            const testUser = users[0];
            const testToken = 'test_token_' + Date.now();
            
            console.log(`\n🧪 Probando setRememberToken con usuario ${testUser.email}...`);
            await userModel.setRememberToken(testUser.id, testToken);
            
            const [updated] = await promisePool.query(
                'SELECT remember_token FROM usuarios WHERE id = ?',
                [testUser.id]
            );
            
            console.log(`  - Token guardado: ${updated[0].remember_token === testToken ? '✅ Correcto' : '❌ Error'}`);
            
            // 4. Probar clearRememberToken
            console.log(`\n🧪 Probando clearRememberToken...`);
            await userModel.clearRememberToken(testUser.id);
            
            const [cleared] = await promisePool.query(
                'SELECT remember_token FROM usuarios WHERE id = ?',
                [testUser.id]
            );
            
            console.log(`  - Token eliminado: ${cleared[0].remember_token === null ? '✅ Correcto' : '❌ Error'}`);
        }

        console.log('\n=== PRUEBA COMPLETADA ===');
        
    } catch (error) {
        console.error('Error en prueba:', error);
    } finally {
        process.exit();
    }
};

testRememberToken();
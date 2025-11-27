/**
 * Teste da função Desvio Absoluto Máximo (MAD)
 * Este arquivo pode ser usado para testar a implementação da função MAD
 */

function testarDesvioAbsolutoMaximo() {
    /**
     * Implementação de teste da função MAD
     */
    function calcularDesvioAbsolutoMaximo(valores) {
        if (!Array.isArray(valores) || valores.length === 0) {
            throw new Error('Desvio absoluto máximo requer um array de valores não vazio');
        }
        
        // Filtrar valores válidos (números)
        const valoresValidos = valores.filter(v => typeof v === 'number' && !isNaN(v));
        
        if (valoresValidos.length === 0) {
            throw new Error('Nenhum valor numérico válido encontrado para calcular o desvio absoluto máximo');
        }
        
        // Calcular a média
        const media = valoresValidos.reduce((soma, valor) => soma + valor, 0) / valoresValidos.length;
        
        // Calcular os desvios absolutos
        const desviosAbsolutos = valoresValidos.map(valor => Math.abs(valor - media));
        
        // Retornar o máximo dos desvios absolutos
        return Math.max(...desviosAbsolutos);
    }

    // Testes
    console.log('=== TESTES DA FUNÇÃO MAD ===');
    
    // Teste 1: Valores simples
    const teste1 = [10, 12, 8, 15, 9];
    const resultado1 = calcularDesvioAbsolutoMaximo(teste1);
    console.log(`Teste 1: [${teste1.join(', ')}]`);
    console.log(`Média: ${teste1.reduce((a, b) => a + b) / teste1.length}`);
    console.log(`MAD: ${resultado1}`);
    console.log(`Esperado: 4.2, Resultado: ${resultado1.toFixed(1)}`);
    console.log('---');
    
    // Teste 2: Valores com outlier
    const teste2 = [100, 101, 102, 99, 150];
    const resultado2 = calcularDesvioAbsolutoMaximo(teste2);
    console.log(`Teste 2: [${teste2.join(', ')}]`);
    console.log(`Média: ${teste2.reduce((a, b) => a + b) / teste2.length}`);
    console.log(`MAD: ${resultado2}`);
    console.log('---');
    
    // Teste 3: Valores iguais (MAD = 0)
    const teste3 = [5, 5, 5, 5, 5];
    const resultado3 = calcularDesvioAbsolutoMaximo(teste3);
    console.log(`Teste 3: [${teste3.join(', ')}]`);
    console.log(`MAD: ${resultado3}`);
    console.log(`Esperado: 0, Resultado: ${resultado3}`);
    console.log('---');
    
    // Teste 4: Valores decimais
    const teste4 = [2.5, 3.1, 2.8, 4.2, 2.9];
    const resultado4 = calcularDesvioAbsolutoMaximo(teste4);
    console.log(`Teste 4: [${teste4.join(', ')}]`);
    console.log(`MAD: ${resultado4.toFixed(3)}`);
    console.log('---');
    
    // Teste 5: Tratamento de erro - array vazio
    try {
        calcularDesvioAbsolutoMaximo([]);
    } catch (error) {
        console.log(`Teste 5 (erro esperado): ${error.message}`);
    }
    console.log('---');
    
    // Teste 6: Tratamento de erro - valores inválidos
    try {
        calcularDesvioAbsolutoMaximo(['a', 'b', 'c']);
    } catch (error) {
        console.log(`Teste 6 (erro esperado): ${error.message}`);
    }
    console.log('---');
    
    // Teste 7: Array misto (com valores válidos e inválidos)
    const teste7 = [10, 'invalid', 12, null, 8, undefined, 15, 9];
    const resultado7 = calcularDesvioAbsolutoMaximo(teste7);
    console.log(`Teste 7: Array misto filtrado para [10, 12, 8, 15, 9]`);
    console.log(`MAD: ${resultado7.toFixed(1)}`);
    console.log('---');
    
    console.log('=== TESTES CONCLUÍDOS ===');
}

// Para testar no console do navegador:
// testarDesvioAbsolutoMaximo();

export { testarDesvioAbsolutoMaximo };
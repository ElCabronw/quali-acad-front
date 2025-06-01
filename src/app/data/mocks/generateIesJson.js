const fs = require('fs');

// JSON carregado (substituir pelo conteúdo do seu arquivo JSON)
const jsonData = require('./csvjson.json');

// Função para gerar o JSON com propriedades específicas
function generateIesJson(data) {
  const uniqueIes = new Map();

  data.forEach(item => {
    if (!uniqueIes.has(item.ies)) {
      uniqueIes.set(item.ies, {
        id: uniqueIes.size + 1, // Gera um ID único
        ies: item.ies,
        site: item.site || '',
        endereco: item.endereco || '',
        telefone: item.telefone || '',
        cidade: item.cidade || '',
        estado: item.estado || ''
      });
    }
  });

  return Array.from(uniqueIes.values());
}

const filteredData = generateIesJson(jsonData);


fs.writeFileSync('filtered_ies.json', JSON.stringify(filteredData, null, 2), 'utf-8');

console.log('Arquivo JSON gerado com sucesso!');

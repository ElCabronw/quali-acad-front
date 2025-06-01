import json
import os
def get_value_or_default(item_dict, possible_keys, default_value=None):
    """
    Busca um valor no dicionário 'item_dict' tentando uma lista de 'possible_keys'.
    Retorna o primeiro valor encontrado que não seja None e não seja uma string vazia.
    Caso contrário, retorna 'default_value'.
    """
    for key in possible_keys:
        value = item_dict.get(key) # item_dict.get(key) retorna None se a chave não existir
        if value is not None and str(value).strip() != '':
            return value
    return default_value

def transform_data(input_data_list):
    """
    Transforma a lista de dicionários de entrada para o formato desejado.
    """
    formatted_data_list = []
    for index, item in enumerate(input_data_list):
        # Gera o ID incremental começando em 1
        item_id = index + 1

        # Busca e transforma os valores usando o helper
        raw_ano_avaliacao = get_value_or_default(item, ['ANO DE AVALIAÇÃO', 'anoAvaliacao', 'Ano de Avaliação'])
        ano_avaliacao = int(raw_ano_avaliacao) if raw_ano_avaliacao is not None else None

        raw_avaliacao = get_value_or_default(item, ['AVALIAÇÃO', 'avaliacao', 'Avaliação'])
        avaliacao = str(raw_avaliacao) if raw_avaliacao is not None else "Sem notas"

        transformed_item = {
            "anoAvaliacao": ano_avaliacao,
            "avaliacao": avaliacao,
            "campus": get_value_or_default(item, ['CAMPUS', 'campus', 'Campus']),
            "categoria": get_value_or_default(item, ['CATEGORIA', 'categoria', 'Categoria']),
            "cidade": get_value_or_default(item, ['CIDADE', 'cidade', 'Cidade']),
            "curso": get_value_or_default(item, ['NOME/CURSO', 'curso', 'NOME DO CURSO', 'Nome do Curso']),
            "duracao": get_value_or_default(item, ['DURAÇÃO', 'duracao', 'Duração']),
            "endereco": get_value_or_default(item, ['ENDEREÇO', 'endereco', 'Endereço']),
            "estado": get_value_or_default(item, ['ESTADO', 'estado', 'Estado']),
            "id": item_id,
            "ies": get_value_or_default(item, ['IES', 'ies', 'Ies']),
            "modalidade": get_value_or_default(item, ['MODALIDADE', 'modalidade', 'Modalidade']),
            "site": get_value_or_default(item, ['SITE', 'site', 'Site']),
            "telefone": get_value_or_default(item, ['TELEFONE', 'telefone', 'Telefone']),
            "titulacao": get_value_or_default(item, ['TITULAÇÃO', 'titulacao', 'Titulação']),
            "verbete": get_value_or_default(item, ['VERBETE', 'verbete', 'Verbete'])
        }
        formatted_data_list.append(transformed_item)

    return formatted_data_list

def main():
    # Define o nome do arquivo de entrada e saída
    # Certifique-se que 'csvjson-UPDATE.json' está no mesmo diretório que o script,
    # ou forneça o caminho completo.
    script_dir = os.path.dirname(os.path.abspath(__file__))
    input_filename_base = 'csvjson-UPDATE.json'
    input_filename = os.path.join(script_dir, input_filename_base)
    output_filename_base = 'formattedJson2223.json'
    output_filename = os.path.join(script_dir, output_filename_base)

    # Tenta ler o arquivo JSON de entrada
    try:
        with open(input_filename, 'r', encoding='utf-8') as f_in:
            original_data = json.load(f_in)
    except FileNotFoundError:
        print(f"Erro: Arquivo de entrada '{input_filename}' não encontrado.")
        return
    except json.JSONDecodeError:
        print(f"Erro: Arquivo de entrada '{input_filename}' não contém um JSON válido.")
        return
    except Exception as e:
        print(f"Ocorreu um erro inesperado ao ler o arquivo '{input_filename}': {e}")
        return

    # Verifica se o JSON carregado é uma lista
    if not isinstance(original_data, list):
        print(f"Erro: O conteúdo de '{input_filename}' não é uma lista de objetos JSON.")
        return

    # Transforma os dados
    transformed_data = transform_data(original_data)

    # Tenta escrever os dados transformados no arquivo JSON de saída
    try:
        with open(output_filename, 'w', encoding='utf-8') as f_out:
            # json.dump escreve o objeto Python como JSON no arquivo
            # indent=2 para formatação "bonita" (pretty-print)
            # ensure_ascii=False para permitir caracteres acentuados diretamente no JSON
            json.dump(transformed_data, f_out, ensure_ascii=False, indent=2)
        print(f"Arquivo '{output_filename}' criado com sucesso com IDs incrementais!")
    except IOError:
        print(f"Erro: Não foi possível escrever no arquivo de saída '{output_filename}'.")
    except Exception as e:
        print(f"Ocorreu um erro inesperado ao escrever o arquivo '{output_filename}': {e}")

# Executa a função principal se o script for rodado diretamente
if __name__ == '__main__':
    main()

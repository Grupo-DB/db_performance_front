export type AvaliacaoResponse = {
    id: string,
    tipo: string,
    colaborador: string,
    avaliador: string,
    formulario: string,
    data_avaliacao: Date,
    periodo: string,
    perguntasRespostas:JSON
}
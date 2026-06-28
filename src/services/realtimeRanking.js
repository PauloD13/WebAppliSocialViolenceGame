/**
 * @deprecated WebSocket de ranking removido na v2.
 * O ranking foi eliminado do produto. A pontuação agora é salva
 * diretamente no banco de dados via REST (PUT /usuario/update/:id).
 *
 * Este arquivo existe apenas para não quebrar imports legados durante
 * uma transição incremental. Pode ser deletado com segurança quando
 * todas as referências forem removidas.
 */

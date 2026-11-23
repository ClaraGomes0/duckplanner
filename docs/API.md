# API do DuckPlanner (back-end Spring Boot)

O front-end chama `/api/...`. O Nginx encaminha essas chamadas para o container `backend` (porta 8080).

## Matérias (tabela `disciplinas`)
| Método | Endereço | O que faz |
|---|---|---|
| GET | /api/disciplinas | Lista as matérias |
| POST | /api/disciplinas | Cadastra `{ "nome": "Matemática", "dificuldade": 4 }` |
| DELETE | /api/disciplinas/{id} | Remove a matéria (e as sessões dela) |

## Disponibilidade (tabela `disponibilidades`)
| Método | Endereço | O que faz |
|---|---|---|
| GET | /api/disponibilidades | Lista os horários livres |
| POST | /api/disponibilidades | Cadastra `{ "dia": "Segunda-feira", "inicio": "08:00", "fim": "10:00" }` |
| DELETE | /api/disponibilidades/{id} | Remove um horário |

## Cronograma (tabela `sessoes_estudo`)
| Método | Endereço | O que faz |
|---|---|---|
| GET | /api/sessoes | Lista o cronograma salvo |
| PUT | /api/sessoes | Substitui o cronograma: `[ { "dia": "Segunda-feira", "materia": "Matemática", "inicio": "08:00", "fim": "09:00" } ]` |
| PATCH | /api/sessoes/{id}/concluida | Marca/desmarca como concluída |
| DELETE | /api/sessoes | Apaga o cronograma |

## Arquitetura
Navegador -> Nginx (frontend, porta 8080) -> Spring Boot (backend, porta 8081 no PC / 8080 no container) -> PostgreSQL (db)

# Gabriel Content Admin v2.2

Correção desta versão:
- A aba **All Works** agora reconhece `src/data/projects.ts` mesmo quando o arquivo usa TypeScript com tipo, por exemplo `export const projects: Project[] = [...]`.
- Também melhora a leitura de arrays tipados como `string[]`.

## Instalação
Coloque estes arquivos na raiz do projeto, no mesmo nível de `package.json` e `src/`:

- `tools/content-admin.mjs`
- `Start Content Admin.command`

Depois rode:

```bash
node tools/content-admin.mjs
```

Abra:

```text
http://localhost:5177
```

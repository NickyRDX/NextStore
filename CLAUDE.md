@AGENTS.md
---
name: commit
description: Hace git add, genera un commit message descriptivo y hace push a origin main
---

Ejecutá el siguiente flujo de git para guardar y subir los cambios actuales:

1. Corré `git status` para ver qué archivos cambiaron
2. Corré `git diff` para entender qué se modificó en detalle
3. Ejecutá `git add .`
4. Generá un mensaje de commit que:
   - Resuma los cambios en menos de 50 caracteres (en inglés, tiempo presente)
   - Explique el *qué* y el *por qué*, no el cómo
   - Use prefijos convencionales cuando corresponda: `feat:`, `fix:`, `refactor:`, `chore:`
5. Ejecutá `git commit -m "<mensaje generado>"`
6. Ejecutá `git push -u origin main`
7. Confirmame que todo salió bien mostrando el output del push
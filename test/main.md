---
kernelspec:
  name: python3
  display_name: Python3
execute:
  depends_on_env: 
    - CI
---

```{code-cell} python3
import os

assert "CI" not in os.environ
```

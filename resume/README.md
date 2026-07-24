# Resume source

`fred-zirbel-resume.tex` is the maintainable source for the public one-page résumé.

Build from the repository root:

```powershell
pdflatex -interaction=nonstopmode -halt-on-error -output-directory=public resume/fred-zirbel-resume.tex
```

The generated `public/fred-zirbel-resume.pdf` is intentionally committed so the statically exported site can link it without requiring LaTeX in CI.

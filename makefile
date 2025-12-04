all: dev
.PHONY: build g dev
dev:
	npm run dev
build:
	npm run build
g:
	git add --all
	git commit
	git push origin main
dep: build g

all: dev
.PHONY: dev build g gh dep w
dev:
	npm run dev
build:
	npm run build
g:
	git add --all
	git commit
	git push origin main
gh:
	gh workflow run static.yml
dep: build g gh
w:
	gh run watch

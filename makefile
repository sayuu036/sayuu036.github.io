all: dev
.PHONY: dev build g gh w
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
w:
	gh run watch

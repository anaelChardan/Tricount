DOCKER_COMPOSE := docker-compose
YARN := $(DOCKER_COMPOSE) run --rm node yarn

.DEFAULT_GOAL := list
.PHONY: list
list:
	@echo "*********************"
	@echo "${YELLOW}Available targets${RESTORE}:"
	@echo "*********************"
	@grep -E '^[a-zA-Z-]+:.*?## .*$$' Makefile | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "[32m%-15s[0m %s\n", $$1, $$2}'

.PHONY: yarn
yarn: ## Launch yarn with C argument
	@$(YARN) ${C}

.PHONY: install
install: ## Install the project
	@$(YARN) install

.PHONY: test
test: ## Run jest test
	@$(YARN) jest
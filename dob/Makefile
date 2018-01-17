## Aliases
DOCKER_COMPOSE = docker-compose

test:
	@$(DOCKER_COMPOSE) run --rm \
                         -e TEST=true \
                        dob python -m unittest tests

.PHONY: test

install-prod:
	yarn install
	yarn build
	yarn start

	# Configure and create the env file
# Usage: make config env={local | dev | prod}
config:
	node ./node_modules/app-json-env-gen/cli.js target=$(env) output=./src/config/env.js
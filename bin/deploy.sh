
#!/usr/bin/env bash

# clean
rm -rf -v .aws-sam/*

# dependencies install
yarn

# build proyect
npm run build

# sam:package
sam package --template-file template.yaml --s3-bucket <bucket-name> --s3-prefix <bucket-prefix> --output-template-file template.packaged.yaml # FIXME: update <bucket-name> and <bucket-prefix> before to use

# sam:deploy
sam deploy --template-file template.packaged.yaml --stack-name <stackName> --capabilities CAPABILITY_IAM --parameter-override Environment=dev --no-fail-on-empty-changeset # FIXME: update <stackName> and Environment=dev  before to use

# TODO: Augmented to support multiples environments.
#!/usr/bin/env bash

# Used within skaffold.yaml and for pre-push commits. Makes sure that we send built images up to our
# ECR repo in nprinfra.
export VERSION=0.7.0
export ECR=162258779877.dkr.ecr.us-east-1.amazonaws.com
export DOCKER_REGISTRY_ORG=npr
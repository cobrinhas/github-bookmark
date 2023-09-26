#!/usr/bin/env bash


tag=v$(cat package.json | grep version | cut -d '"' -f 4)

git tag $tag | echo "New tag: $tag"

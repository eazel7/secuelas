#! /bin/bash

git add . && git commit -m 'version bump' && git push && npm publish --access=restricted

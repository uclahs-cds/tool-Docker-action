# Changelog

All notable changes to the tool_name Docker file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

This project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.1.1] - 2024-10-18

### Added

- Action for automatic Docker image build and push
- Custom tag option
- Add `context` argument to allow for Dockerfiles in subfolders
- Delete docker versions when git branches/tags are deleted
- Add `non-semver-tags` argument to allow building on non-semver tags
- Add optional `file` argument to pass through to docker/build-push-action

### Changed

- Unpack `build-release` folder
- Replace `jbutcher5/read-yaml` with `mikefarah/yq` for YAML parsing
- Use `${github.token}` as default value for `github-token`.
- Require usage of \<<http://ghcr.io>>, change `registry` input to `organization`
- Build on pushes to all branches
- Tag non-`main` branches as `branch-<branchname>`
- Handle `/` characters in tags when branch names contain them

[2.1.1]: https://github.com/uclahs-cds/tool-Docker-action/releases/tag/v2.1.1

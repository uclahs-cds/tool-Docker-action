# Docker Build Action

An Action to automatically build and push images to the [GitHub Container registry](https://github.com/features/packages).

## Description

This action will build and push images of the form `ghcr.io/<organization>/<image>:<version>`. The `<version>` field is controlled by the following logic:

| Pushed Ref | Type | Resulting Tag |
| ---------- | -------------- | ----------------- |
| `main` | default branch | `dev` |
| `mybranch` | branch | `branch-mybranch` |
| `v1.2.3` | tag | `1.2.3` |
| `v3-beta` (requires `non-semver-tags`) | tag | `3-beta` |

When a git branch or tag is deleted, the corresponding docker will be deleted as well.

### Version Tag Formats

By default this Action only recognizes tags in SemVer format (e.g. `v1.2.3-rc.1`). To allow non-SemVer tags (e.g. `v3-beta`), set the `non-semver-tags` input to `true`. All tags must still start with a `v` to be recognized.

## Usage

```yaml
---
name: Update image in GHCR

run-name: >
  ${{
    github.event_name == 'delete' && format(
      'Delete `{0}{1}`',
      github.event.ref_type == 'branch' && 'branch-' || '',
      github.event.ref
    )
    || github.ref == 'refs/heads/main' && 'Update `dev`'
      || format(
        'Update `{0}{1}`',
        !startsWith(github.ref, 'refs/tags') && 'branch-' || '',
        github.ref_name
      )
  }} docker tag

on:
  push:
    branches-ignore: ['gh-pages']
    tags: ['v*']
  delete:

jobs:
  push-or-delete-image:
    runs-on: ubuntu-latest
    name: Update GitHub Container Registry
    permissions:
      contents: read
      packages: write
    steps:
      - uses: uclahs-cds/tool-Docker-action@v2
```

The complicated `run-name` logic above controls the workflow run names listed on the Actions page:

| Ref Name | Ref Type | `push` Run Name | `delete` Run Name |
| -------------------- | -------- | ----------------------------------- | ----------------------------------- |
| Push to `main` | branch | Update `dev` docker tag | Delete `dev` docker tag |
| Push to `mybranch` | branch | Update `branch-mybranch` docker tag | Delete `branch-mybranch` docker tag |
| Push to `v1.2.3` tag | tag | Update `v1.2.3` docker tag | Delete `v1.2.3` docker tag |

### Inputs

| Name | Default | Description |
| ---- | ------- | ----------- |
| `organization` | -- | The GitHub organizational host of the image. Defaults to the organization of the calling repository. |
| `metadata-file` | `metadata.yaml` | Metadata file storing the image name. |
| `image-name-key-path` | `.image_name` | [`yq`](https://github.com/mikefarah/yq) query for the image name within the metadata file. |
| `github-token` | `github.token`  | Token used for authentication. Requires `contents: read` for the calling repository and `packages:write` for the host organization. |
| `custom-tags` | -- | Additional lines to add to the [docker/metadata-action `tags` argument](https://github.com/docker/metadata-action?tab=readme-ov-file#tags-input). |
| `context` | `.` | The docker build context. Only required if the `Dockerfile` is not in the repository root. |
| `non-semver-tags` | -- | If set to a non-empty string, non-SemVer tags will be recognized. |

## License

Author: Nicholas Wiltsie (nwiltsie@mednet.ucla.edu), Yash Patel (yashpatel@mednet.ucla.edu)

tool-docker-action is licensed under the GNU General Public License version 2. See the file LICENSE.md for the terms of the GNU GPL license.

Copyright (C) 2024 University of California Los Angeles ("Boutros Lab") All rights reserved.

This program is free software; you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation; either version 2 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.

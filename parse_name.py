#!/usr/bin/env python3
"""A cheap imitation of 'yq'."""

import os
from pathlib import Path

import yaml


def main():
    """Extract the image name from the metadata file."""
    workspace = Path(os.environ["GITHUB_WORKSPACE"]).resolve()
    metadata_file = Path(os.environ["METADATA_FILE"]).resolve()

    if not metadata_file.is_relative_to(workspace):
        raise ValueError("Metadata file must be within the repository itself!")

    if not metadata_file.is_file():
        raise ValueError("Metadata file does not exist!")

    with metadata_file.open(mode="rb") as infile:
        data = yaml.safe_load(infile)

    key_paths = os.environ["IMAGE_KEYPATH"].split(".")

    if not key_paths or key_paths[0] != "" or len(key_paths) < 2:
        raise ValueError("Invalid key path format!")

    key_paths.pop(0)

    result = data
    for key_path in key_paths:
        result = result[key_path]

    with open(os.environ["GITHUB_OUTPUT"], mode="a", encoding="utf-8") as outfile:
        outfile.write(f"result={result}\n")

if __name__ == "__main__":
    main()

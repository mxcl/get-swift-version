# mxcl/get-swift-version

A multiplatform action to extract the active Swift version into various step outputs.

## [Sponsor @mxcl](https://github.com/sponsors/mxcl)

I can only afford to maintain projects I need or that are sponsored. Thanks.

## Usage

```yaml
jobs:
  my-job:
    runs-on: ubuntu-latest
    steps:
      - use: mxcl/get-swift-version@v1
        id: swift
      - run: echo ${{ steps.swift.outputs.version }}
      - run: echo ${{ steps.swift.outputs.major-version }}
      - run: echo ${{ steps.swift.outputs.minor-version }}
      - run: echo ${{ steps.swift.outputs.patch-version }}
      - run: echo ${{ steps.swift.outputs.marketing-version }}
```

Will output:

```
5.4.1
5
4
1
5.4
```

## Enforce Swift Version

Optionally this action can enforce an expected Swift version:

```yaml
jobs:
  my-job:
    runs-on: ubuntu-latest
    steps:
      - use: mxcl/get-swift-version@v1
        with:
          requires: ~5.4  # a semantically versioned constraint
```

If the Swift version is not >=5.4 and < 5.5 the action will fail.

# Suggested with `actions/cache`

```yaml
- uses: mxcl/get-swift-version@v1
  id: swift
- uses: actions/cache@v2
  with:
    path: .build
    key: ${{ runner.os }}-swift-${{ steps.swift.outputs.marketing-version }}-${{ hashFiles('Package.resolved') }}
    restore-keys: ${{ runner.os }}-swift-${{ steps.swift.outputs.marketing-version }}
```

With Swift >=5.5 this will save you quite a bit of build time while ensuring major changes
to the build files formats with new marketing versions will not break your CI.

# The `marketing-version` is more useful than you think

```yaml
jobs:
  my-job:
    runs-on: ubuntu-latest
    steps:
      - use: mxcl/get-swift-version@v1
        id: swift
      - run: echo ARGS=--enable-code-coverage >> $GITHUB_ENV
        if: ${{ steps.swift.outputs.marketing-version > 5.1 }}
```

Because `marketing-version` is always “floaty”, GHA can do a numeric comparison operator on it.

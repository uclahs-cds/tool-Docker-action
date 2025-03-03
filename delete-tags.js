module.exports = async ({ github, context, core }) => {
  const { IMAGE_NAME, ORGANIZATION } = process.env

  let tagName

  if (context.payload.ref_type === 'branch') {
    tagName = `branch-${context.payload.ref.replace('/', '-')}`
  } else {
    tagName = context.payload.ref.match(/^v(.*)$/)[1]
  }

  let didDelete = false

  for await (const response of github.paginate.iterator(
    github.rest.packages.getAllPackageVersionsForPackageOwnedByOrg, {
      package_type: 'container',
      package_name: IMAGE_NAME,
      org: ORGANIZATION
    })) {
    for (const version of response.data) {
      const tags = version.metadata?.container?.tags
      if (tags?.includes(tagName)) {
        core.notice(`Package version ${version.html_url} matches tag ${tagName} and will be deleted`)

        const otherTags = tags.filter((tag) => tag !== tagName)
        if (otherTags.length) {
          core.warning(`Image version has other tags that will be lost: ${otherTags}`)
        }

        await github.rest.packages.deletePackageVersionForOrg({
          package_type: 'container',
          package_name: IMAGE_NAME,
          org: ORGANIZATION,
          package_version_id: version.id
        })

        didDelete = true
        break
      }
    }
    if (didDelete) {
      break
    }
  }

  if (!didDelete) {
    core.warning(`Did not find version tagged ${tagName}`)
  }
}
